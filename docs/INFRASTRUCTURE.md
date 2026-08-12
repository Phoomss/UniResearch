# 🏗️ UniResearch: เอกสารโครงสร้างพื้นฐานและการติดตั้งใช้งาน (Infrastructure & Deployment Guide)

เอกสารนี้ระบุรายละเอียดเกี่ยวกับโครงสร้างพื้นฐาน (Infrastructure) ของระบบ **UniResearch** ซึ่งครอบคลุมการจัดการทรัพยากรบนระบบคลาวด์ AWS ด้วย Terraform, การจัดลำดับคอนเทนเนอร์ด้วย Kubernetes (K8s), และระบบตรวจสอบประสิทธิภาพ (Monitoring) ด้วย Prometheus และ Grafana

---

## 🗺️ ภาพรวมสถาปัตยกรรมทางกายภาพ (Deployment Architecture)

```mermaid
graph TD
    Client([ผู้ใช้งานภายนอก]) -->|HTTP/HTTPS Port 80/443| Ingress[Kubernetes Ingress / Nginx]
    
    subgraph Kubernetes Cluster (AWS EC2 Nodes)
        direction TB
        Ingress -->|Route /| FE[Frontend Pods - Next.js]
        Ingress -->|Route /api| BE[Backend Pods - FastAPI]
        FE -->|Internal Requests| BE
        BE -->|AsyncPG| DB[(PostgreSQL Pod)]
        
        subgraph Monitoring Namespace
            Prom[Prometheus Pod] -->|Scrape Metrics| BE
            Grafana[Grafana Pod] -->|Read Source| Prom
        end
    end
    
    subgraph Storage Volumes (EBS)
        DB -->|Mount /var/lib/...| DB_Vol[(Postgres PV)]
        BE -->|Mount /app/static| Static_Vol[(Static Assets PV)]
        Prom -->|Store TSDB| Prom_Vol[(Prometheus PV)]
        Grafana -->|Store Dashboards| Grafana_Vol[(Grafana PV)]
    end
```

---

## 1. ☁️ โครงสร้างพื้นฐานบน AWS ด้วย Terraform

ไฟล์คอนฟิกูเรชันของ Terraform อยู่ภายใต้โฟลเดอร์ [`infrastructure/terraform/`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/terraform) โดยมีหน้าที่สร้าง VPC, Subnet, Security Groups และเครื่อง EC2 Instances สำหรับการติดตั้ง Kubernetes Cluster (เช่น ใช้ Kubespray หรือ RKE2)

### รายละเอียดไฟล์
- [`provider.tf`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/terraform/provider.tf): กำหนด AWS Provider (เวอร์ชัน >= 6.0) และภูมิภาคเริ่มต้นที่ `ap-southeast-1` (สิงคโปร์)
- [`network.tf`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/terraform/network.tf): สร้าง VPC `10.0.0.0/16` และ Public Subnet `10.0.1.0/24` พร้อมเปิดใช้งาน Public IP อัตโนมัติและเชื่อมต่อกับ Internet Gateway (IGW)
- [`security.tf`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/terraform/security.tf): กำหนด Security Group `uniresearch` ที่อนุญาตสิทธิ์เข้าถึงพอร์ต:
  - `22` (SSH) จากทราฟฟิกภายนอก
  - `3000` (Next.js Frontend) จากภายนอก
  - `8000` (FastAPI Backend) จากภายนอก
  - `6443` (Kubernetes API server) ภายใน VPC เท่านั้น
  - `30000-32767` (Kubernetes NodePort) จากภายนอก
  - อนุญาตการเชื่อมต่อทุกพอร์ตภายใน Security Group เดียวกัน (Self)
- [`ec2.tf`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/terraform/ec2.tf): สร้างเครื่อง EC2 instance (Ubuntu 24.04 LTS, `c7i-flex.large`, พื้นที่เก็บข้อมูล gp3 ขนาด 50GB):
  - **Control Plane**: จำนวน 1 เครื่อง (`control-plane`)
  - **Worker Node**: จำนวน 2 เครื่อง (`worker-1`, `worker-2`)
- [`variables.tf`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/terraform/variables.tf) และ [`outputs.tf`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/terraform/outputs.tf): กำหนดตัวแปรและข้อมูลผลลัพธ์ (เช่น Control Plane Public IP และ Worker IPs)

### วิธีการใช้งาน
1. ตรวจสอบให้แน่ใจว่าติดตั้ง SSH key เรียบร้อยที่ `~/.ssh/id_ed25519.pub`
2. ตั้งค่าตัวแปรใน [`terraform.tfvars`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/terraform/terraform.tfvars):
   ```hcl
   key_name = "kubespray-key"
   ```
3. รันคำสั่งเปิดใช้งาน:
   ```bash
   cd infrastructure/terraform
   terraform init
   terraform plan
   terraform apply
   ```

---

## 2. ☸️ การจัดระเบียบคอนเทนเนอร์ด้วย Kubernetes (K8s)

รายละเอียด YAML ไฟล์สำหรับการรันระบบแอปพลิเคชันหลักภายใต้ Namespace `uniresearch` อยู่ในโฟลเดอร์ [`infrastructure/k8s/01-app/`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/01-app)

- [`00-namespace.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/01-app/00-namespace.yaml): สร้าง namespace ชื่อ `uniresearch` เพื่อแยกทรัพยากร
- [`01-postgres.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/01-app/01-postgres.yaml):
  - สร้าง PersistentVolumeClaim (`postgres-pvc`) ขนาด 10Gi สำหรับเก็บข้อมูล PostgreSQL
  - สร้าง Service และ Deployment รัน PostgreSQL 15-alpine แบบ Stateful
- [`02-backend.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/01-app/02-backend.yaml):
  - สร้าง PVC (`backend-static-pvc`) ขนาด 5Gi สำหรับเก็บไฟล์อัปโหลด เช่น PDFs และรูปภาพหน้าปก
  - รัน FastAPI Backend จำนวน 2 Replicas เพื่อการกระจายภาระงาน (Load Balancing)
  - ทำการอัปเกรด DB Schema อัตโนมัติในตอนเริ่มต้นด้วยคำสั่ง `alembic upgrade head`
- [`03-frontend.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/01-app/03-frontend.yaml):
  - รัน Next.js Frontend App จำนวน 2 Replicas
  - เชื่อมต่อกับ Backend ภายในผ่าน `http://backend:8000`
- [`04-ingress.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/01-app/04-ingress.yaml):
  - กำหนด Ingress Controller (Nginx Class) เพื่อจัดส่งทราฟฟิกภายนอกเข้ามาที่ Cluster
  - แมปโดเมน `uniresearch.local` โดยเส้นทางหลัก `/` จะถูกส่งต่อไปยัง Frontend และ `/api` จะถูกส่งต่อไปยัง Backend
- [`05-hpa.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/01-app/05-hpa.yaml):
  - กำหนด Horizontal Pod Autoscaler (HPA) สำหรับควบคุมการขยายตัวอัตโนมัติ (Autoscaling)
  - **backend-hpa**: ขนาด 2 ถึง 10 Pods (เริ่มทำงานเมื่อ CPU > 70% หรือ Memory > 80%)
  - **frontend-hpa**: ขนาด 2 ถึง 5 Pods (เริ่มทำงานเมื่อ CPU > 75% หรือ Memory > 80%)
- [`06-metrics.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/01-app/06-metrics.yaml): ติดตั้ง Kubernetes Metrics Server เพื่อทำหน้าที่รายงานการใช้ทรัพยากร CPU และ Memory สำหรับการทำงานของ HPA
- [`07-nginx_ingress_controller.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/01-app/07-nginx_ingress_controller.yaml): ติดตั้ง Nginx Ingress Controller เพื่อคอยดักจับและส่งทราฟฟิกภายนอกไปยัง Ingress Resource

---

## 3. 📊 ระบบการติดตามและประเมินประสิทธิภาพ (Monitoring)

ประกอบด้วย Prometheus, Grafana, และ Loki สำหรับตรวจสอบความพร้อมใช้งาน สถิติ เมตริกการทำงาน และล็อกของ Backend REST API และ Kubernetes Resources อยู่ในโฟลเดอร์ [`infrastructure/k8s/02-monitoring/`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/02-monitoring)

- [`00-namespace.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/02-monitoring/00-namespace.yaml): สร้าง namespace ชื่อ `monitoring` แยกเฉพาะสำหรับระบบติดตาม
- [`01-rbac.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/02-monitoring/01-rbac.yaml): กำหนดสิทธิ์แบบ ClusterRole และ ClusterRoleBinding ร่วมกับ ServiceAccount เพื่อให้ Prometheus สามารถเข้าดึงข้อมูล Metrics จาก Kubernetes API Server, Nodes, Endpoints และ Pods ได้
- [`02-prometheus.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/02-monitoring/02-prometheus.yaml):
  - สร้าง ConfigMap (`prometheus-config`) เพื่อเก็บการตั้งค่าการ Scrape Metrics
  - สร้าง PVC (`prometheus-pvc`) ขนาด 20Gi สำหรับเก็บข้อมูล Time-series Database
  - Deployment คอนเทนเนอร์ Prometheus (เวอร์ชัน `v3.5.0`) และผูกกับ ServiceAccount
  - เปิดพอร์ตเข้าใช้งานผ่าน NodePort `30900`
- [`03-grafana.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/02-monitoring/03-grafana.yaml):
  - สร้าง PVC (`grafana-pvc`) ขนาด 10Gi สำหรับเก็บข้อมูล Dashboard และการตั้งค่าของ Grafana
  - Deployment คอนเทนเนอร์ Grafana (เวอร์ชัน `12.1.1`) โดยตั้งค่าสิทธิ์ผู้ดูแลระบบเริ่มต้น (`admin` / `admin123`)
  - เปิดพอร์ตเข้าใช้งานผ่าน NodePort `30300`
- [`04-loki.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/02-monitoring/04-loki.yaml):
  - ติดตั้ง Loki สำหรับเก็บรวบรวม Log จาก Pods ต่างๆ ในระบบ
  - กำหนด Service และ StatefulSet สำหรับประมวลผลข้อมูล Log

นอกจากนี้ ระบบยังรองรับการติดตั้งผ่าน Helm Chart (เช่น kube-prometheus-stack และ loki-stack) เพื่อแก้ปัญหา Port Conflict ของ Sidecar และเพิ่มความยืดหยุ่นในการจัดการทรัพยากรบน Production สามารถศึกษาได้ที่ [`infrastructure_operations_guide.md`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/infrastructure_operations_guide.md)

---

## 🚀 วิธีการรันระบบทั้งหมดรวดเดียว

คุณสามารถสั่งรันทั้งแอปพลิเคชันหลักและระบบ Monitoring ทั้งหมดได้ผ่านสคริปต์ [deploy.sh](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/deploy.sh) ที่สร้างขึ้นมาเพื่อความสะดวกในการจัดการบน Production:

```bash
cd infrastructure
./deploy.sh
```

หากต้องการdeployผ่านระบบ Helm Stack (Prometheus, Grafana, Loki, Promtail) ให้ใช้สคริปต์ [deploy-monitoring-helm.sh](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/deploy-monitoring-helm.sh):

```bash
cd infrastructure
./deploy-monitoring-helm.sh
```

หลังจากติดตั้งแล้ว สามารถเข้าตรวจสอบได้ดังนี้:
- **แอปพลิเคชัน**: เข้าถึงผ่าน Ingress โดเมน `uniresearch.local`
- **Prometheus UI**: `http://<node-ip>:30900`
- **Grafana Dashboard**: `http://<node-ip>:30300` (เข้าสู่ระบบด้วยผู้ใช้ `admin` / รหัสผ่านที่ดึงจาก K8s Secret หรือรหัสผ่านตั้งต้น `admin123` สำหรับ Manual Deploy)
- **Loki logs**: สามารถคิวรีผ่าน Grafana UI Data Source


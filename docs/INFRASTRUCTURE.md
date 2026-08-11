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
  - **Worker Node**: จำนวน 3 เครื่อง (`worker-1`, `worker-2`, `worker-3`)
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

รายละเอียด YAML ไฟล์สำหรับการรันระบบแอปพลิเคชันหลักภายใต้ Namespace `uniresearch` อยู่ในโฟลเดอร์ [`infrastructure/k8s/`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s)

- [`00-namespce.yml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/00-namespce.yml): สร้าง namespace ชื่อ `uniresearch` เพื่อแยกทรัพยากร
- [`03-postgres-deployment.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/03-postgres-deployment.yaml):
  - สร้าง PersistentVolumeClaim (`postgres-pvc`) ขนาด 10Gi สำหรับเก็บข้อมูล PostgreSQL
  - สร้าง Service และ Deployment รัน PostgreSQL 15-alpine แบบ Stateful
- [`02-backend-deployment.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/02-backend-deployment.yaml):
  - สร้าง PVC (`backend-static-pvc`) ขนาด 5Gi สำหรับเก็บไฟล์อัปโหลด เช่น PDFs และรูปภาพหน้าปก
  - รัน FastAPI Backend จำนวน 2 Replicas เพื่อการกระจายภาระงาน (Load Balancing)
  - ทำการอัปเกรด DB Schema อัตโนมัติในตอนเริ่มต้นด้วยคำสั่ง `alembic upgrade head`
- [`01-frontend-deployment.yml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/01-frontend-deployment.yml):
  - รัน Next.js Frontend App จำนวน 2 Replicas
  - เชื่อมต่อกับ Backend ภายในผ่าน `http://backend:8000`
- [`04-ingress.yaml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/k8s/04-ingress.yaml):
  - กำหนด Ingress Controller (Nginx Class) เพื่อจัดส่งทราฟฟิกภายนอกเข้ามาที่ Cluster
  - แมปโดเมน `uniresearch.local` โดยเส้นทางหลัก `/` จะถูกส่งต่อไปยัง Frontend และ `/api` จะถูกส่งต่อไปยัง Backend

### วิธีการรันบน Cluster
```bash
kubectl apply -f infrastructure/k8s/00-namespce.yml
kubectl apply -f infrastructure/k8s/03-postgres-deployment.yaml
kubectl apply -f infrastructure/k8s/02-backend-deployment.yaml
kubectl apply -f infrastructure/k8s/01-frontend-deployment.yml
kubectl apply -f infrastructure/k8s/04-ingress.yaml
```

---

## 3. 📊 ระบบการติดตามและประเมินประสิทธิภาพ (Monitoring)

ประกอบด้วย Prometheus และ Grafana สำหรับตรวจสอบความพร้อมใช้งาน สถิติ และเมตริกการทำงานของ Backend REST API

### 🛡️ Prometheus
ไฟล์อยู่ใน [`infrastructure/promethus/`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/promethus):
- [`prometheus-pvc.yml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/promethus/prometheus-pvc.yml): ร้องขอพื้นที่จัดเก็บข้อมูลขนาด 10Gi
- [`prometheus-config.yml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/promethus/prometheus-config.yml): จัดเก็บค่าคอนฟิกเพื่อระบุตำแหน่งการดึงเมตริก (Scrape Target) จากเซิร์ฟเวอร์ `backend:8000`
- [`prometheus-service.yml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/promethus/prometheus-service.yml): เปิดพอร์ตเข้าใช้งานผ่าน NodePort `30090`
- [`prometheus.yml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/promethus/prometheus.yml): Deployment คอนเทนเนอร์ Prometheus

### 📈 Grafana
ไฟล์อยู่ใน [`infrastructure/grafana/`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/grafana):
- [`grafana-pvc.yml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/grafana/grafana-pvc.yml): ร้องขอพื้นที่เก็บข้อมูลสำหรับหน้า Dashboard ขนาด 5Gi
- [`grafana-service.yml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/grafana/grafana-service.yml): เปิดเข้าใช้บริการผ่าน NodePort `30300`
- [`grafana.yml`](file:///Users/mac/Desktop/workspace/UniResearch/infrastructure/grafana/grafana.yml): Deployment คอนเทนเนอร์ Grafana (พร้อมตั้งรหัสผ่าน Admin เริ่มต้นเป็น `admin`)

### วิธีการรันระบบการติดตาม
```bash
# ติดตั้ง Prometheus
kubectl apply -f infrastructure/promethus/prometheus-pvc.yml
kubectl apply -f infrastructure/promethus/prometheus-config.yml
kubectl apply -f infrastructure/promethus/prometheus-service.yml
kubectl apply -f infrastructure/promethus/prometheus.yml

# ติดตั้ง Grafana
kubectl apply -f infrastructure/grafana/grafana-pvc.yml
kubectl apply -f infrastructure/grafana/grafana-service.yml
kubectl apply -f infrastructure/grafana/grafana.yml
```
หลังจากติดตั้งแล้ว สามารถเปิดหน้าเบราว์เซอร์ไปที่:
- **Prometheus UI**: `http://<node-ip>:30090`
- **Grafana Dashboard**: `http://<node-ip>:30300` (เข้าสู่ระบบด้วยผู้ใช้ `admin` / รหัสผ่าน `admin`)

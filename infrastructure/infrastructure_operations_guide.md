# 🛠️ UniResearch Infrastructure Operations Guide

This guide compiles all deployment, operations, and troubleshooting procedures for the UniResearch Kubernetes infrastructure on AWS.

---

## 🔄 1. Zero-Downtime Rolling Updates

The deployment strategies for both Frontend and Backend are configured to perform updates with zero downtime.

### Configuration
* **Strategy Type:** `RollingUpdate`
* **Settings:** `maxUnavailable: 0` (no pods are killed during rollout), `maxSurge: 1` (a new pod is created before an old one is destroyed).

### Operations Commands
1. **Apply deployment configurations:**
   ```bash
   kubectl apply -f k8s/01-app/02-backend.yaml
   kubectl apply -f k8s/01-app/03-frontend.yaml
   ```

2. **Trigger a manual rolling restart:**
   ```bash
   kubectl rollout restart deployment/frontend-deployment -n uniresearch
   kubectl rollout restart deployment/backend-deployment -n uniresearch
   ```

3. **Check rollout status:**
   ```bash
   kubectl rollout status deployment/frontend-deployment -n uniresearch
   kubectl rollout status deployment/backend-deployment -n uniresearch
   ```

---

## 📈 2. Horizontal Pod Autoscaling (HPA)

Autoscaling is configured to automatically scale pods up or down based on resource usage.

### Configuration File: `k8s/01-app/05-hpa.yaml`
* **backend-hpa:** Scales between `2` and `10` pods. Triggers when average CPU reaches `70%` or memory utilization reaches `80%`.
* **frontend-hpa:** Scales between `2` and `5` pods. Triggers when average CPU reaches `75%` or memory utilization reaches `80%`.

### Operations Commands
1. **Apply HPA configuration:**
   ```bash
   kubectl apply -f k8s/01-app/05-hpa.yaml
   ```

2. **Monitor HPA status:**
   ```bash
   kubectl get hpa -n uniresearch
   ```

3. **View detailed autoscale events:**
   ```bash
   kubectl describe hpa backend-hpa -n uniresearch
   ```

---

## 🔍 3. Nginx Ingress Controller Validation

### Verification Commands
1. **Verify controller Pods are running:**
   ```bash
   kubectl get pods -n ingress-nginx
   ```
2. **Check ingress routing status:**
   ```bash
   kubectl get ingress uniresearch-ingress -n uniresearch
   ```

---

## 📦 4. Monitoring Stack Setup (Helm)

We deploy Prometheus, Grafana, Loki, and Promtail using Helm charts to Namespace `monitoring`.

### Key Fixes Implemented
* **Grafana Port Conflict Resolution:** Configured dashboard and datasource sidecars to use different ports (`8081` and `8082`) to prevent `OSError: [Errno 98] Address in use` conflicts.
* **Loki Configuration:** Disabled default datasource options (`loki.isDefault=false`) and disabled persistence (`loki.persistence.enabled=false`) to bypass persistent volume limitations.

### Deployment Commands

1. **Deploy Loki & Promtail:**
   ```bash
   kubectl delete statefulset loki-stack -n monitoring --ignore-not-found=true

   helm upgrade --install loki-stack grafana/loki-stack \
     --namespace monitoring \
     --set loki.persistence.enabled=false \
     --set promtail.enabled=true \
     --set loki.isDefault=false
   ```

2. **Deploy Prometheus & Grafana (with NodePort `30300`):**
   ```bash
   helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
     --namespace monitoring \
     --set grafana.enabled=true \
     --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
     --set grafana.sidecar.dashboards.env.PORT=8081 \
     --set grafana.sidecar.datasources.env.PORT=8082 \
     --set grafana.service.type=NodePort \
     --set grafana.service.nodePort=30300
   ```

3. **Force recreate Grafana Pods if necessary:**
   ```bash
   kubectl delete pod -n monitoring -l app.kubernetes.io/name=grafana
   ```

---

## 🔑 5. Retrieve Grafana Admin Password

To retrieve the auto-generated password for the Grafana `admin` user:
```bash
kubectl get secret --namespace monitoring kube-prometheus-stack-grafana -o jsonpath="{.data.admin-password}" | base64 -d | base64 -d ; echo
```

---

## 📊 6. Grafana Dashboard IDs

| Dashboard Name | Dashboard ID | Target Metrics | Data Source |
| :--- | :---: | :--- | :---: |
| **Node Exporter Full** | **`1860`** | AWS EC2 VM usage (CPU, RAM, Disk, Network) | Prometheus |
| **Kubernetes App Monitoring** | **`15757`** | Resource usage per individual pod | Prometheus |
| **Loki Quick Search** | **`15141`** | Pod stdout logs query tool | Loki |

### To Import:
1. Go to **Dashboards** -> **New** -> **Import**.
2. Type the **Dashboard ID** (e.g., `1860`) and click **Load**.
3. Select the matching data source (Prometheus or Loki) and click **Import**.

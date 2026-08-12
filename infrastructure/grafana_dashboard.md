# 📊 Grafana Dashboards Guide for Kubernetes & Loki

This guide contains a curated list of high-quality, production-ready Grafana Dashboard IDs from [grafana.com](https://grafana.com/grafana/dashboards/) to help you monitor your Kubernetes cluster resources (nodes, pods, control plane) and view aggregated container logs via Grafana Loki.

---

## 🚀 Recommended Dashboard IDs

### 1. Node & Infrastructure Monitoring (Node Exporter)
These dashboards show VM-level metrics (CPU, Memory, Disk usage, I/O, Network traffic).

| Dashboard Name | Dashboard ID | Description |
| :--- | :---: | :--- |
| **Node Exporter Full** | **`1860`** | The industry standard for monitoring Linux server nodes. Shows CPU core loads, memory allocation, disk I/O, network bandwidth, and system load averages. Highly recommended for checking your AWS EC2 cluster health. |
| **Node Exporter Quickstart** | **`11074`** | A simplified, cleaner version of Node Exporter focusing on CPU, Memory, Disk, and Network traffic at a glance. |

### 2. Kubernetes Cluster & Resource Monitoring (cAdvisor / kube-state-metrics)
These dashboards monitor Kubernetes-specific resources (Namespaces, Pods, Deployments, and HPA).

| Dashboard Name | Dashboard ID | Description |
| :--- | :---: | :--- |
| **Kubernetes / K8s Cluster - Summary** | **`12740`** | Shows a high-level overview of the entire Kubernetes cluster: total CPU/Memory utilization, pod capacity limits, and cluster-wide resources. |
| **Kubernetes App Monitoring (Pods & Containers)** | **`15757`** | Excellent dashboard for viewing CPU and memory consumption per individual pod. Helps verify if your app pods (Frontend/Backend) are close to reaching their HPA CPU/Memory thresholds. |
| **Kubernetes / K8s - Pods** | **`14205`** | Visualizes individual pod metrics including CPU limit usage, memory limit usage, network traffic per pod, and container restart counts. |
| **Kubernetes / K8s - Namespace** | **`14202`** | Aggregates resource usage metrics by Kubernetes namespaces (e.g., `uniresearch`, `monitoring`, `kube-system`). |

### 3. Log Aggregation & Searching (Grafana Loki)
These dashboards help query and visualize container logs collected by Loki and Promtail.

| Dashboard Name | Dashboard ID | Description |
| :--- | :---: | :--- |
| **Loki Quick Search** | **`15141`** | A dedicated search dashboard that allows you to easily filter logs by Namespace, Pod, Container, or free-text search. Includes log volume graphs. |
| **Loki Logs dashboard** | **`13639`** | A clean layout specifically designed for displaying log streams with line counters and color-coded status levels. |

---

## 📥 How to Import a Dashboard in Grafana

Follow these steps to import any dashboard into your Grafana instance:

1. **Access Grafana Dashboard:**
   * Open Grafana Web UI (e.g., at `http://<VM_IP>:30300`).
   * Log in using your credentials (`admin` / password).

2. **Navigate to Import Page:**
   * On the left sidebar, click the **Dashboards** menu.
   * Click **New** (top-right corner) and select **Import**.

3. **Load via Dashboard ID:**
   * In the **Import via grafana.com** text box, enter the desired **Dashboard ID** (e.g., `1860`).
   * Click the **Load** button.

4. **Select Data Source:**
   * Name the dashboard or leave the default.
   * Select your **Prometheus** datasource (for K8s/Node metrics) or **Loki** datasource (for Loki search dashboards) from the dropdown list.
   * Click **Import**.

---

## 🪵 Connecting Grafana Loki Datasource

Before importing Loki dashboards, ensure Loki is added as a datasource in Grafana:

1. Go to **Connections** (on the left menu) -> **Data sources**.
2. Click **Add data source** and select **Loki**.
3. In the **Connection URL** setting, enter:
   ```text
   http://loki.monitoring.svc.cluster.local:3100
   ```
4. Scroll to the bottom and click **Save & test**. You should see a green success notification: *"Data source is working"*.

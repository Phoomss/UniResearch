#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting Helm Monitoring Stack Deployment ===${NC}"

# 1. Check if Helm is installed
if ! command -v helm &> /dev/null; then
    echo -e "${YELLOW}[1/4] Helm is not installed. Installing Helm...${NC}"
    curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
    chmod 700 get_helm.sh
    ./get_helm.sh
    rm get_helm.sh
else
    echo -e "${GREEN}[1/4] Helm is already installed.${NC}"
fi

# 2. Add Helm Repositories
echo -e "\n${YELLOW}[2/4] Adding Helm Repositories...${NC}"
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# 3. Install Prometheus & Grafana (kube-prometheus-stack)
echo -e "\n${YELLOW}[3/4] Deploying Prometheus and Grafana via kube-prometheus-stack...${NC}"
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set grafana.enabled=true \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set grafana.sidecar.dashboards.env.PORT=8081 \
  --set grafana.sidecar.datasources.env.PORT=8082 \
  --set grafana.service.type=NodePort \
  --set grafana.service.nodePort=30300

# 4. Install Loki & Promtail (loki-stack)
echo -e "\n${YELLOW}[4/4] Deploying Loki and Promtail via loki-stack...${NC}"
helm upgrade --install loki-stack grafana/loki-stack \
  --namespace monitoring \
  --set loki.persistence.enabled=true \
  --set loki.persistence.size=20Gi \
  --set promtail.enabled=true

echo -e "\n${GREEN}=== Monitoring Stack deployed successfully with Helm! ===${NC}"

# Show status
echo -e "\n${BLUE}=== Current Monitoring Pod Status ===${NC}"
kubectl get pods -n monitoring

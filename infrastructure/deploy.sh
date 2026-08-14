#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting UniResearch Infrastructure Deployment ===${NC}"

# 1. Create Namespace first
echo -e "\n${YELLOW}[1/2] Creating Namespace...${NC}"
kubectl apply -f k8s/01-app/00-namespace.yaml

# 2. Deploy Application Stack
echo -e "\n${YELLOW}[2/2] Deploying Application Stack (uniresearch)...${NC}"
kubectl apply -f k8s/01-app/01-postgres.yaml
kubectl apply -f k8s/01-app/02-backend.yaml
kubectl apply -f k8s/01-app/03-frontend.yaml
kubectl apply -f k8s/01-app/04-ingress.yaml
kubectl apply -f k8s/01-app/05-hpa.yaml

echo -e "\n${GREEN}=== Deployment applied successfully! ===${NC}"

# Show status
echo -e "\n${BLUE}=== Current Pod Status ===${NC}"
echo -e "${YELLOW}Namespace: uniresearch${NC}"
kubectl get pods -n uniresearch -o wide

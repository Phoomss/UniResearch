.PHONY: help dev dev-build up down restart logs logs-backend logs-frontend logs-db \
       ps shell-backend shell-frontend shell-db clean nuke prod prod-down \
       migrate migrate-create db-reset

# ─── Default ─────────────────────────────────────────────────────────────────
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─── Development ─────────────────────────────────────────────────────────────
dev: ## Start all services (development)
	docker compose up

dev-build: ## Rebuild and start all services (development)
	docker compose up --build

up: ## Start services in background (detached)
	docker compose up -d

down: ## Stop all services
	docker compose down

restart: ## Restart all services
	docker compose restart

# ─── Logs ────────────────────────────────────────────────────────────────────
logs: ## Tail logs for all services
	docker compose logs -f

logs-backend: ## Tail backend logs
	docker compose logs -f backend

logs-frontend: ## Tail frontend logs
	docker compose logs -f frontend

logs-db: ## Tail database logs
	docker compose logs -f db

# ─── Status ──────────────────────────────────────────────────────────────────
ps: ## Show running containers
	docker compose ps

# ─── Shell Access ────────────────────────────────────────────────────────────
shell-backend: ## Open a shell in the backend container
	docker compose exec backend bash

shell-frontend: ## Open a shell in the frontend container
	docker compose exec frontend sh

shell-db: ## Open psql in the database container
	docker compose exec db psql -U postgres -d uniresearch

# ─── Database ────────────────────────────────────────────────────────────────
migrate: ## Run alembic migrations
	docker compose exec backend alembic upgrade head

migrate-create: ## Create a new alembic migration (usage: make migrate-create MSG="your message")
	docker compose exec backend alembic revision --autogenerate -m "$(MSG)"

db-reset: ## Reset database (destroy volume and recreate)
	docker compose down -v
	docker compose up -d db
	@echo "Waiting for database to be ready..."
	@sleep 5
	docker compose up -d backend frontend

# ─── Cleanup ─────────────────────────────────────────────────────────────────
clean: ## Stop containers and remove volumes
	docker compose down -v

nuke: ## Full cleanup (containers, volumes, images, orphans)
	docker compose down -v --rmi local --remove-orphans

# ─── Production ──────────────────────────────────────────────────────────────
prod: ## Build and start production stack
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

prod-down: ## Stop production stack
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# ─── Kubernetes Deployment ───────────────────────────────────────────────────
k8s-deploy-app: ## Deploy application stack to Kubernetes
	./infrastructure/deploy.sh

k8s-deploy-monitoring: ## Deploy Helm monitoring stack to Kubernetes
	./infrastructure/deploy-monitoring-helm.sh

k8s-deploy-all: k8s-deploy-app k8s-deploy-monitoring ## Deploy both application and Helm monitoring stacks

.PHONY: help build dev down logs shell db-shell clean status migrate seed deploy-blue deploy-green down-blue down-green deploy-dev-blue deploy-dev-green down-dev-blue down-dev-green ps

# Default target
help:
	@echo "Available commands:"
	@echo "  help              Show this help message"
	@echo "  dev               Start dev container (hot reload) + db"
	@echo "  down              Stop and remove all containers"
	@echo "  down-dev          Stop dev server"
	@echo "  deploy-blue       Deploy blue production app"
	@echo "  deploy-green      Deploy green production app"
	@echo "  down-blue         Stop blue production app"
	@echo "  down-green        Stop green production app"
	@echo "  deploy-dev-blue   Deploy dev blue app"
	@echo "  deploy-dev-green  Deploy dev green app"
	@echo "  down-dev-blue     Stop dev blue app"
	@echo "  down-dev-green    Stop dev green app"
	@echo "  logs              Show logs for all services"
	@echo "  ps                List running containers"
	@echo "  shell             Open shell in the blue app container"
	@echo "  db-shell          Open psql shell in database"
	@echo "  clean             Remove all containers, images, and volumes"
	@echo "  status            Show status of all containers"
	@echo "  migrate           Run Prisma migrations"
	@echo "  seed              Run database seed"

# Start dev container (hot reload) + db
dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Stop and remove all containers
down:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml \
		-f docker-compose.prod.yml \
		down --remove-orphans

# Stop dev server
down-dev:
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		stop prompt-manager-blue && \
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		rm -f prompt-manager-blue

# Deploy blue production app
deploy-blue:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d prompt-manager-blue --build

# Deploy green production app  
deploy-green:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d prompt-manager-green --build

# Stop blue production app
down-blue:
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.prod.yml \
		stop prompt-manager-blue && \
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.prod.yml \
		rm -f prompt-manager-blue

# Stop green production app
down-green:
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.prod.yml \
		stop prompt-manager-green && \
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.prod.yml \
		rm -f prompt-manager-green

# Deploy dev blue app
deploy-dev-blue:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d prompt-manager-blue --build

# Deploy dev green app
deploy-dev-green:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d prompt-manager-green --build

# Stop dev blue app
down-dev-blue:
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		stop prompt-manager-blue && \
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		rm -f prompt-manager-blue

# Stop dev green app
down-dev-green:
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		stop prompt-manager-green && \
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		rm -f prompt-manager-green

# Follow logs
logs:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

# List running containers
ps:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml ps
# Open shell in blue app container
shell:
	docker compose exec prompt-manager-blue sh

# Open psql shell in database
db-shell:
	docker compose exec db psql -U postgres -d prompt_management

# Run Prisma migrations
migrate:
	docker compose exec prompt-manager-blue npx prisma migrate deploy

# Run database seed (if you have one)
seed:
	docker compose exec prompt-manager-blue npx prisma db seed

# Clean up everything
clean:
	@echo "Removing all containers, images, and volumes..."
	docker compose -f docker-compose.yml -f docker-compose.dev.yml \
		-f docker-compose.prod.yml down -v --remove-orphans
	docker system prune -af
	docker volume prune -f

# Show status of all containers
status:
	@echo "Container Status:"
	@docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo ""
	@echo "Health Status:"
	@echo "App Blue:  $$(curl -s http://localhost:3001/api/health 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo 'unreachable')"
	@echo "Database:  $$(docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1 && echo 'healthy' || echo 'unhealthy')"
	@echo "Nginx:     $$(curl -s http://localhost/nginx-health >/dev/null 2>&1 && echo 'healthy' || echo 'unhealthy')"

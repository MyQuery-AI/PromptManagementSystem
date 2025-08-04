#!/bin/bash

# Deployment script for Prompt Management System
# This script helps manage blue-green deployments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if service is healthy
check_health() {
    local service=$1
    local url=$2
    local max_attempts=12
    local attempt=1

    print_status "Checking health of $service..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            print_success "$service is healthy!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts: $service not ready, waiting..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    print_error "$service failed to become healthy after $((max_attempts * 5)) seconds"
    return 1
}

# Function to get current active deployment
get_active_deployment() {
    if docker-compose ps app-green | grep -q "Up"; then
        echo "green"
    else
        echo "blue"
    fi
}

# Function to deploy
deploy() {
    print_status "Starting deployment process..."
    
    # Build new image
    print_status "Building Docker image..."
    docker-compose build --no-cache
    
    # Determine which deployment to use
    current_deployment=$(get_active_deployment)
    if [ "$current_deployment" = "blue" ]; then
        new_deployment="green"
        old_deployment="blue"
    else
        new_deployment="blue"
        old_deployment="green"
    fi
    
    print_status "Current deployment: $current_deployment"
    print_status "Deploying to: $new_deployment"
    
    # Start new deployment
    if [ "$new_deployment" = "green" ]; then
        docker-compose --profile green up -d app-green
    else
        docker-compose up -d app-blue
    fi
    
    # Wait for new deployment to be healthy
    if ! check_health "$new_deployment deployment" "http://localhost:3060/api/health"; then
        print_error "New deployment failed to start. Rolling back..."
        docker-compose stop app-$new_deployment
        exit 1
    fi
    
    # Switch traffic
    print_status "Switching traffic to $new_deployment deployment..."
    if [ "$new_deployment" = "green" ]; then
        docker cp nginx-green.conf prompt-management-nginx:/etc/nginx/nginx.conf
    else
        docker cp nginx-blue.conf prompt-management-nginx:/etc/nginx/nginx.conf
    fi
    docker-compose exec nginx nginx -s reload
    
    # Wait a bit for traffic to switch
    sleep 5
    
    # Verify new deployment is serving traffic
    if ! check_health "new deployment after switch" "http://localhost:3060/api/health"; then
        print_error "New deployment not responding after traffic switch. Rolling back..."
        # Switch back
        if [ "$old_deployment" = "green" ]; then
            docker cp nginx-green.conf prompt-management-nginx:/etc/nginx/nginx.conf
        else
            docker cp nginx-blue.conf prompt-management-nginx:/etc/nginx/nginx.conf
        fi
        docker-compose exec nginx nginx -s reload
        exit 1
    fi
    
    # Stop old deployment
    print_status "Stopping old deployment ($old_deployment)..."
    docker-compose stop app-$old_deployment
    
    print_success "Deployment completed successfully!"
    print_status "Active deployment: $new_deployment"
}

# Function to rollback
rollback() {
    current_deployment=$(get_active_deployment)
    if [ "$current_deployment" = "blue" ]; then
        target_deployment="green"
    else
        target_deployment="blue"
    fi
    
    print_warning "Rolling back from $current_deployment to $target_deployment..."
    
    # Start target deployment if not running
    if [ "$target_deployment" = "green" ]; then
        docker-compose --profile green up -d app-green
    else
        docker-compose up -d app-blue
    fi
    
    # Wait for target to be healthy
    if ! check_health "$target_deployment deployment" "http://localhost:3060/api/health"; then
        print_error "Rollback target is not healthy!"
        exit 1
    fi
    
    # Switch traffic
    if [ "$target_deployment" = "green" ]; then
        docker cp nginx-green.conf prompt-management-nginx:/etc/nginx/nginx.conf
    else
        docker cp nginx-blue.conf prompt-management-nginx:/etc/nginx/nginx.conf
    fi
    docker-compose exec nginx nginx -s reload
    
    # Stop old deployment
    docker-compose stop app-$current_deployment
    
    print_success "Rollback completed!"
}

# Function to show status
show_status() {
    echo "=== Deployment Status ==="
    echo "Active deployment: $(get_active_deployment)"
    echo ""
    echo "Container Status:"
    docker-compose ps
    echo ""
    echo "Health Checks:"
    if curl -f -s "http://localhost:3060/api/health" > /dev/null 2>&1; then
        print_success "Application: Healthy"
    else
        print_error "Application: Unhealthy"
    fi
    
    if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
        print_success "Database: Healthy"
    else
        print_error "Database: Unhealthy"
    fi
}

# Main script logic
case "$1" in
    deploy)
        deploy
        ;;
    rollback)
        rollback
        ;;
    status)
        show_status
        ;;
    logs)
        docker-compose logs -f "${2:-}"
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|status|logs [service]}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Deploy new version using blue-green strategy"
        echo "  rollback - Rollback to previous deployment"
        echo "  status   - Show current deployment status"
        echo "  logs     - Show logs (optionally for specific service)"
        exit 1
        ;;
esac

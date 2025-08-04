#!/bin/bash

# Setup script for Prompt Management System Docker environment

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Prompt Management System Docker environment...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}Docker Compose is not available. Please install Docker with Compose plugin.${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}Please edit .env file with your configuration before running the application.${NC}"
else
    echo -e "${GREEN}.env file already exists, skipping creation.${NC}"
fi

# Make scripts executable
chmod +x deploy.sh
chmod +x init-db.sh

# Build the application
echo -e "${BLUE}Building Docker images...${NC}"
make build

echo -e "${GREEN}Setup completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run 'make up' to start the application"
echo "3. Access the application at http://localhost:3060"
echo ""
echo "For more information, see DOCKER_README.md"

# Docker Setup for Prompt Management System

This document describes the Docker setup for the Prompt Management System with blue-green deployment strategy.

## Architecture

The setup includes:

- **PostgreSQL Database** (port 5500)
- **Next.js Application** (port 3001 internal, blue-green deployment)
- **Nginx Load Balancer** (port 3060)

## Quick Start

1. **Clone and setup environment:**

   ```bash
   git clone <repository-url>
   cd PromptManagementSystem
   # Your .env file should already exist with proper configuration
   ```

2. **Start the application:**

   ```bash
   make up
   ```

3. **Access the application:**
   - Application: http://localhost:3060
   - Database: localhost:5500

## Available Commands

### Makefile Commands

```bash
make help              # Show all available commands
make build             # Build Docker images
make up                # Start all services
make down              # Stop all services
make restart           # Restart all services
make logs              # Show logs for all services
make status            # Show container and health status
make clean             # Remove all containers and images
make blue-green-deploy # Deploy using blue-green strategy
```

### Manual Deployment

```bash
# Deploy new version
./deploy.sh deploy

# Check status
./deploy.sh status

# Rollback if needed
./deploy.sh rollback

# View logs
./deploy.sh logs [service-name]
```

## Blue-Green Deployment

The system uses a blue-green deployment strategy to ensure zero-downtime deployments:

1. **Blue Environment**: Currently serving traffic
2. **Green Environment**: New version being deployed
3. **Nginx**: Routes traffic between blue and green

### Deployment Process

1. Build new Docker image
2. Start green environment (if blue is active)
3. Wait for green to be healthy
4. Switch Nginx to route traffic to green
5. Stop blue environment
6. Green becomes the new active environment

### Manual Blue-Green Operations

```bash
# Start green deployment
docker compose --profile green up -d prompt-manager-green

# Switch traffic to green
make switch-to-green

# Switch traffic to blue
make switch-to-blue
```

## Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/prompt_management
DIRECT_URL=postgresql://postgres:postgres@db:5432/prompt_management

# NextAuth
NEXTAUTH_SECRET=your-secure-secret
NEXTAUTH_URL=http://localhost:3060

# Optional: OAuth providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Prompt Management System
```

### Production Considerations

1. **Change default passwords** in docker-compose.yml
2. **Set strong NEXTAUTH_SECRET**
3. **Configure OAuth providers** if needed
4. **Set up SSL/TLS** for production domains
5. **Configure email service** (Resend or SMTP)

## Database Operations

```bash
# Access database shell
make db-shell

# Run migrations
make migrate

# Seed database (if configured)
make seed
```

## Monitoring and Health Checks

### Health Endpoints

- Application: `http://localhost:3060/api/health`
- Nginx: `http://localhost:3060/nginx-health`

### Container Health

```bash
# Check all container status
make status

# View specific logs
docker-compose logs -f app-blue
docker-compose logs -f db
docker-compose logs -f nginx
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Permission issues**: Check file permissions for scripts
3. **Database connection**: Verify DATABASE_URL format
4. **Health check failures**: Check application logs

### Debug Commands

```bash
# Check container status
docker compose ps

# View detailed logs
docker compose logs -f

# Shell into containers
docker compose exec prompt-manager-blue sh
docker compose exec db psql -U postgres -d prompt_management

# Check network connectivity
docker compose exec prompt-manager-blue ping db
```

## GitHub Actions

Automated deployment is configured via GitHub Actions:

### Required Secrets

- `DEPLOY_HOST`: Server IP/domain
- `DEPLOY_USER`: SSH username
- `DEPLOY_KEY`: SSH private key
- `DEPLOY_PORT`: SSH port (optional, default: 22)

### Optional Secrets

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password
- `WEBHOOK_URL`: Notification webhook

### Workflow

1. Push to master branch triggers deployment
2. Builds Docker image
3. Optionally pushes to Docker Hub
4. Deploys to server using blue-green strategy
5. Sends notification on completion

## Development

### Local Development

```bash
# Start development environment
make dev-up

# Or manually
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### File Structure

```
├── Dockerfile                 # Main application Dockerfile
├── docker-compose.yml         # Production compose file
├── docker-compose.dev.yml     # Development overrides
├── nginx.conf                 # Nginx base configuration
├── nginx-blue.conf           # Blue deployment config
├── nginx-green.conf          # Green deployment config
├── init-db.sh               # Database initialization
├── deploy.sh                # Deployment script
├── Makefile                 # Common commands
└── .github/workflows/       # GitHub Actions
    └── deploy.yml          # Deployment workflow
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **Database**: Change default credentials
3. **Network**: Use internal networks for service communication
4. **Updates**: Regularly update base images
5. **Secrets**: Use proper secret management

## Backup and Recovery

### Database Backup

```bash
# Create backup
docker compose exec db pg_dump -U postgres prompt_management > backup.sql

# Restore backup
docker compose exec -T db psql -U postgres -d prompt_management < backup.sql
```

### Volume Backup

```bash
# Backup data volume
docker run --rm -v prompt-management-system_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore data volume
docker run --rm -v prompt-management-system_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

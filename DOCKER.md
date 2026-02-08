# 🐳 Docker Deployment Guide

Complete guide for running the Cybersecurity Portfolio using Docker on any platform, including Raspberry Pi 4.

## Quick Start with Docker

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+ (or docker-compose 1.29+)
- 2GB+ RAM (4GB recommended for Raspberry Pi)

### 1. Build and Start

```bash
# Navigate to project directory
cd /path/to/portfolio

# Build images (first time only)
docker-compose build

# Start all services
docker-compose up -d

# Wait for services to be healthy (about 1-2 minutes)
docker-compose ps
```

### 2. Seed the Database (First Time Only)

After all services are running, seed the database with initial content:

```bash
curl -X POST http://localhost:8001/api/content/seed
```

### 3. Access Your Portfolio

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs
- **Admin Login**: http://localhost:3000/admin-login
- **Admin Panel**: http://localhost:3000/admin-analytics-dashboard (after login)
- **Default Credentials**: `admin` / `password`
- **MongoDB**: localhost:27017

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 4. Stop Services

```bash
docker-compose down

# Stop and remove volumes (WARNING: This deletes data!)
docker-compose down -v
```

---

## Raspberry Pi 4 Setup (Kali Linux)

### Option 1: Automated Setup Script

```bash
# Run the setup script
sudo bash setup-raspi.sh

# After setup completes
docker-compose up -d
```

### Option 2: Manual Setup

#### Step 1: Install Docker

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt-get install docker-compose -y

# Logout and login again for group changes
```

#### Step 2: Build and Run

```bash
cd /app

# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

---

## Docker Commands Reference

### Building Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# Build without cache
docker-compose build --no-cache
```

### Managing Services

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Restart services
docker-compose restart

# Remove stopped containers
docker-compose rm -f

# Scale services (not applicable for this app)
docker-compose up -d --scale backend=2
```

### Viewing Logs

```bash
# Follow all logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service logs
docker-compose logs -f backend

# Save logs to file
docker-compose logs > portfolio-logs.txt
```

### Accessing Containers

```bash
# Execute commands in backend
docker-compose exec backend bash
docker-compose exec backend python

# Execute commands in frontend
docker-compose exec frontend sh

# Access MongoDB
docker-compose exec mongodb mongosh
```

### Health Checks

```bash
# Check service health
docker-compose ps

# Inspect specific service
docker inspect portfolio-backend

# View resource usage
docker stats
```

---

## Troubleshooting

### Issue 1: Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000
# or
sudo netstat -tulpn | grep 3000

# Kill the process
sudo kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:80"  # Change 3000 to 3001
```

### Issue 2: MongoDB Connection Failed

```bash
# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# Check if MongoDB is accessible
docker-compose exec mongodb mongosh --eval "db.version()"

# Recreate MongoDB with fresh data
docker-compose down
docker volume rm app_mongodb_data
docker-compose up -d
```

### Issue 3: Backend Not Starting

```bash
# Check backend logs
docker-compose logs backend

# Common fixes:
# 1. Check environment variables
docker-compose exec backend env | grep MONGO

# 2. Reinstall dependencies
docker-compose exec backend pip install -r requirements.txt

# 3. Rebuild backend
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Issue 4: Frontend Build Failed

```bash
# Check Node version
docker-compose exec frontend node --version

# Clear cache and rebuild
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d frontend

# If memory issues on Raspberry Pi
# Add to docker-compose.yml under frontend:
environment:
  - NODE_OPTIONS=--max_old_space_size=2048
```

### Issue 5: Slow Performance on Raspberry Pi

```bash
# Limit resource usage in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          memory: 512M
```

### Issue 6: Analytics Not Showing Visitors

```bash
# Check if analytics tracking is working
curl -X POST http://localhost:8001/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"event_type": "page_view", "page": "/"}'

# Check MongoDB for analytics data
docker-compose exec mongodb mongosh portfolio_db \
  --eval "db.analytics_events.find().pretty()"

# Check backend logs for tracking errors
docker-compose logs backend | grep -i analytics

# Restart backend to refresh connections
docker-compose restart backend
```

### Issue 7: Docker Compose Version Issues

```bash
# Check version
docker-compose version

# If old version, upgrade
sudo apt-get update
sudo apt-get install --only-upgrade docker-compose

# Or install latest manually
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

---

## Production Deployment

### Environment Variables

Create `.env` file in project root:

```env
# Backend
MONGO_URL=mongodb://mongodb:27017/
DB_NAME=portfolio_db

# Frontend
REACT_APP_BACKEND_URL=https://api.yourdomain.com

# MongoDB (optional)
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_secure_password
```

### Secure MongoDB

Update `docker-compose.yml`:

```yaml
mongodb:
  image: mongo:6.0
  environment:
    MONGO_INITDB_ROOT_USERNAME: ${MONGO_INITDB_ROOT_USERNAME}
    MONGO_INITDB_ROOT_PASSWORD: ${MONGO_INITDB_ROOT_PASSWORD}
    MONGO_INITDB_DATABASE: portfolio_db
  volumes:
    - mongodb_data:/data/db
  # Don't expose port in production
  # ports:
  #   - "27017:27017"
```

### Add SSL/TLS with Nginx Reverse Proxy

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-prod.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - portfolio-network

  # ... other services
```

---

## Performance Optimization

### For Raspberry Pi 4

```yaml
# docker-compose.yml optimizations
services:
  backend:
    environment:
      - WORKERS=2  # Adjust based on CPU cores
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G

  frontend:
    environment:
      - NODE_OPTIONS=--max_old_space_size=2048
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1.5G
```

### Use Docker BuildKit

```bash
# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build with BuildKit
docker-compose build
```

---

## Data Backup and Restore

### Backup MongoDB Data

```bash
# Backup
docker-compose exec mongodb mongodump --out=/data/backup
docker cp portfolio-mongodb:/data/backup ./backup-$(date +%Y%m%d)

# Or using volume
docker run --rm --volumes-from portfolio-mongodb \
  -v $(pwd):/backup \
  ubuntu tar cvf /backup/mongodb-backup.tar /data/db
```

### Restore MongoDB Data

```bash
# Restore
docker cp ./backup portfolio-mongodb:/data/backup
docker-compose exec mongodb mongorestore /data/backup
```

### Backup Docker Volumes

```bash
# List volumes
docker volume ls

# Backup volume
docker run --rm -v app_mongodb_data:/data -v $(pwd):/backup \
  ubuntu tar cvf /backup/volume-backup.tar /data
```

---

## Monitoring

### View Resource Usage

```bash
# Real-time stats
docker stats

# Specific container
docker stats portfolio-backend

# Export metrics
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### Health Monitoring

```bash
# Check health status
docker-compose ps

# Detailed inspection
docker inspect --format='{{.State.Health.Status}}' portfolio-backend
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy Portfolio

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and push Docker images
        run: |
          docker-compose build
          docker-compose push
      
      - name: Deploy to server
        run: |
          ssh user@server 'cd /app && docker-compose pull && docker-compose up -d'
```

---

## FAQ

**Q: Can I run this on Raspberry Pi 3?**
A: Yes, but it will be slower. Reduce memory limits and use production builds.

**Q: How much disk space is needed?**
A: Minimum 8GB. Images + data ≈ 3-4GB.

**Q: Can I use external MongoDB?**
A: Yes, update MONGO_URL in backend environment and remove mongodb service.

**Q: How to update the application?**
```bash
git pull
docker-compose build
docker-compose up -d
```

**Q: How to enable HTTPS?**
A: Use nginx-proxy or traefik reverse proxy with Let's Encrypt.

---

## Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Restart services: `docker-compose restart`
3. Rebuild: `docker-compose build --no-cache`
4. Contact: vagesh.anagani@gmail.com

---

**Your portfolio is now Dockerized! 🐳**

# 🐳 Docker Deployment Guide

Complete guide for running the Cybersecurity Portfolio using Docker on any platform, including **Raspberry Pi 4**.

## Quick Start

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB+ RAM (4GB recommended for Raspberry Pi)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Vagesh21/portlog.git
cd portlog
```

### Step 2: Find Your IP Address

```bash
# Linux/Raspberry Pi
hostname -I

# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

Note your IP address (e.g., `192.168.1.100` or `192.168.0.2`)

### Step 3: Update docker-compose.yml

Edit `docker-compose.yml` and replace `YOUR_IP_ADDRESS` with your actual IP:

```bash
# Using nano
nano docker-compose.yml

# Or using sed (replace 192.168.0.2 with YOUR IP)
sed -i 's/YOUR_IP_ADDRESS/192.168.0.2/g' docker-compose.yml
```

Find this line and update it:
```yaml
REACT_APP_BACKEND_URL: http://YOUR_IP_ADDRESS:8001
```

Change to (example):
```yaml
REACT_APP_BACKEND_URL: http://192.168.0.2:8001
```

### Step 4: Build and Start

```bash
# Build images (first time takes 5-10 minutes on Raspberry Pi)
docker-compose build

# Start all services
docker-compose up -d

# Wait for MongoDB to initialize (about 60 seconds)
sleep 60

# Check all services are healthy
docker-compose ps
```

### Step 5: Seed the Database

```bash
curl -X POST http://localhost:8001/api/content/seed
```

You should see: `{"success":true,"message":"Database seeded with default content"}`

### Step 6: Access Your Portfolio

- **Portfolio**: http://YOUR_IP:3000
- **Admin Login**: http://YOUR_IP:3000/admin-login
- **Default Credentials**: `admin` / `password`
- **API Docs**: http://YOUR_IP:8001/docs

---

## Raspberry Pi 4 Specific Notes

### MongoDB Version
This setup uses **MongoDB 4.4.18** which is the last version compatible with Raspberry Pi 4's ARMv8.0-A processor. Later versions require ARMv8.2-A.

### Node.js Version
Uses **Node 22** with `--ignore-engines` flag to handle package compatibility.

### Memory Considerations
If you experience memory issues:

```bash
# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Common Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Restart Services
```bash
docker-compose restart
```

### Stop Services
```bash
docker-compose down

# Stop and remove all data
docker-compose down -v
```

### Rebuild After Changes
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Troubleshooting

### Issue: "Login failed" or API not responding

**Cause**: Frontend can't reach backend because of incorrect IP address.

**Fix**:
1. Check your IP: `hostname -I`
2. Update `docker-compose.yml` with correct IP
3. Rebuild: `docker-compose up -d --build`

### Issue: MongoDB fails to start on Raspberry Pi

**Cause**: MongoDB version incompatible with ARM processor.

**Fix**: Ensure you're using `mongo:4.4.18` (not 4.4.19 or higher)

### Issue: Frontend build fails with engine error

**Cause**: Node version mismatch with some packages.

**Fix**: Ensure Dockerfile.frontend uses `node:22-alpine` and `yarn install --ignore-engines`

### Issue: "Name or service not known" errors

**Cause**: Services trying to connect before MongoDB is ready.

**Fix**: Wait 60 seconds after `docker-compose up -d` before seeding

### Issue: Permission denied

**Fix**: Use `sudo` with Docker commands or add user to docker group:
```bash
sudo usermod -aG docker $USER
# Log out and back in
```

---

## Network Architecture

```
Browser (your device)
    |
    v
[port 3000] --> Nginx (frontend container) --> serves React app
    |
    v
React app makes API calls to REACT_APP_BACKEND_URL
    |
    v
[port 8001] --> FastAPI (backend container)
    |
    v
[port 27017] --> MongoDB (database container)
```

**Key Point**: The browser runs on YOUR device, not inside Docker. So `REACT_APP_BACKEND_URL` must be an IP address accessible from your device, not Docker's internal network names.

---

## Security Notes

1. **Change the default password** after first login
2. For production, set a strong `JWT_SECRET_KEY` environment variable
3. Consider using HTTPS with a reverse proxy for public deployments

---

## Support

For issues, check:
1. Container logs: `docker-compose logs -f`
2. Service status: `docker-compose ps`
3. MongoDB health: `docker-compose exec mongodb mongo --eval "db.adminCommand('ping')"`

Contact: vagesh.anagani@gmail.com

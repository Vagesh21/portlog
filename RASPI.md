# 🥧 Raspberry Pi 4 Installation Guide (Kali Linux)

Complete step-by-step guide for installing and running the Cybersecurity Portfolio on Raspberry Pi 4 with Kali Linux.

## Prerequisites

- **Hardware**: Raspberry Pi 4 (2GB+ RAM recommended, 4GB ideal)
- **OS**: Kali Linux (ARM64)
- **Storage**: 16GB+ SD card with 8GB+ free space
- **Network**: Internet connection

---

## Method 1: Automated Installation (Recommended)

### Single Command Setup

```bash
cd /app
sudo bash setup-raspi.sh
```

This script will:
- Update system packages
- Install Python, Node.js, MongoDB, Docker
- Setup backend and frontend dependencies
- Create environment files
- Configure everything automatically

**Time: ~20-30 minutes** (depending on internet speed)

After completion:
```bash
# Start with Docker
docker-compose up -d

# Or start manually
./start.sh
```

---

## Method 2: Manual Installation

### Step 1: System Update (5 minutes)

```bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get autoremove -y
```

### Step 2: Install System Dependencies (10 minutes)

```bash
# Install Python and build tools
sudo apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev

# Install Node.js and npm
sudo apt-get install -y nodejs npm

# Install MongoDB
sudo apt-get install -y mongodb

# Install Git
sudo apt-get install -y git curl wget
```

### Step 3: Install Yarn (2 minutes)

```bash
sudo npm install -g yarn
```

### Step 4: Install Docker (Optional, 5 minutes)

```bash
# Download and install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt-get install -y docker-compose

# Logout and login for group changes
```

### Step 5: Setup MongoDB (3 minutes)

```bash
# Start MongoDB
sudo systemctl enable mongodb
sudo systemctl start mongodb

# Verify it's running
sudo systemctl status mongodb

# If it fails, create data directory
sudo mkdir -p /data/db
sudo chown -R mongodb:mongodb /data/db
sudo systemctl restart mongodb
```

### Step 6: Setup Backend (15 minutes)

```bash
cd /app/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install dependencies (this will take time on Pi)
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017/
DB_NAME=portfolio_db
EOF

# Deactivate virtual environment
deactivate
```

**Note**: Installation on Raspberry Pi takes longer due to ARM architecture. Be patient!

### Step 7: Setup Frontend (20 minutes)

```bash
cd /app/frontend

# Install dependencies (this will take time)
yarn install --network-timeout 100000

# Create .env file
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
EOF
```

**Tip**: If yarn install fails with timeout, increase timeout:
```bash
yarn install --network-timeout 300000
```

### Step 8: Start Services

#### Option A: Using Startup Script

```bash
cd /app
./start.sh
```

#### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd /app/backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd /app/frontend
yarn start
```

#### Option C: Using Docker

```bash
cd /app
docker-compose up -d
```

---

## Common Installation Issues on Raspberry Pi

### Issue 1: Installation Extremely Slow

**Cause**: ARM architecture requires compiling packages from source

**Solution**:
```bash
# Use pre-compiled wheels when possible
pip install --prefer-binary -r requirements.txt

# For frontend, be patient or use production build
cd frontend
yarn build
# Then serve with simple HTTP server
npx serve -s build
```

### Issue 2: Out of Memory During Build

**Symptoms**: "Killed" during npm/yarn install or pip install

**Solution**:
```bash
# Increase swap space
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Change CONF_SWAPSIZE=100 to CONF_SWAPSIZE=2048
sudo dphys-swapfile setup
sudo dphys-swapfile swapon

# Install with reduced concurrency
yarn install --network-timeout 100000 --network-concurrency 1
```

### Issue 3: MongoDB Won't Start

**Solution**:
```bash
# Check logs
sudo journalctl -u mongodb -n 50

# Create data directory
sudo mkdir -p /data/db
sudo chown -R mongodb:mongodb /data/db

# Check if port is available
sudo netstat -tulpn | grep 27017

# Restart
sudo systemctl restart mongodb
```

### Issue 4: Python Package Compilation Fails

**Solution**:
```bash
# Install missing build dependencies
sudo apt-get install -y \
    gcc \
    g++ \
    make \
    cmake \
    libffi-dev \
    libssl-dev

# Retry installation
pip install -r requirements.txt
```

### Issue 5: Node.js Version Too Old

**Solution**:
```bash
# Install NodeSource repository for latest Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify version
node --version  # Should be v18.x or higher
```

---

## Performance Optimization for Raspberry Pi

### 1. Use Production Build

```bash
# Frontend production build
cd /app/frontend
yarn build

# Serve with lightweight server
sudo npm install -g serve
serve -s build -l 3000
```

### 2. Reduce Memory Usage

**docker-compose.yml**:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 512M
        reservations:
          memory: 256M
  
  frontend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          memory: 512M
```

### 3. Enable Zram (Compressed RAM)

```bash
sudo apt-get install -y zram-tools
sudo nano /etc/default/zramswap
# Set PERCENTAGE=50
sudo service zramswap reload
```

### 4. Overclock (Optional, Advanced)

```bash
# Edit config
sudo nano /boot/config.txt

# Add these lines (safe overclock for Pi 4)
over_voltage=2
arm_freq=1750

# Reboot
sudo reboot
```

**Warning**: Only if you have good cooling!

---

## Monitoring Performance

### Check CPU and Memory

```bash
# Install monitoring tools
sudo apt-get install -y htop

# Monitor in real-time
htop

# Check temperature
vcgencmd measure_temp

# Check memory
free -h
```

### Monitor Docker Resources

```bash
docker stats
```

---

## Autostart on Boot

### Method 1: Using systemd (For Docker)

```bash
# Enable Docker to start on boot
sudo systemctl enable docker

# Create systemd service
sudo nano /etc/systemd/system/portfolio.service
```

Add:
```ini
[Unit]
Description=Cybersecurity Portfolio
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/app
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable portfolio
sudo systemctl start portfolio
```

### Method 2: Using Supervisor

```bash
# Install supervisor
sudo apt-get install -y supervisor

# Configuration already in /etc/supervisor/conf.d/
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

---

## Accessing from Other Devices

### Find Raspberry Pi IP

```bash
hostname -I
```

### Access from Network

```
http://<raspberry-pi-ip>:3000
http://<raspberry-pi-ip>:3000/admin-analytics-dashboard
```

### Setup Static IP (Optional)

```bash
# Edit dhcpcd.conf
sudo nano /etc/dhcpcd.conf

# Add:
interface eth0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8
```

---

## Backup and Restore

### Backup

```bash
# Create backup directory
mkdir -p ~/portfolio-backups

# Backup MongoDB
sudo mongodump --out ~/portfolio-backups/mongodb-$(date +%Y%m%d)

# Backup code (if modified)
tar -czf ~/portfolio-backups/code-$(date +%Y%m%d).tar.gz /app

# Backup Docker volumes
docker run --rm -v app_mongodb_data:/data -v ~/portfolio-backups:/backup \
  ubuntu tar czf /backup/mongodb-volume-$(date +%Y%m%d).tar.gz /data
```

### Restore

```bash
# Restore MongoDB
sudo mongorestore ~/portfolio-backups/mongodb-20250208

# Restore code
tar -xzf ~/portfolio-backups/code-20250208.tar.gz -C /
```

---

## Security Recommendations

```bash
# Change default passwords
sudo passwd  # Change user password

# Enable firewall
sudo apt-get install -y ufw
sudo ufw allow 22      # SSH
sudo ufw allow 3000    # Frontend
sudo ufw allow 8001    # Backend (only if external access needed)
sudo ufw enable

# Keep system updated
sudo apt-get update && sudo apt-get upgrade -y

# Disable MongoDB external access in production
# Edit: sudo nano /etc/mongodb.conf
# Set: bind_ip = 127.0.0.1
```

---

## Uninstallation

```bash
# Stop services
docker-compose down -v
sudo supervisorctl stop all

# Remove Docker
sudo apt-get remove -y docker docker-compose

# Remove packages
sudo apt-get remove -y mongodb nodejs npm

# Clean up
sudo apt-get autoremove -y
sudo apt-get autoclean
```

---

## Next Steps

1. ✅ Verify all services are running: `./start.sh` → Option 4
2. ✅ Test analytics: `./start.sh` → Option 7
3. ✅ Access portfolio: http://localhost:3000
4. ✅ Access admin panel: http://localhost:3000/admin-analytics-dashboard
5. ✅ Customize content in `/app/frontend/src/data/mockData.js`

---

## Support

**Having issues?**
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Check [DOCKER.md](./DOCKER.md)
3. Run diagnostic: `./start.sh` → Option 4
4. Contact: vagesh.anagani@gmail.com

---

**Your Raspberry Pi is now a powerful portfolio server! 🥧**

#!/bin/bash

# Cybersecurity Portfolio Setup Script for Raspberry Pi 4 (Kali Linux)
# This script installs all dependencies and sets up the portfolio

set -e

echo "=========================================="
echo "Cybersecurity Portfolio Setup"
echo "Raspberry Pi 4 - Kali Linux"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Working directory: $SCRIPT_DIR"

# Check if running on ARM64
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

if [[ "$ARCH" != "aarch64" && "$ARCH" != "armv7l" ]]; then
    echo -e "${YELLOW}Warning: This script is optimized for ARM64 (Raspberry Pi 4)${NC}"
fi

# Update system
echo -e "${GREEN}[1/8] Updating system packages...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

# Install system dependencies
echo -e "${GREEN}[2/8] Installing system dependencies...${NC}"
sudo apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    git \
    curl \
    wget \
    build-essential \
    libssl-dev \
    libffi-dev

# Install Docker (optional but recommended)
echo -e "${GREEN}[3/8] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}Docker installed successfully${NC}"
else
    echo -e "${YELLOW}Docker already installed${NC}"
fi

# Install Docker Compose
echo -e "${GREEN}[4/8] Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo apt-get install -y docker-compose
    echo -e "${GREEN}Docker Compose installed successfully${NC}"
else
    echo -e "${YELLOW}Docker Compose already installed${NC}"
fi

# Install Yarn
echo -e "${GREEN}[5/8] Installing Yarn...${NC}"
if ! command -v yarn &> /dev/null; then
    sudo npm install -g yarn
    echo -e "${GREEN}Yarn installed successfully${NC}"
else
    echo -e "${YELLOW}Yarn already installed${NC}"
fi

# Skip MongoDB setup - we'll use Docker for MongoDB
echo -e "${GREEN}[6/8] MongoDB will run in Docker container...${NC}"

# Setup Backend
echo -e "${GREEN}[7/8] Setting up Backend...${NC}"
cd "$SCRIPT_DIR/backend"

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install backend dependencies
echo "Installing Python packages (this may take a while on Raspberry Pi)..."
pip install -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating backend .env file..."
    cat > .env << EOF
MONGO_URL=mongodb://localhost:27017/
DB_NAME=portfolio_db
CORS_ORIGINS=*
EOF
    echo -e "${GREEN}Backend .env created${NC}"
fi

deactivate
cd "$SCRIPT_DIR"

# Setup Frontend
echo -e "${GREEN}[8/8] Setting up Frontend...${NC}"
cd "$SCRIPT_DIR/frontend"

# Install frontend dependencies
echo "Installing Node packages (this may take a while on Raspberry Pi)..."
yarn install --network-timeout 100000

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating frontend .env file..."
    cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
EOF
    echo -e "${GREEN}Frontend .env created${NC}"
fi

cd "$SCRIPT_DIR"

echo ""
echo "=========================================="
echo -e "${GREEN}Installation Complete!${NC}"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "Option 1: Using Docker (Recommended)"
echo "  cd $SCRIPT_DIR"
echo "  docker-compose up -d"
echo ""
echo "Option 2: Manual Start"
echo "  Terminal 1: cd $SCRIPT_DIR/backend && source venv/bin/activate && uvicorn server:app --host 0.0.0.0 --port 8001"
echo "  Terminal 2: cd $SCRIPT_DIR/frontend && yarn start"
echo ""
echo "After starting, seed the database by running:"
echo "  curl -X POST http://localhost:8001/api/content/seed"
echo ""
echo "Access your portfolio at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8001/api/"
echo "  Admin Login: http://localhost:3000/admin-login"
echo "  Default Credentials: admin / password"
echo ""
echo "Note: If using Docker, you may need to logout and login again for group changes to take effect."
echo ""

#!/bin/bash

# Cybersecurity Portfolio Startup Script
# Use this script to easily start, stop, or check status

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

show_banner() {
    echo "=========================================="
    echo "  Cybersecurity Portfolio Manager"
    echo "=========================================="
    echo ""
}

show_menu() {
    echo "Select an option:"
    echo "1) Start with Docker"
    echo "2) Start manually (without Docker)"
    echo "3) Stop services"
    echo "4) Check status"
    echo "5) View logs"
    echo "6) Restart services"
    echo "7) Test analytics"
    echo "8) Open in browser"
    echo "9) Exit"
    echo ""
}

start_docker() {
    echo -e "${GREEN}Starting services with Docker...${NC}"
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Docker Compose not installed!${NC}"
        echo "Run: sudo bash setup-raspi.sh"
        exit 1
    fi
    
    docker-compose up -d
    echo -e "${GREEN}Services started!${NC}"
    echo ""
    echo "Access your portfolio:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend: http://localhost:8001"
    echo "  Admin Panel: http://localhost:3000/admin-analytics-dashboard"
}

start_manual() {
    echo -e "${GREEN}Starting services manually...${NC}"
    
    # Check if MongoDB is running
    if ! sudo systemctl is-active --quiet mongodb; then
        echo "Starting MongoDB..."
        sudo systemctl start mongodb
    fi
    
    # Start with supervisor
    if command -v supervisorctl &> /dev/null; then
        echo "Starting with Supervisor..."
        sudo supervisorctl start all
    else
        echo -e "${YELLOW}Supervisor not found. Starting manually...${NC}"
        echo ""
        echo "Terminal 1: Run this command:"
        echo "  cd /app/backend && source venv/bin/activate && uvicorn server:app --host 0.0.0.0 --port 8001"
        echo ""
        echo "Terminal 2: Run this command:"
        echo "  cd /app/frontend && yarn start"
    fi
}

stop_services() {
    echo -e "${YELLOW}Stopping services...${NC}"
    
    # Try Docker first
    if [ -f "docker-compose.yml" ]; then
        echo "Stopping Docker services..."
        docker-compose down
    fi
    
    # Stop supervisor services
    if command -v supervisorctl &> /dev/null; then
        echo "Stopping Supervisor services..."
        sudo supervisorctl stop all
    fi
    
    echo -e "${GREEN}Services stopped!${NC}"
}

check_status() {
    echo -e "${GREEN}Checking service status...${NC}"
    echo ""
    
    # Check Docker
    if command -v docker-compose &> /dev/null && [ -f "docker-compose.yml" ]; then
        echo "=== Docker Services ==="
        docker-compose ps
        echo ""
    fi
    
    # Check Supervisor
    if command -v supervisorctl &> /dev/null; then
        echo "=== Supervisor Services ==="
        sudo supervisorctl status
        echo ""
    fi
    
    # Check MongoDB
    echo "=== MongoDB ==="
    if sudo systemctl is-active --quiet mongodb; then
        echo -e "${GREEN}MongoDB: Running${NC}"
    else
        echo -e "${RED}MongoDB: Not running${NC}"
    fi
    echo ""
    
    # Check ports
    echo "=== Port Status ==="
    echo -n "Port 3000 (Frontend): "
    if sudo netstat -tulpn | grep -q ":3000"; then
        echo -e "${GREEN}In use${NC}"
    else
        echo -e "${RED}Not in use${NC}"
    fi
    
    echo -n "Port 8001 (Backend): "
    if sudo netstat -tulpn | grep -q ":8001"; then
        echo -e "${GREEN}In use${NC}"
    else
        echo -e "${RED}Not in use${NC}"
    fi
    
    echo -n "Port 27017 (MongoDB): "
    if sudo netstat -tulpn | grep -q ":27017"; then
        echo -e "${GREEN}In use${NC}"
    else
        echo -e "${RED}Not in use${NC}"
    fi
}

view_logs() {
    echo "Select logs to view:"
    echo "1) Docker logs"
    echo "2) Supervisor logs"
    echo "3) MongoDB logs"
    echo "4) Back to main menu"
    echo ""
    read -p "Enter choice: " log_choice
    
    case $log_choice in
        1)
            if command -v docker-compose &> /dev/null; then
                docker-compose logs -f
            else
                echo -e "${RED}Docker not available${NC}"
            fi
            ;;
        2)
            if [ -d "/var/log/supervisor" ]; then
                tail -f /var/log/supervisor/*.log
            else
                echo -e "${RED}Supervisor logs not found${NC}"
            fi
            ;;
        3)
            tail -f /var/log/mongodb/mongodb.log
            ;;
        4)
            return
            ;;
    esac
}

restart_services() {
    echo -e "${YELLOW}Restarting services...${NC}"
    
    if command -v docker-compose &> /dev/null && [ -f "docker-compose.yml" ]; then
        docker-compose restart
    elif command -v supervisorctl &> /dev/null; then
        sudo supervisorctl restart all
    else
        echo "Please stop and start services manually"
    fi
    
    echo -e "${GREEN}Services restarted!${NC}"
}

test_analytics() {
    echo -e "${GREEN}Testing analytics system...${NC}"
    echo ""
    
    # Test backend health
    echo "1. Testing backend health..."
    curl -s http://localhost:8001/api/ | jq . || echo "Backend not responding"
    echo ""
    
    # Test analytics tracking
    echo "2. Sending test analytics event..."
    curl -s -X POST http://localhost:8001/api/analytics/track \
      -H "Content-Type: application/json" \
      -d '{"event_type":"page_view","page":"/test","device_type":"desktop"}' | jq . || echo "Tracking failed"
    echo ""
    
    # Get analytics stats
    echo "3. Getting analytics stats..."
    curl -s http://localhost:8001/api/analytics/stats | jq . || echo "Stats not available"
    echo ""
    
    echo -e "${GREEN}Test complete!${NC}"
}

open_browser() {
    echo "Opening in browser..."
    
    # Try different browser commands
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000
    elif command -v gnome-open &> /dev/null; then
        gnome-open http://localhost:3000
    elif command -v firefox &> /dev/null; then
        firefox http://localhost:3000 &
    elif command -v chromium-browser &> /dev/null; then
        chromium-browser http://localhost:3000 &
    else
        echo "Could not detect browser. Please open manually:"
        echo "http://localhost:3000"
    fi
}

# Main loop
cd /app

show_banner

while true; do
    show_menu
    read -p "Enter choice [1-9]: " choice
    
    case $choice in
        1)
            start_docker
            ;;
        2)
            start_manual
            ;;
        3)
            stop_services
            ;;
        4)
            check_status
            ;;
        5)
            view_logs
            ;;
        6)
            restart_services
            ;;
        7)
            test_analytics
            ;;
        8)
            open_browser
            ;;
        9)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    clear
    show_banner
done

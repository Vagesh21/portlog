# 🔐 Cybersecurity Portfolio

A modern, interactive portfolio website for cybersecurity professionals with an admin dashboard for content management and visitor analytics.

![Portfolio Preview](https://img.shields.io/badge/Status-Production%20Ready-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi%204-Compatible-red)

## ✨ Features

### Portfolio
- 🎨 Modern dark theme with electric blue accents
- 👁️ Interactive avatar with mouse-tracking eyes
- 📊 Skills radar chart visualization
- 🗂️ Project showcase with dashboard-style cards
- 🌍 Live threat map visualization
- 🏆 Certification gallery
- 📬 Contact form with validation

### Admin Panel
- 🔒 Secure JWT authentication
- 📈 Real-time visitor analytics (IP, device, location, page views)
- ✏️ Full CMS - edit all portfolio content from the web interface
- ⚙️ Website settings management

## 🚀 Quick Start with Docker

### 1. Clone & Configure

```bash
git clone https://github.com/Vagesh21/portlog.git
cd portlog

# Find your IP address
hostname -I  # Linux
ifconfig | grep "inet "  # macOS

# Update docker-compose.yml - replace YOUR_IP_ADDRESS with your actual IP
nano docker-compose.yml
```

### 2. Build & Run

```bash
docker-compose build
docker-compose up -d
sleep 60  # Wait for MongoDB

# Seed the database
curl -X POST http://localhost:8001/api/content/seed
```

### 3. Access

- **Portfolio**: http://YOUR_IP:3000
- **Admin**: http://YOUR_IP:3000/admin-login
- **Credentials**: `admin` / `password`

## 📁 Project Structure

```
portlog/
├── backend/           # FastAPI Python backend
│   ├── routes/        # API endpoints
│   ├── server.py      # Main application
│   └── requirements.txt
├── frontend/          # React frontend
│   ├── src/
│   │   ├── pages/     # Main pages (AdminPanel, LoginPage)
│   │   └── components/ # UI components
│   └── package.json
├── docker-compose.yml # Docker orchestration
├── Dockerfile.backend # Backend container
├── Dockerfile.frontend # Frontend container
├── DOCKER.md          # Detailed Docker guide
└── README.md          # This file
```

## 🔧 Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18, TailwindCSS, Framer Motion, Recharts |
| Backend | FastAPI, Python 3.11 |
| Database | MongoDB 4.4.18 |
| Auth | JWT (python-jose) |
| Container | Docker, Docker Compose |

## 📖 Documentation

- [Docker Deployment Guide](DOCKER.md) - Complete Docker setup instructions
- [Raspberry Pi Setup](RASPI.md) - Specific instructions for Raspberry Pi 4
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions

## 🔑 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login with credentials |
| `/api/auth/change-password` | POST | Change password |
| `/api/content/seed` | POST | Seed database with default content |
| `/api/content/all` | GET | Get all portfolio content |
| `/api/analytics/stats` | GET | Get visitor statistics |
| `/api/contact` | POST | Submit contact form |

## 🐛 Known Issues & Fixes

### Raspberry Pi 4
- Uses MongoDB 4.4.18 (last ARMv8.0 compatible version)
- Node 22 with `--ignore-engines` flag for package compatibility

### Docker Networking
- `REACT_APP_BACKEND_URL` must be your machine's IP, not `localhost` or Docker network names
- This is because the React app runs in your browser, not inside Docker

## 🔒 Security

- Change default password immediately after first login
- JWT tokens expire after 24 hours
- Passwords are hashed with SHA256
- CORS configured to accept all origins (configure for production)

## 📝 License

MIT License - Feel free to use and modify for your own portfolio!

## 👤 Author

**Vagesh Anagani**
- Email: vagesh.anagani@gmail.com
- Location: Melbourne, Australia

---

⭐ Star this repo if you found it helpful!

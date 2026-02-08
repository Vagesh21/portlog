# 🔐 Cybersecurity Portfolio - Vagesh Anagani

A modern, interactive portfolio website designed for cybersecurity professionals. Built with React, FastAPI, and MongoDB, featuring real-time analytics, dynamic content management, and an interactive avatar with eye-tracking capabilities.

![Portfolio Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

## ✨ Features

### 🎨 Frontend Features
- **Interactive Avatar** - Custom-built male avatar with real-time eye tracking that follows cursor movement and displays dynamic facial expressions
- **Animated Hero Section** - Floating particles and gradient background with smooth animations
- **Skills Radar Chart** - Interactive visualization of technical competencies
- **Security Projects Dashboard** - Showcase projects with real-time metrics (security scores, vulnerabilities fixed, performance)
- **Live Threat Map** - Global cybersecurity threat monitoring simulation
- **Certifications Gallery** - Display verified professional certifications
- **Contact Form** - Fully functional with math captcha validation
- **Smooth Navigation** - Floating navigation menu with smooth scroll

### 📊 Admin Control Panel (`/admin-analytics-dashboard`)
- **Analytics Dashboard**
  - Real-time visitor tracking (IP address, OS, browser, device type, location)
  - Total visits, clicks, unique visitors statistics
  - Interactive charts (weekly activity, page views, device distribution)
  - Recent visitors feed with detailed information
  
- **Messages Inbox**
  - View all contact form submissions
  - Mark messages as read/unread
  - Display sender details (name, email, IP, timestamp)
  
- **Content Management**
  - Edit/delete projects dynamically
  - Manage skills and proficiency levels
  - Update certifications
  
- **Website Settings**
  - Theme color customization
  - Toggle features (analytics, contact form, threat map)
  - Enable/disable components

### 🔧 Backend Features
- RESTful API built with FastAPI
- MongoDB database for data persistence
- Analytics tracking system
- Contact form handling
- Content management endpoints
- Browser/OS/Device detection
- IP geolocation (basic implementation)

---

## 📋 Requirements

### System Requirements
- **Node.js**: 18.x or higher
- **Python**: 3.8 or higher
- **MongoDB**: 4.4 or higher (local or Atlas)
- **npm/yarn**: Latest version
- **pip**: Latest version

### Development Tools (Optional)
- **Supervisor**: For process management
- **Git**: For version control

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cybersecurity-portfolio.git
cd cybersecurity-portfolio
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
MONGO_URL=mongodb://localhost:27017/
DB_NAME=portfolio_db
```

**For MongoDB Atlas:**
```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=portfolio_db
```

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd ../frontend
yarn install
# or
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## 🏃 Running the Application

### Option 1: Using Supervisor (Recommended for Production)

#### Start All Services
```bash
sudo supervisorctl start all
```

#### Check Status
```bash
sudo supervisorctl status
```

#### Stop Services
```bash
sudo supervisorctl stop all
```

### Option 2: Manual Start (Development)

#### Terminal 1 - Start Backend
```bash
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### Terminal 2 - Start Frontend
```bash
cd frontend
yarn start
# or
npm start
```

#### Terminal 3 - MongoDB (if running locally)
```bash
mongod --dbpath /path/to/your/data/directory
```

---

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs
- **Admin Panel**: http://localhost:3000/admin-analytics-dashboard

---

## 📁 Project Structure

```
cybersecurity-portfolio/
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── models.py              # Analytics & Contact models
│   ├── models_content.py      # Content management models
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── analytics.py       # Analytics tracking endpoints
│   │   ├── contact.py         # Contact form endpoints
│   │   └── content.py         # Content management endpoints
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Backend configuration
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Shadcn UI components
│   │   │   ├── FloatingNav.jsx
│   │   │   ├── Hero3D.jsx
│   │   │   ├── InteractiveAvatar.jsx
│   │   │   ├── SkillsRadar.jsx
│   │   │   ├── ProjectDashboard.jsx
│   │   │   ├── ThreatMap.jsx
│   │   │   ├── CertificationGallery.jsx
│   │   │   └── ContactForm.jsx
│   │   ├── pages/
│   │   │   ├── AdminPanel.jsx  # Admin control panel
│   │   │   └── AdminDashboard.jsx
│   │   ├── data/
│   │   │   └── mockData.js     # Portfolio content data
│   │   ├── utils/
│   │   │   └── analytics.js    # Analytics helper functions
│   │   ├── App.js              # Main React component
│   │   ├── App.css             # Global styles
│   │   └── index.js            # React entry point
│   ├── package.json            # Node dependencies
│   └── .env                    # Frontend configuration
│
└── README.md
```

---

## 🔑 API Endpoints

### Analytics Endpoints

#### Track Event
```http
POST /api/analytics/track
Content-Type: application/json

{
  "event_type": "page_view",
  "page": "/",
  "device_type": "desktop"
}
```

#### Get Analytics Stats
```http
GET /api/analytics/stats?time_range=7d
```

**Response:**
```json
{
  "total_visits": 107,
  "total_clicks": 3,
  "unique_visitors": 18,
  "avg_session_time": "3m 42s",
  "visit_data": [...],
  "page_views": [...],
  "device_stats": [...],
  "recent_visitors": [...]
}
```

### Contact Endpoints

#### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!",
  "captcha_answer": "7"
}
```

#### Get Contact Messages (Admin)
```http
GET /api/contact/list?skip=0&limit=50&unread_only=false
```

#### Mark as Read
```http
PATCH /api/contact/{contact_id}/read
```

### Content Management Endpoints

#### Get Projects
```http
GET /api/content/projects
```

#### Add Project
```http
POST /api/content/projects
Content-Type: application/json

{
  "title": "New Security Project",
  "description": "Project description",
  "category": "Blockchain Security",
  "duration": "2024",
  "technologies": ["Python", "Blockchain"],
  "status": "Completed",
  "highlights": ["Achievement 1", "Achievement 2"],
  "metrics": {
    "security_score": 95,
    "vulnerabilities_fixed": 12,
    "performance": 88
  }
}
```

#### Delete Project
```http
DELETE /api/content/projects/{project_id}
```

#### Manage Skills
```http
GET /api/content/skills
POST /api/content/skills
PUT /api/content/skills/{category}
DELETE /api/content/skills/{category}
```

#### Website Settings
```http
GET /api/content/settings
PUT /api/content/settings
```

---

## 🎨 Customization

### Update Personal Information
Edit `/frontend/src/data/mockData.js`:

```javascript
export const personalInfo = {
  name: "Your Name",
  title: "Your Title",
  subtitle: "Your Subtitle",
  location: "Your Location",
  email: "your.email@example.com",
  phone: "Your Phone",
  bio: "Your bio...",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername"
};
```

### Add Projects
Add to the `projects` array in `mockData.js`:

```javascript
{
  id: 5,
  title: "Your Project",
  description: "Project description",
  category: "Category",
  duration: "Timeline",
  technologies: ["Tech1", "Tech2"],
  metrics: {
    security_score: 95,
    vulnerabilities_fixed: 20,
    performance: 90
  },
  status: "Active",
  highlights: [
    "Achievement 1",
    "Achievement 2"
  ]
}
```

### Update Skills
Modify the `skills` array in `mockData.js`:

```javascript
export const skills = [
  { category: "Your Skill", level: 85 },
  // Add more skills...
];
```

### Change Theme Colors
The portfolio uses these primary colors:
- **Primary**: `#00d4ff` (Electric Blue)
- **Background**: `#0a0e27` (Deep Navy)
- **Secondary**: `#10b981` (Green)

Update colors in:
- `/frontend/src/index.css`
- Component style files
- Admin settings panel

---

## 🔒 Security Considerations

### Environment Variables
- **Never commit** `.env` files to version control
- Use strong, unique passwords for MongoDB
- Rotate API keys regularly

### MongoDB Security
```javascript
// Recommended: Use MongoDB Atlas with IP whitelisting
// Enable authentication:
mongod --auth --port 27017 --dbpath /data/db
```

### API Rate Limiting
Consider implementing rate limiting for production:
```python
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
```

### CORS Configuration
Update CORS settings in `backend/server.py` for production:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)

#### Build for Production
```bash
cd frontend
yarn build
# or
npm run build
```

#### Environment Variables
Set in your hosting platform:
```
REACT_APP_BACKEND_URL=https://your-api-domain.com
```

### Backend Deployment (Heroku/Railway/DigitalOcean)

#### Procfile for Heroku
```
web: uvicorn server:app --host 0.0.0.0 --port $PORT
```

#### Environment Variables
```
MONGO_URL=mongodb+srv://...
DB_NAME=portfolio_db
```

### MongoDB Atlas Setup
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist your IP addresses
3. Create a database user
4. Get connection string and update `.env`

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
yarn test
# or
npm test
```

---

## 🛠️ Troubleshooting

### Frontend Not Loading
```bash
# Check if backend is running
curl http://localhost:8001/api/

# Clear React cache
rm -rf node_modules/.cache
yarn start
```

### Backend Errors
```bash
# Check MongoDB connection
mongo --eval "db.adminCommand('ping')"

# Check backend logs
tail -f /var/log/supervisor/backend.err.log
```

### Database Connection Issues
```bash
# Test MongoDB connection
python -c "from pymongo import MongoClient; print(MongoClient('mongodb://localhost:27017/').server_info())"
```

---

## 📚 Technologies Used

### Frontend
- **React 19.0.0** - UI framework
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **TailwindCSS** - Styling
- **Shadcn UI** - Component library
- **Axios** - HTTP client
- **React Router** - Routing

### Backend
- **FastAPI 0.110.1** - Web framework
- **Motor 3.3.1** - Async MongoDB driver
- **Pydantic 2.6.4** - Data validation
- **Python 3.8+** - Programming language

### Database
- **MongoDB 4.4+** - NoSQL database

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Vagesh Anagani**
- Email: vagesh.anagani@gmail.com
- Location: Melbourne, Australia
- LinkedIn: [linkedin.com/in/vagesh-anagani](https://linkedin.com/in/vagesh-anagani)
- GitHub: [github.com/vagesh](https://github.com/vagesh)

---

## 🙏 Acknowledgments

- Built with [Emergent AI](https://emergent.sh)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Charts by [Recharts](https://recharts.org/)

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact via email: vagesh.anagani@gmail.com

---

## 🎯 Roadmap

- [ ] Add authentication for admin panel
- [ ] Implement blog/articles section
- [ ] Add dark/light theme toggle
- [ ] Export analytics data to CSV/PDF
- [ ] Real IP geolocation integration
- [ ] Email notifications for contact forms
- [ ] Multi-language support
- [ ] SEO optimization
- [ ] PWA support

---

**Built with ❤️ for cybersecurity professionals**

# 🚀 Quick Start Guide

Get your cybersecurity portfolio running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed
- MongoDB running (local or Atlas)

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/cybersecurity-portfolio.git
cd cybersecurity-portfolio

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
yarn install  # or npm install
```

## Step 2: Configure Environment (1 minute)

### Backend Configuration
Create `backend/.env`:
```env
MONGO_URL=mongodb://localhost:27017/
DB_NAME=portfolio_db
```

### Frontend Configuration
Create `frontend/.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## Step 3: Start the Application (1 minute)

### Terminal 1 - Backend
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Terminal 2 - Frontend
```bash
cd frontend
yarn start  # or npm start
```

## Step 4: Access Your Portfolio (30 seconds)

- **Main Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin-analytics-dashboard
- **API Docs**: http://localhost:8001/docs

## First Steps After Launch

1. **Customize Content**
   - Edit `frontend/src/data/mockData.js`
   - Update personal info, projects, skills

2. **Test Contact Form**
   - Navigate to contact section
   - Submit a test message
   - Check admin panel messages tab

3. **View Analytics**
   - Go to `/admin-analytics-dashboard`
   - See real-time visitor tracking
   - Monitor page views and clicks

4. **Explore Features**
   - Move mouse over avatar (eye tracking)
   - Try floating navigation
   - Check interactive charts

## Common Issues & Quick Fixes

### Frontend won't start
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
yarn install
```

### Backend connection error
```bash
# Check if MongoDB is running
mongo --eval "db.version()"

# Or use MongoDB Atlas (cloud)
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 8001
lsof -ti:8001 | xargs kill -9
```

## Next Steps

- Read full [README.md](./README.md) for detailed documentation
- Customize your portfolio content
- Deploy to production (Vercel + Railway)
- Add your own projects and certifications

## Need Help?

- Check [README.md](./README.md) for detailed instructions
- Review API documentation at `/docs`
- Contact: vagesh.anagani@gmail.com

---

**That's it! Your portfolio is ready! 🎉**

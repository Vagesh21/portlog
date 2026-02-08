# 🔧 Troubleshooting Guide - Analytics Not Showing

## Problem: Admin Panel Not Showing Visitors

This guide will help you fix the analytics tracking issue on Raspberry Pi 4 with Kali Linux.

---

## Quick Fix Steps

### Step 1: Verify Backend is Running

```bash
# Check if backend is accessible
curl http://localhost:8001/api/

# Expected response: {"message": "Vagesh Anagani Portfolio API - Cybersecurity Specialist"}
```

### Step 2: Test Analytics Tracking Manually

```bash
# Send a test tracking event
curl -X POST http://localhost:8001/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "page_view",
    "page": "/test",
    "device_type": "desktop"
  }'

# Expected response: {"success": true, "event_id": "some-uuid"}
```

### Step 3: Check MongoDB Connection

```bash
# Connect to MongoDB
mongo

# or if using mongosh
mongosh

# Switch to portfolio database
use portfolio_db

# Check if analytics_events collection exists
show collections

# Count analytics events
db.analytics_events.count()

# View recent events
db.analytics_events.find().limit(5).pretty()
```

### Step 4: Verify Analytics in Admin Panel

1. Visit: http://localhost:3000/admin-analytics-dashboard
2. Click on "Analytics" tab
3. Check if stats are showing

---

## Detailed Diagnostic Steps

### Check 1: Backend Logs

```bash
# If using supervisor
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/backend.out.log

# If using Docker
docker-compose logs -f backend

# If running manually
# Check the terminal where uvicorn is running
```

**Look for:**
- MongoDB connection errors
- Analytics tracking errors
- Import errors

### Check 2: Frontend Console Errors

1. Open browser DevTools (F12)
2. Go to Console tab
3. Visit http://localhost:3000
4. Look for:
   - Network errors
   - CORS errors
   - Analytics tracking errors

### Check 3: Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Visit http://localhost:3000
4. Look for POST request to `/api/analytics/track`
5. Check if it's successful (200 status)

---

## Common Issues & Solutions

### Issue 1: Backend Not Receiving Tracking Requests

**Symptoms:**
- Admin panel shows 0 visits
- Network tab shows no tracking requests

**Solution:**

```bash
# Check if analytics.js is properly loaded
# View file: /app/frontend/src/utils/analytics.js

# Make sure it's imported in App.js
grep -n "trackPageView" /app/frontend/src/App.js

# Restart frontend
cd /app/frontend
yarn start
```

### Issue 2: CORS Error

**Symptoms:**
- Console shows: "blocked by CORS policy"
- Network requests fail with CORS error

**Solution:**

Edit `/app/backend/server.py`:

```python
# Make sure CORS is configured correctly
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # For development
    # For production, use specific domain:
    # allow_origins=["https://yourdomain.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Restart backend:
```bash
sudo supervisorctl restart backend
# or
docker-compose restart backend
```

### Issue 3: MongoDB Not Collecting Data

**Symptoms:**
- Backend logs show database errors
- Analytics events not saved

**Solution:**

```bash
# Check MongoDB status
sudo systemctl status mongodb

# If not running, start it
sudo systemctl start mongodb

# Check MongoDB logs
tail -f /var/log/mongodb/mongodb.log

# Verify connection string in backend/.env
cat /app/backend/.env
# Should show: MONGO_URL=mongodb://localhost:27017/

# Test MongoDB connection
python3 << EOF
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
print("MongoDB version:", client.server_info()['version'])
print("Databases:", client.list_database_names())
EOF
```

### Issue 4: Analytics Route Not Working

**Symptoms:**
- GET /api/analytics/stats returns 404 or 500

**Solution:**

```bash
# Check if routes are properly included
grep -A 5 "include_router" /app/backend/server.py

# Should include:
# api_router.include_router(analytics.router)

# Check if analytics.py exists
ls -la /app/backend/routes/analytics.py

# Restart backend
sudo supervisorctl restart backend
```

### Issue 5: Browser Blocking Tracking

**Symptoms:**
- Some browsers block tracking requests
- Ad blockers interfere

**Solution:**

1. Disable ad blockers temporarily
2. Try in Incognito/Private mode
3. Check browser console for blocking messages

### Issue 6: Environment Variables Not Loading

**Symptoms:**
- Backend can't connect to MongoDB
- Frontend can't reach backend

**Solution:**

```bash
# Check frontend .env
cat /app/frontend/.env
# Should show: REACT_APP_BACKEND_URL=http://localhost:8001

# Check backend .env
cat /app/backend/.env
# Should show: MONGO_URL=mongodb://localhost:27017/

# Restart services after changing .env
sudo supervisorctl restart all
# or rebuild if using Docker
docker-compose down && docker-compose up -d
```

---

## Manual Testing Script

Create a test script to verify everything works:

```bash
#!/bin/bash

echo "Testing Analytics System..."

# Test 1: Backend health
echo "1. Testing backend health..."
curl -s http://localhost:8001/api/ | jq .

# Test 2: Track page view
echo "2. Tracking test page view..."
RESULT=$(curl -s -X POST http://localhost:8001/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"event_type": "page_view", "page": "/test", "device_type": "desktop"}')
echo $RESULT | jq .

# Test 3: Get analytics stats
echo "3. Getting analytics stats..."
curl -s http://localhost:8001/api/analytics/stats | jq .total_visits

# Test 4: Check MongoDB
echo "4. Checking MongoDB data..."
mongosh portfolio_db --eval "db.analytics_events.countDocuments()" --quiet

echo "Testing complete!"
```

Save as `test-analytics.sh` and run:
```bash
chmod +x test-analytics.sh
./test-analytics.sh
```

---

## Reset Analytics Data

If you want to start fresh:

```bash
# Connect to MongoDB
mongosh portfolio_db

# Delete all analytics events
db.analytics_events.deleteMany({})

# Verify deletion
db.analytics_events.countDocuments()
# Should return: 0

# Exit
exit
```

---

## Enable Debug Mode

### Backend Debug

Edit `/app/backend/server.py`:

```python
import logging

# Add at top of file after imports
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add debug logs in analytics route
@router.post("/track", response_model=TrackingResponse)
async def track_event(event_data: AnalyticsEventCreate, request: Request):
    logger.debug(f"Received tracking request: {event_data}")
    # ... rest of code
```

### Frontend Debug

Add console logs in `/app/frontend/src/utils/analytics.js`:

```javascript
export const trackPageView = (page) => {
  console.log('[Analytics] Tracking page view:', page);
  trackEvent('page_view', page);
};
```

---

## Check Firewall

If running on Raspberry Pi:

```bash
# Check if firewall is blocking ports
sudo iptables -L -n

# Allow ports if needed
sudo ufw allow 3000
sudo ufw allow 8001
sudo ufw allow 27017

# Or disable firewall temporarily for testing
sudo ufw disable
```

---

## Verify Services Are Running

```bash
# Check all required services
echo "MongoDB:"
sudo systemctl is-active mongodb

echo "Backend:"
sudo supervisorctl status backend

echo "Frontend:"
sudo supervisorctl status frontend

# Check ports
echo "Port 8001 (Backend):"
sudo netstat -tulpn | grep 8001

echo "Port 3000 (Frontend):"
sudo netstat -tulpn | grep 3000

echo "Port 27017 (MongoDB):"
sudo netstat -tulpn | grep 27017
```

---

## Still Not Working?

### Collect Debug Information

```bash
# Create debug report
cat > debug-report.txt << EOF
=== System Information ===
$(uname -a)
$(cat /etc/os-release)

=== Service Status ===
$(sudo supervisorctl status)

=== Port Status ===
$(sudo netstat -tulpn | grep -E "3000|8001|27017")

=== Backend Logs (last 50 lines) ===
$(tail -50 /var/log/supervisor/backend.err.log)

=== MongoDB Status ===
$(sudo systemctl status mongodb)

=== Environment Variables ===
Backend MONGO_URL: $(grep MONGO_URL /app/backend/.env)
Frontend BACKEND_URL: $(grep REACT_APP_BACKEND_URL /app/frontend/.env)

=== MongoDB Analytics Count ===
$(mongosh portfolio_db --eval "db.analytics_events.countDocuments()" --quiet)
EOF

cat debug-report.txt
```

Send this report when asking for help.

---

## Contact Support

If issue persists:
- Email: vagesh.anagani@gmail.com
- Include: debug-report.txt
- Describe: Steps you've tried

---

**Most Common Fix:** Restart all services
```bash
sudo supervisorctl restart all
```
or
```bash
docker-compose restart
```

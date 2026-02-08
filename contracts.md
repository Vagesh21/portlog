# API Contracts & Integration Protocol

## Overview
This document outlines the API contracts for integrating the cybersecurity portfolio frontend with the FastAPI backend.

## Current Mock Data Location
- **File**: `/app/frontend/src/data/mockData.js`
- **Components Using Mock Data**:
  - Hero section: `personalInfo`, `stats`
  - About section: `experience`, `education`
  - Skills: `skills`
  - Projects: `projects`
  - Certifications: `certifications`
  - Threat Map: `threatMapData`
  - Contact Form: Currently using frontend-only submission
  - Admin Dashboard: Currently using static mock analytics

## Backend Implementation Required

### 1. Contact Form API
**Endpoint**: `POST /api/contact`
**Purpose**: Handle contact form submissions

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "message": "string",
  "captcha_answer": "string"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Message received successfully"
}
```

**MongoDB Collection**: `contacts`
**Schema**:
- name: String
- email: String
- message: String
- timestamp: DateTime
- ip_address: String (optional)
- read: Boolean (default: false)

### 2. Analytics Tracking API
**Endpoint**: `POST /api/analytics/track`
**Purpose**: Track page visits, clicks, and user interactions

**Request Body**:
```json
{
  "event_type": "page_view" | "click" | "form_submit",
  "page": "string",
  "ip_address": "string",
  "user_agent": "string",
  "device_type": "desktop" | "mobile" | "tablet",
  "timestamp": "datetime"
}
```

**Response**:
```json
{
  "success": true,
  "event_id": "string"
}
```

**MongoDB Collection**: `analytics_events`
**Schema**:
- event_type: String
- page: String
- ip_address: String
- user_agent: String
- device_type: String
- timestamp: DateTime
- session_id: String

### 3. Analytics Dashboard API
**Endpoint**: `GET /api/analytics/stats`
**Purpose**: Retrieve analytics data for admin dashboard

**Query Parameters**:
- `time_range`: "7d" | "30d" | "all" (default: "7d")

**Response**:
```json
{
  "total_visits": number,
  "total_clicks": number,
  "unique_visitors": number,
  "avg_session_time": "string",
  "visit_data": [
    { "date": "string", "visits": number, "clicks": number }
  ],
  "page_views": [
    { "page": "string", "views": number }
  ],
  "device_stats": [
    { "name": "string", "value": number }
  ],
  "recent_visitors": [
    {
      "ip": "string",
      "timestamp": "string",
      "page": "string",
      "device": "string"
    }
  ]
}
```

**MongoDB Collections Used**:
- `analytics_events`: For aggregating all analytics data

## Frontend Integration Steps

### Step 1: Contact Form Integration
**File**: `/app/frontend/src/components/ContactForm.jsx`
**Changes**:
1. Replace mock `setTimeout` with actual API call to `POST /api/contact`
2. Use axios to send form data
3. Handle backend response and errors
4. Remove mock captcha validation (backend will validate)

### Step 2: Analytics Tracking Integration
**Files**: 
- `/app/frontend/src/App.js` (add tracking on mount and route changes)
- Create new file: `/app/frontend/src/utils/analytics.js`

**Implementation**:
1. Create analytics utility function
2. Track page views on component mount
3. Track clicks on interactive elements
4. Send data to `POST /api/analytics/track`
5. Extract IP address and device type from user agent

### Step 3: Admin Dashboard Integration
**File**: `/app/frontend/src/pages/AdminDashboard.jsx`
**Changes**:
1. Replace mock `useState` initialization with `useEffect` API call
2. Fetch data from `GET /api/analytics/stats`
3. Add loading states and error handling
4. Auto-refresh data every 30 seconds

## Database Models

### Contact Model
```python
class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    ip_address: Optional[str] = None
    read: bool = False
```

### Analytics Event Model
```python
class AnalyticsEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: str
    page: str
    ip_address: str
    user_agent: str
    device_type: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    session_id: Optional[str] = None
```

## Backend Routes Summary
```python
# Contact endpoints
@api_router.post("/contact", response_model=ContactResponse)
async def create_contact(contact: ContactCreate)

# Analytics endpoints
@api_router.post("/analytics/track", response_model=TrackingResponse)
async def track_event(event: AnalyticsEvent)

@api_router.get("/analytics/stats", response_model=AnalyticsStats)
async def get_analytics_stats(time_range: str = "7d")
```

## Notes
- All mock data in `mockData.js` will remain for static content (personalInfo, projects, certifications, etc.)
- Only contact form submissions and analytics will be backend-integrated
- Frontend will still display static portfolio content
- Admin dashboard at `/admin-analytics-dashboard` is intentionally hidden (no navigation link)

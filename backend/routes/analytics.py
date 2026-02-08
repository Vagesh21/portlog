from fastapi import APIRouter, Request, Query
from models import (
    AnalyticsEventCreate, 
    AnalyticsEvent, 
    TrackingResponse,
    AnalyticsStats,
    VisitDataPoint,
    PageView,
    DeviceStat,
    RecentVisitor
)
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from typing import Optional
import os
import logging
import re

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analytics", tags=["analytics"])

# Get database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'portfolio_db')]

def parse_user_agent(user_agent: str) -> str:
    """
    Parse user agent to determine device type
    """
    user_agent_lower = user_agent.lower()
    if 'mobile' in user_agent_lower or 'android' in user_agent_lower or 'iphone' in user_agent_lower:
        return 'mobile'
    elif 'tablet' in user_agent_lower or 'ipad' in user_agent_lower:
        return 'tablet'
    else:
        return 'desktop'

def parse_browser(user_agent: str) -> str:
    """
    Parse user agent to determine browser
    """
    ua = user_agent.lower()
    if 'edg' in ua:
        return 'Edge'
    elif 'chrome' in ua and 'edg' not in ua:
        return 'Chrome'
    elif 'firefox' in ua:
        return 'Firefox'
    elif 'safari' in ua and 'chrome' not in ua:
        return 'Safari'
    elif 'opera' in ua or 'opr' in ua:
        return 'Opera'
    else:
        return 'Other'

def parse_os(user_agent: str) -> str:
    """
    Parse user agent to determine operating system
    """
    ua = user_agent.lower()
    if 'windows' in ua:
        return 'Windows'
    elif 'mac' in ua and 'iphone' not in ua and 'ipad' not in ua:
        return 'macOS'
    elif 'linux' in ua and 'android' not in ua:
        return 'Linux'
    elif 'android' in ua:
        return 'Android'
    elif 'iphone' in ua or 'ipad' in ua:
        return 'iOS'
    else:
        return 'Other'

def get_location_from_ip(ip_address: str) -> str:
    """
    Get approximate location from IP address
    Note: This is a basic implementation. For production, use a service like ipapi.co
    """
    # For local IPs
    if ip_address.startswith('127.') or ip_address.startswith('192.168.') or ip_address.startswith('10.'):
        return 'Local Network'
    # For this demo, return placeholder
    return 'Unknown'

@router.post("/track", response_model=TrackingResponse)
async def track_event(event_data: AnalyticsEventCreate, request: Request):
    """
    Track analytics events (page views, clicks)
    """
    try:
        # Get client information
        client_ip = request.client.host
        user_agent = request.headers.get("user-agent", "Unknown")
        device_type = parse_user_agent(user_agent)
        browser = parse_browser(user_agent)
        os = parse_os(user_agent)
        location = get_location_from_ip(client_ip)
        
        # Create event
        event = AnalyticsEvent(
            event_type=event_data.event_type,
            page=event_data.page,
            ip_address=client_ip,
            user_agent=user_agent,
            device_type=device_type,
            browser=browser,
            os=os,
            location=location
        )
        
        # Save to database
        result = await db.analytics_events.insert_one(event.dict())
        
        logger.info(f"Analytics event tracked: {event_data.event_type} on {event_data.page} from {client_ip}")
        
        return TrackingResponse(
            success=True,
            event_id=event.id
        )
    
    except Exception as e:
        logger.error(f"Error tracking event: {str(e)}")
        return TrackingResponse(success=False, event_id="")

@router.get("/stats", response_model=AnalyticsStats)
async def get_analytics_stats(time_range: str = Query(default="7d")):
    """
    Get analytics statistics for dashboard
    """
    try:
        # Calculate time range
        now = datetime.utcnow()
        if time_range == "7d":
            start_date = now - timedelta(days=7)
        elif time_range == "30d":
            start_date = now - timedelta(days=30)
        else:
            start_date = datetime(2020, 1, 1)  # All time
        
        # Get all events in time range
        events = await db.analytics_events.find(
            {"timestamp": {"$gte": start_date}}
        ).to_list(10000)
        
        # Calculate total visits (page_view events)
        total_visits = sum(1 for e in events if e.get('event_type') == 'page_view')
        
        # Calculate total clicks
        total_clicks = sum(1 for e in events if e.get('event_type') == 'click')
        
        # Calculate unique visitors (unique IPs)
        unique_ips = set(e.get('ip_address') for e in events)
        unique_visitors = len(unique_ips)
        
        # Mock average session time (could be calculated from real session data)
        avg_session_time = "3m 42s"
        
        # Calculate visit data by day
        visit_data = []
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        for i in range(7):
            day_start = now - timedelta(days=6-i)
            day_end = day_start + timedelta(days=1)
            day_events = [e for e in events if day_start <= e.get('timestamp', now) < day_end]
            visits = sum(1 for e in day_events if e.get('event_type') == 'page_view')
            clicks = sum(1 for e in day_events if e.get('event_type') == 'click')
            visit_data.append(VisitDataPoint(
                date=days[day_start.weekday()],
                visits=visits,
                clicks=clicks
            ))
        
        # Calculate page views
        page_counts = {}
        for event in events:
            if event.get('event_type') == 'page_view':
                page = event.get('page', 'Unknown')
                page_counts[page] = page_counts.get(page, 0) + 1
        
        page_views = [
            PageView(page=page, views=count)
            for page, count in sorted(page_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        ]
        
        # Calculate device stats
        device_counts = {}
        for event in events:
            device = event.get('device_type', 'desktop')
            device_counts[device] = device_counts.get(device, 0) + 1
        
        total_devices = sum(device_counts.values())
        device_stats = [
            DeviceStat(
                name=device.capitalize(),
                value=int((count / total_devices * 100)) if total_devices > 0 else 0
            )
            for device, count in device_counts.items()
        ]
        
        # Get recent visitors (last 10)
        recent_events = sorted(events, key=lambda x: x.get('timestamp', now), reverse=True)[:10]
        recent_visitors = []
        for event in recent_events:
            timestamp = event.get('timestamp', now)
            time_ago = (now - timestamp).total_seconds()
            if time_ago < 60:
                time_str = f"{int(time_ago)}s ago"
            elif time_ago < 3600:
                time_str = f"{int(time_ago / 60)}m ago"
            else:
                time_str = f"{int(time_ago / 3600)}h ago"
            
            recent_visitors.append(RecentVisitor(
                ip=event.get('ip_address', 'Unknown'),
                timestamp=time_str,
                page=event.get('page', '/'),
                device=event.get('device_type', 'desktop').capitalize(),
                browser=event.get('browser', 'Unknown'),
                os=event.get('os', 'Unknown'),
                location=event.get('location', 'Unknown')
            ))
        
        return AnalyticsStats(
            total_visits=total_visits,
            total_clicks=total_clicks,
            unique_visitors=unique_visitors,
            avg_session_time=avg_session_time,
            visit_data=visit_data,
            page_views=page_views,
            device_stats=device_stats,
            recent_visitors=recent_visitors
        )
    
    except Exception as e:
        logger.error(f"Error fetching analytics stats: {str(e)}")
        # Return default empty stats
        return AnalyticsStats(
            total_visits=0,
            total_clicks=0,
            unique_visitors=0,
            avg_session_time="0m 0s",
            visit_data=[],
            page_views=[],
            device_stats=[],
            recent_visitors=[]
        )

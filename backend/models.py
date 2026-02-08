from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid

# Contact Models
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
    captcha_answer: str

class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    read: bool = False

class ContactResponse(BaseModel):
    success: bool
    message: str

# Analytics Models
class AnalyticsEventCreate(BaseModel):
    event_type: str
    page: str
    device_type: Optional[str] = "desktop"

class AnalyticsEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: str
    page: str
    ip_address: str
    user_agent: str
    device_type: str
    browser: Optional[str] = None
    os: Optional[str] = None
    location: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    session_id: Optional[str] = None

class TrackingResponse(BaseModel):
    success: bool
    event_id: str

# Analytics Stats Models
class VisitDataPoint(BaseModel):
    date: str
    visits: int
    clicks: int

class PageView(BaseModel):
    page: str
    views: int

class DeviceStat(BaseModel):
    name: str
    value: int

class RecentVisitor(BaseModel):
    ip: str
    timestamp: str
    page: str
    device: str
    browser: Optional[str] = None
    os: Optional[str] = None
    location: Optional[str] = None

class AnalyticsStats(BaseModel):
    total_visits: int
    total_clicks: int
    unique_visitors: int
    avg_session_time: str
    visit_data: List[VisitDataPoint]
    page_views: List[PageView]
    device_stats: List[DeviceStat]
    recent_visitors: List[RecentVisitor]

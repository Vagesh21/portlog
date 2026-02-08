from pydantic import BaseModel
from typing import Optional, List

# Content Update Models
class PersonalInfoUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None

class SkillUpdate(BaseModel):
    category: str
    level: int

class ProjectUpdate(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    category: str
    duration: str
    technologies: List[str]
    status: str
    highlights: List[str]
    metrics: dict

class CertificationUpdate(BaseModel):
    name: str
    issuer: str
    year: int
    verified: bool
    color: str

class WebsiteSettings(BaseModel):
    theme_color: Optional[str] = None
    enable_analytics: Optional[bool] = None
    enable_contact_form: Optional[bool] = None
    enable_threat_map: Optional[bool] = None

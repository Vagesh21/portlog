from pydantic import BaseModel
from typing import Optional, List, Dict

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
    metrics: Dict[str, int] = {}

class CertificationUpdate(BaseModel):
    name: str
    issuer: str
    year: int
    verified: bool = True
    color: str = "#00d4ff"

class ExperienceUpdate(BaseModel):
    id: Optional[int] = None
    title: str
    company: str
    duration: str
    location: Optional[str] = ""
    description: str
    achievements: List[str]

class EducationUpdate(BaseModel):
    id: Optional[int] = None
    degree: str
    institution: str
    location: Optional[str] = ""
    expected: Optional[str] = ""
    completed: Optional[str] = ""
    current: bool = False

class WebsiteSettings(BaseModel):
    theme_color: Optional[str] = None
    enable_analytics: Optional[bool] = None
    enable_contact_form: Optional[bool] = None
    enable_threat_map: Optional[bool] = None

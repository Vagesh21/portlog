from fastapi import APIRouter, HTTPException, Depends, Header
from models_content import PersonalInfoUpdate, SkillUpdate, ProjectUpdate, CertificationUpdate, WebsiteSettings, ExperienceUpdate, EducationUpdate
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from typing import List, Optional

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/content", tags=["content"])

# Get database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'portfolio_db')]

# Default data to seed the database
DEFAULT_PERSONAL_INFO = {
    "name": "Vagesh Anagani",
    "title": "Cybersecurity Specialist",
    "subtitle": "Master's Candidate in Business Information Systems (Cybersecurity)",
    "location": "Melbourne, Australia",
    "email": "vagesh.anagani@gmail.com",
    "phone": "0412 037 261",
    "bio": "Ambitious cybersecurity professional with expertise in penetration testing, network security, and secure application development. Passionate about protecting digital infrastructure and building resilient systems.",
    "github": "https://github.com/vagesh",
    "linkedin": "https://linkedin.com/in/vagesh-anagani"
}

DEFAULT_SKILLS = [
    {"category": "Penetration Testing", "level": 85},
    {"category": "Network Security", "level": 90},
    {"category": "Web Development", "level": 75},
    {"category": "Cloud Security", "level": 70},
    {"category": "Risk Assessment", "level": 80},
    {"category": "DevOps & Containers", "level": 75}
]

DEFAULT_PROJECTS = [
    {
        "id": 1,
        "title": "Secure Blockchain Transactions",
        "description": "Bachelor's capstone project implementing secure transaction protocols using blockchain technology",
        "category": "Blockchain Security",
        "duration": "Dec 2023 - May 2024",
        "technologies": ["Blockchain", "Cryptography", "Smart Contracts", "Python"],
        "status": "Completed",
        "highlights": ["Implemented secure consensus mechanisms", "Performed security audits on smart contracts", "Reduced transaction vulnerabilities by 95%"],
        "metrics": {"security_score": 95, "vulnerabilities_fixed": 12, "performance": 88}
    },
    {
        "id": 2,
        "title": "Enterprise Cybersecurity Infrastructure",
        "description": "Virtual internship project focusing on enterprise-level security implementations",
        "category": "Network Security",
        "duration": "May 2023 - July 2023",
        "technologies": ["ISO 27001", "Metasploit", "Vulnerability Scanning", "Risk Assessment"],
        "status": "Completed",
        "highlights": ["Conducted comprehensive security audits", "Implemented ISO 27001 controls", "Reduced attack surface by 40%"],
        "metrics": {"security_score": 92, "vulnerabilities_fixed": 28, "performance": 85}
    },
    {
        "id": 3,
        "title": "Self-Hosted Security Lab",
        "description": "Raspberry Pi-based security testing environment with Docker containerization",
        "category": "DevOps & Security",
        "duration": "2023 - Present",
        "technologies": ["Docker", "Nginx", "Raspberry Pi", "Linux", "SSL/TLS"],
        "status": "Active",
        "highlights": ["Configured secure reverse proxy with SSL/TLS", "Automated backup and monitoring systems", "Implemented secure authentication mechanisms"],
        "metrics": {"security_score": 90, "vulnerabilities_fixed": 15, "performance": 92}
    },
    {
        "id": 4,
        "title": "Secure PHP Authentication System",
        "description": "Custom authentication system with 2FA, email verification, and session management",
        "category": "Web Security",
        "duration": "2023",
        "technologies": ["PHP", "MariaDB", "2FA", "PHPMailer", "Session Security"],
        "status": "Completed",
        "highlights": ["Implemented secure password hashing", "Built two-factor authentication system", "Prevented common web vulnerabilities (XSS, CSRF, SQL Injection)"],
        "metrics": {"security_score": 88, "vulnerabilities_fixed": 10, "performance": 90}
    }
]

DEFAULT_CERTIFICATIONS = [
    {"name": "CyberOps Associate", "issuer": "Cisco", "year": 2024, "verified": True, "color": "#00d4ff"},
    {"name": "Cybersecurity Essentials", "issuer": "Cisco", "year": 2024, "verified": True, "color": "#10b981"},
    {"name": "Cyber Threat Management", "issuer": "Cisco", "year": 2024, "verified": True, "color": "#06b6d4"},
    {"name": "Introduction to Cybersecurity", "issuer": "Cisco", "year": 2024, "verified": True, "color": "#0ea5e9"},
    {"name": "Ethical Hacking From Scratch", "issuer": "Udemy", "year": 2023, "verified": True, "color": "#f59e0b"},
    {"name": "Cloud Computing", "issuer": "NPTEL", "year": 2023, "verified": True, "color": "#8b5cf6"},
    {"name": "PMP Certification", "issuer": "Udemy", "year": 2023, "verified": True, "color": "#ec4899"},
    {"name": "Android App Development", "issuer": "A.P.S.S.D.C", "year": 2023, "verified": True, "color": "#14b8a6"}
]

DEFAULT_EXPERIENCE = [
    {
        "id": 1,
        "title": "Cybersecurity Intern",
        "company": "EduSkills",
        "duration": "May 2023 - July 2023",
        "location": "",
        "description": "Virtual internship focusing on enterprise security implementations and risk assessment",
        "achievements": ["Conducted security audits for enterprise systems", "Implemented ISO 27001 security controls", "Performed vulnerability assessments and penetration testing"]
    },
    {
        "id": 2,
        "title": "AI & ML Intern",
        "company": "TeamYuva Techno Solutions",
        "duration": "Aug 2022 - Sep 2022",
        "location": "Hyderabad",
        "description": "Worked on AI and machine learning projects using Python",
        "achievements": ["Developed machine learning models for data analysis", "Implemented AI algorithms for pattern recognition", "Collaborated on cross-functional tech projects"]
    }
]

DEFAULT_EDUCATION = [
    {
        "id": 1,
        "degree": "Master of Business Information Systems in Cybersecurity",
        "institution": "Australian Institute of Higher Education (AIH)",
        "location": "Melbourne, VIC",
        "expected": "July 2026",
        "completed": "",
        "current": True
    },
    {
        "id": 2,
        "degree": "B.Tech in Information Technology",
        "institution": "SRK Institute of Technology",
        "location": "",
        "expected": "",
        "completed": "May 2024",
        "current": False
    }
]

# Seed database endpoint
@router.post("/seed")
async def seed_database():
    """Seed the database with default content"""
    try:
        # Check if already seeded
        existing = await db.personal_info.find_one()
        if existing:
            return {"success": True, "message": "Database already seeded"}
        
        # Seed personal info
        await db.personal_info.insert_one(DEFAULT_PERSONAL_INFO.copy())
        
        # Seed skills
        await db.skills.delete_many({})
        await db.skills.insert_many([s.copy() for s in DEFAULT_SKILLS])
        
        # Seed projects
        await db.projects.delete_many({})
        await db.projects.insert_many([p.copy() for p in DEFAULT_PROJECTS])
        
        # Seed certifications
        await db.certifications.delete_many({})
        await db.certifications.insert_many([c.copy() for c in DEFAULT_CERTIFICATIONS])
        
        # Seed experience
        await db.experience.delete_many({})
        await db.experience.insert_many([e.copy() for e in DEFAULT_EXPERIENCE])
        
        # Seed education
        await db.education.delete_many({})
        await db.education.insert_many([e.copy() for e in DEFAULT_EDUCATION])
        
        logger.info("Database seeded successfully")
        return {"success": True, "message": "Database seeded with default content"}
    except Exception as e:
        logger.error(f"Error seeding database: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to seed database: {str(e)}")

# Get all content at once
@router.get("/all")
async def get_all_content():
    """Get all content for the portfolio"""
    try:
        personal_info = await db.personal_info.find_one({}, {"_id": 0})
        skills = await db.skills.find({}, {"_id": 0}).to_list(100)
        projects = await db.projects.find({}, {"_id": 0}).to_list(100)
        certifications = await db.certifications.find({}, {"_id": 0}).to_list(100)
        experience = await db.experience.find({}, {"_id": 0}).to_list(100)
        education = await db.education.find({}, {"_id": 0}).to_list(100)
        
        return {
            "personal_info": personal_info or DEFAULT_PERSONAL_INFO,
            "skills": skills if skills else DEFAULT_SKILLS,
            "projects": projects if projects else DEFAULT_PROJECTS,
            "certifications": certifications if certifications else DEFAULT_CERTIFICATIONS,
            "experience": experience if experience else DEFAULT_EXPERIENCE,
            "education": education if education else DEFAULT_EDUCATION
        }
    except Exception as e:
        logger.error(f"Error fetching all content: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch content")

# Personal Info
@router.get("/personal-info")
async def get_personal_info():
    """Get current personal information"""
    try:
        info = await db.personal_info.find_one({}, {"_id": 0})
        if not info:
            return {"message": "No data found"}
        return info
    except Exception as e:
        logger.error(f"Error fetching personal info: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch personal info")

@router.put("/personal-info")
async def update_personal_info(data: PersonalInfoUpdate):
    """Update personal information"""
    try:
        update_data = {k: v for k, v in data.dict().items() if v is not None}
        if not update_data:
            return {"success": False, "message": "No data to update"}
        
        result = await db.personal_info.update_one(
            {},
            {"$set": update_data},
            upsert=True
        )
        return {"success": True, "message": "Personal info updated successfully"}
    except Exception as e:
        logger.error(f"Error updating personal info: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update personal info")

# Skills
@router.get("/skills")
async def get_skills():
    """Get all skills"""
    try:
        skills = await db.skills.find({}, {"_id": 0}).to_list(100)
        return {"skills": skills}
    except Exception as e:
        logger.error(f"Error fetching skills: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch skills")

@router.post("/skills")
async def add_skill(skill: SkillUpdate):
    """Add a new skill"""
    try:
        await db.skills.insert_one(skill.dict())
        return {"success": True, "message": "Skill added successfully"}
    except Exception as e:
        logger.error(f"Error adding skill: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to add skill")

@router.put("/skills/{category}")
async def update_skill(category: str, skill: SkillUpdate):
    """Update a skill"""
    try:
        result = await db.skills.update_one(
            {"category": category},
            {"$set": skill.dict()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Skill not found")
        return {"success": True, "message": "Skill updated successfully"}
    except Exception as e:
        logger.error(f"Error updating skill: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update skill")

@router.delete("/skills/{category}")
async def delete_skill(category: str):
    """Delete a skill"""
    try:
        result = await db.skills.delete_one({"category": category})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Skill not found")
        return {"success": True, "message": "Skill deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting skill: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete skill")

# Projects
@router.get("/projects")
async def get_projects():
    """Get all projects"""
    try:
        projects = await db.projects.find({}, {"_id": 0}).to_list(100)
        return {"projects": projects}
    except Exception as e:
        logger.error(f"Error fetching projects: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch projects")

@router.post("/projects")
async def add_project(project: ProjectUpdate):
    """Add a new project"""
    try:
        project_dict = project.dict()
        # Generate new ID
        max_project = await db.projects.find_one(sort=[("id", -1)])
        project_dict['id'] = (max_project.get('id', 0) + 1) if max_project else 1
        
        await db.projects.insert_one(project_dict)
        return {"success": True, "message": "Project added successfully", "id": project_dict['id']}
    except Exception as e:
        logger.error(f"Error adding project: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to add project")

@router.put("/projects/{project_id}")
async def update_project(project_id: int, project: ProjectUpdate):
    """Update a project"""
    try:
        result = await db.projects.update_one(
            {"id": project_id},
            {"$set": project.dict(exclude={'id'})}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"success": True, "message": "Project updated successfully"}
    except Exception as e:
        logger.error(f"Error updating project: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update project")

@router.delete("/projects/{project_id}")
async def delete_project(project_id: int):
    """Delete a project"""
    try:
        result = await db.projects.delete_one({"id": project_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"success": True, "message": "Project deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting project: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete project")

# Certifications
@router.get("/certifications")
async def get_certifications():
    """Get all certifications"""
    try:
        certs = await db.certifications.find({}, {"_id": 0}).to_list(100)
        return {"certifications": certs}
    except Exception as e:
        logger.error(f"Error fetching certifications: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch certifications")

@router.post("/certifications")
async def add_certification(cert: CertificationUpdate):
    """Add a new certification"""
    try:
        await db.certifications.insert_one(cert.dict())
        return {"success": True, "message": "Certification added successfully"}
    except Exception as e:
        logger.error(f"Error adding certification: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to add certification")

@router.delete("/certifications/{cert_name}")
async def delete_certification(cert_name: str):
    """Delete a certification"""
    try:
        result = await db.certifications.delete_one({"name": cert_name})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Certification not found")
        return {"success": True, "message": "Certification deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting certification: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete certification")

# Website Settings
@router.get("/settings")
async def get_settings():
    """Get website settings"""
    try:
        settings = await db.settings.find_one({}, {"_id": 0})
        if not settings:
            return {
                "theme_color": "#00d4ff",
                "enable_analytics": True,
                "enable_contact_form": True,
                "enable_threat_map": True
            }
        return settings
    except Exception as e:
        logger.error(f"Error fetching settings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch settings")

@router.put("/settings")
async def update_settings(settings: WebsiteSettings):
    """Update website settings"""
    try:
        update_data = {k: v for k, v in settings.dict().items() if v is not None}
        result = await db.settings.update_one(
            {},
            {"$set": update_data},
            upsert=True
        )
        return {"success": True, "message": "Settings updated successfully"}
    except Exception as e:
        logger.error(f"Error updating settings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update settings")

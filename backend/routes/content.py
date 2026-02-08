from fastapi import APIRouter, HTTPException
from models_content import PersonalInfoUpdate, SkillUpdate, ProjectUpdate, CertificationUpdate, WebsiteSettings
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from typing import List

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/content", tags=["content"])

# Get database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'portfolio_db')]

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

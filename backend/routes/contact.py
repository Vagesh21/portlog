from fastapi import APIRouter, Request, HTTPException
from models import ContactCreate, Contact, ContactResponse
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contact", tags=["contact"])

# Get database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'portfolio_db')]

@router.post("", response_model=ContactResponse)
async def create_contact(contact_data: ContactCreate, request: Request):
    """
    Handle contact form submission
    """
    try:
        # Simple captcha validation (could be enhanced)
        # For now, we'll accept any answer and validate on frontend
        
        # Get client IP address
        client_ip = request.client.host
        user_agent = request.headers.get("user-agent", "Unknown")
        
        # Create contact object
        contact = Contact(
            name=contact_data.name,
            email=contact_data.email,
            message=contact_data.message,
            ip_address=client_ip,
            user_agent=user_agent
        )
        
        # Save to database
        result = await db.contacts.insert_one(contact.dict())
        
        logger.info(f"Contact form submitted by {contact_data.email} from IP {client_ip}")
        
        return ContactResponse(
            success=True,
            message="Thank you for your message! I'll get back to you soon."
        )
    
    except Exception as e:
        logger.error(f"Error saving contact: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit contact form")

@router.get("/list")
async def list_contacts(skip: int = 0, limit: int = 50, unread_only: bool = False):
    """
    List all contacts (admin endpoint)
    """
    try:
        query = {"read": False} if unread_only else {}
        contacts = await db.contacts.find(query).sort("timestamp", -1).skip(skip).limit(limit).to_list(limit)
        return {"success": True, "contacts": contacts}
    except Exception as e:
        logger.error(f"Error fetching contacts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch contacts")

@router.patch("/{contact_id}/read")
async def mark_contact_read(contact_id: str):
    """
    Mark a contact as read
    """
    try:
        result = await db.contacts.update_one(
            {"id": contact_id},
            {"$set": {"read": True}}
        )
        return {"success": True, "modified": result.modified_count}
    except Exception as e:
        logger.error(f"Error updating contact: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update contact")

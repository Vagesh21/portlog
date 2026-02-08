from fastapi import APIRouter, HTTPException, Depends, Header
from models_auth import LoginRequest, LoginResponse, PasswordChangeRequest, AdminUser, TokenData
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import hashlib
import secrets
from datetime import datetime, timedelta
import jwt
from typing import Optional

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])

# Get database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'portfolio_db')]

# Secret key for JWT (in production, use environment variable)
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(username: str) -> str:
    """Create JWT access token"""
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode = {"sub": username, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return username"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None

async def get_current_user(authorization: str = Header(None)):
    """Dependency to get current authenticated user"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    username = verify_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = await db.admin_users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return username

@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """
    Login endpoint - Default credentials: username=admin, password=password
    """
    try:
        # Check if admin user exists
        user = await db.admin_users.find_one({"username": credentials.username})
        
        # If no admin user exists, create default one
        if not user:
            # Only create default admin on first login attempt
            if credentials.username == "admin":
                default_admin = {
                    "id": str(secrets.token_hex(16)),
                    "username": "admin",
                    "password_hash": hash_password("password"),
                    "created_at": datetime.utcnow(),
                    "last_login": None
                }
                await db.admin_users.insert_one(default_admin)
                user = default_admin
                logger.info("Default admin user created")
            else:
                return LoginResponse(
                    success=False,
                    message="Invalid credentials"
                )
        
        # Verify password
        password_hash = hash_password(credentials.password)
        if password_hash != user.get("password_hash"):
            return LoginResponse(
                success=False,
                message="Invalid credentials"
            )
        
        # Update last login
        await db.admin_users.update_one(
            {"username": credentials.username},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Create token
        token = create_access_token(credentials.username)
        
        return LoginResponse(
            success=True,
            token=token,
            message="Login successful",
            user={
                "username": user["username"],
                "last_login": user.get("last_login")
            }
        )
    
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")

@router.post("/change-password")
async def change_password(
    password_data: PasswordChangeRequest,
    current_user: str = Depends(get_current_user)
):
    """
    Change password for authenticated user
    """
    try:
        # Get user
        user = await db.admin_users.find_one({"username": current_user})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify current password
        current_password_hash = hash_password(password_data.current_password)
        if current_password_hash != user.get("password_hash"):
            return {"success": False, "message": "Current password is incorrect"}
        
        # Update password
        new_password_hash = hash_password(password_data.new_password)
        await db.admin_users.update_one(
            {"username": current_user},
            {"$set": {"password_hash": new_password_hash}}
        )
        
        logger.info(f"Password changed for user: {current_user}")
        
        return {"success": True, "message": "Password changed successfully"}
    
    except Exception as e:
        logger.error(f"Password change error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to change password")

@router.get("/verify")
async def verify_token_endpoint(current_user: str = Depends(get_current_user)):
    """
    Verify if token is valid
    """
    return {"success": True, "username": current_user}

@router.post("/logout")
async def logout(current_user: str = Depends(get_current_user)):
    """
    Logout endpoint (token should be removed on client side)
    """
    return {"success": True, "message": "Logged out successfully"}

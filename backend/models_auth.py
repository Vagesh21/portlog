from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

# Authentication Models
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    message: str
    user: Optional[dict] = None

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class TokenData(BaseModel):
    username: str
    exp: datetime

from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from uuid import UUID

class AddWaitlist(BaseModel):

    email: EmailStr
    #created_at: datetime

class ReturnMessage(BaseModel):
    message: str
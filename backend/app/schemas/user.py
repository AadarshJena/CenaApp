from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from uuid import UUID


# What the client SENDS when creating an account.
# Note: a plain `password`, not `hashed_password` — we hash it ourselves.
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: str | None = None
    last_name: str | None = None
    phone_number: str | None = None
    is_restaurant_owner: bool = False


# What the API SENDS BACK about a user.
# Notice there is NO password field here at all — it can never leak out.
class UserRead(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    is_restaurant_owner: bool
    is_active: bool
    created_at: datetime

    # Lets Pydantic read data straight off a SQLAlchemy model object
    # (e.g. user.id, user.username) instead of requiring a dict.
    model_config = ConfigDict(from_attributes=True)

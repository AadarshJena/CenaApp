from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geography
from app.database import Base
from datetime import datetime, timezone
import uuid

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    name = Column(String, nullable=False)
    address = Column(String)
    location = Column(Geography(geometry_type='POINT', srid=4326))
    cuisine_type = Column(String)
    hours = Column(JSON)
    phone_number = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON, Numeric, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
from datetime import datetime, timezone
import uuid


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    restaurant_id = Column(UUID(as_uuid=True), ForeignKey("restaurants.id"))
    name = Column(String, nullable=False)
    description = Column(String)
    price = Column(Numeric(10, 2))
    spice_level = Column(Integer)
    ingredients = Column(JSON)
    category = Column(String)
    image_url = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

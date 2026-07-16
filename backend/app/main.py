from fastapi import FastAPI
from app.database import engine, Base
from app.models import user, restaurant, menu_item
from app.routers import users
from app.routers import waitlist

app = FastAPI()
app.include_router(users.router)
app.include_router(waitlist.router)


Base.metadata.create_all(bind=engine)


from fastapi import FastAPI
from app.database import engine, Base
from app.models import user, restaurant, menu_item
from app.routers import users

app = FastAPI()
app.include_router(users.router)


Base.metadata.create_all(bind=engine)


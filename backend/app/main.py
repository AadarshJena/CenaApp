from fastapi import FastAPI
from app.database import engine, Base
from app.models import user, restaurant, menu_item

app = FastAPI()

Base.metadata.create_all(bind=engine)
from fastapi import FastAPI
from app.database import engine, Base
from app.models import user, restaurant, menu_item
from app.routers import users
from app.routers import waitlist
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://cena-app.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(users.router)
app.include_router(waitlist.router)


Base.metadata.create_all(bind=engine)


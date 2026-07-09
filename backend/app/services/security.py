from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt 
from dotenv import load_dotenv 
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:

    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:

    return pwd_context.verify(plain_password, hashed_password)

#this function creates an access token for each login that keeps the user logged in even if the server refreshes
"""data: a dictionary of data about the user 
    expires_delta: the change in time until the user's login expires."""

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    
    #the data to encode to a jwt token uses a copy of the data dictionary provided, so it doesn't impact the user's original data dictionary
    to_encode = data.copy()

    #first checks if a expires_delta is provided; Otherwise, it uses the default expiry time specified in the .env file
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

        #encodes the data (to_encode), confirms the SECRET_KEY from .env, and uses the HS256 algorithm we specified in .env
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
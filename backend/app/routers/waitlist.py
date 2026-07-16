from fastapi import status, APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.waitlist import Waitlist
from app.schemas.waitlist import AddWaitlist, ReturnMessage


router = APIRouter(prefix="/waitlist", tags=["waitlist"])

@router.post("/addwaitlist", response_model=ReturnMessage, status_code=status.HTTP_201_CREATED)
def addWaitList(new_entry: AddWaitlist, db: Session = Depends(get_db)):

    existing = db.query(Waitlist).filter(Waitlist.email == new_entry.email).first()
    if existing:
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail="Email already waitlisted")
    
    new_waitlist = Waitlist(

        email = new_entry.email,
        #created_at = new_entry.created_at,

    )

    db.add(new_waitlist)
    db.commit()
    db.refresh(new_waitlist)

    return ReturnMessage(message="You're on the waitlist!")
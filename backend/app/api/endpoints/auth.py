from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ... import crud, schemas, models
from ...dependencies import get_db

router = APIRouter()

@router.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.CRUDUser.get_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.CRUDUser.create(db=db, user=user)

@router.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.CRUDUser.get_by_username(db, username=user.username)
    if not db_user or db_user.password != user.password:  # In production, verify hashed password
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": "dummy_token", "token_type": "bearer"}
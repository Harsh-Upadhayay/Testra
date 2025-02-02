from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ... import crud, schemas
from ...dependencies import get_db

router = APIRouter()

@router.post("/sessions/", response_model=schemas.Session)
def create_session(
    session: schemas.SessionCreate,
    db: Session = Depends(get_db),
    current_user_id: int = 1  # In production, get from token
):
    return crud.CRUDSession.create(db=db, session=session, user_id=current_user_id)

@router.post("/sessions/{session_id}/answer")
def submit_answer(
    session_id: int,
    question_number: int,
    answer: int,
    db: Session = Depends(get_db)
):
    updated_session = crud.CRUDSession.update_answer(
        db, session_id=session_id,
        question_number=question_number,
        answer=answer
    )
    if not updated_session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": "success"}

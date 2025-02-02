from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ... import crud, schemas, models
from ...dependencies import get_db

router = APIRouter()

@router.post("/questions/", response_model=schemas.Question)
def create_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.CRUDQuestion.create(db=db, question=question)

@router.get("/questions/{question_id}", response_model=schemas.Question)
def get_question(question_id: int, db: Session = Depends(get_db)):
    db_question = crud.CRUDQuestion.get_question(db, question_id=question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question

@router.get("/exams/{exam_id}/questions", response_model=List[schemas.Question])
def get_exam_questions(exam_id: int, db: Session = Depends(get_db)):
    return crud.CRUDQuestion.get_questions_by_exam(db, exam_id=exam_id)

@router.put("/questions/{question_id}", response_model=schemas.Question)
def update_question(
    question_id: int,
    question: schemas.QuestionCreate,
    db: Session = Depends(get_db)
):
    db_question = crud.CRUDQuestion.update_question(db, question_id=question_id, question=question)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question

@router.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    success = crud.CRUDQuestion.delete_question(db, question_id=question_id)
    if not success:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"status": "success"}

@router.put("/sessions/{session_id}/questions/{question_id}", response_model=schemas.QuestionProgressResponse)
def update_question_progress(
    session_id: int,
    question_id: int,
    progress_update: schemas.QuestionProgressUpdate,
    db: Session = Depends(get_db)
):
    # Try to locate an existing QuestionProgress record using the ORM model.
    qp = db.query(models.QuestionProgress).filter(
        models.QuestionProgress.exam_session_id == session_id,
        models.QuestionProgress.question_id == question_id
    ).first()

    if not qp:
        # If no progress exists yet, create a new record with the incoming update.
        qp = models.QuestionProgress(
            exam_session_id=session_id,
            question_id=question_id,
            answer=progress_update.answer,
            time_taken=progress_update.time_taken,
            flagged=progress_update.flagged,
            is_submitted=progress_update.submitted,
            correct=progress_update.correct
        )
        db.add(qp)
    else:
        # Otherwise, update the existing record.
        qp.answer = progress_update.answer
        qp.time_taken = progress_update.time_taken
        qp.flagged = progress_update.flagged
        qp.is_submitted = progress_update.submitted
        qp.correct = progress_update.correct

    db.commit()
    db.refresh(qp)
    return qp

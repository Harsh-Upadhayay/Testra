from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ... import  schemas, crud
from ...dependencies import get_db

router = APIRouter()

@router.post("/exams/", response_model=schemas.Exam)
def create_exam(exam: schemas.ExamCreate, db: Session = Depends(get_db)):
    return crud.CRUDExam.create(db=db, exam=exam)

@router.get("/exams/{exam_id}", response_model=schemas.Exam)
def get_exam(exam_id: int, db: Session = Depends(get_db)):
    db_exam = crud.CRUDExam.get_exam(db, exam_id=exam_id)
    if db_exam is None:
        raise HTTPException(status_code=404, detail="Exam not found")
    return db_exam

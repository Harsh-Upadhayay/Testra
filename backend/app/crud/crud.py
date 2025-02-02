from sqlalchemy.orm import Session
from .. import models, schemas
from datetime import datetime

class CRUDUser:
    def create(db: Session, user: schemas.UserCreate):
        db_user = models.User(
            username=user.username,
            password=user.password  # In production, hash the password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def get_by_username(db: Session, username: str):
        return db.query(models.User).filter(models.User.username == username).first()

class CRUDExam:
    def create(db: Session, exam: schemas.ExamCreate):
        db_exam = models.Exam(**exam.dict())
        db.add(db_exam)
        db.commit()
        db.refresh(db_exam)
        return db_exam

    def get_exam(db: Session, exam_id: int):
        return db.query(models.Exam).filter(models.Exam.id == exam_id).first()

class CRUDSession:
    def create(db: Session, session: schemas.SessionCreate, user_id: int):
        db_session = models.ExamSession(
            user_id=user_id,
            exam_id=session.exam_id,
            start_time=datetime.now(),
            answers={},
        )
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        return db_session

    def update_answer(db: Session, session_id: int, question_number: int, answer: int):
        session = db.query(models.ExamSession).filter(models.ExamSession.id == session_id).first()
        if session:
            answers = session.answers or {}
            answers[str(question_number)] = answer
            session.answers = answers
            session.current_question = question_number + 1
            db.commit()
            return session
        return None
    
class CRUDQuestion:
    def create(db: Session, question: schemas.QuestionCreate):
        db_question = models.Question(**question.dict())
        db.add(db_question)
        db.commit()
        db.refresh(db_question)
        return db_question

    def get_question(db: Session, question_id: int):
        return db.query(models.Question).filter(models.Question.id == question_id).first()
    
    def get_questions_by_exam(db: Session, exam_id: int):
        return db.query(models.Question).filter(models.Question.exam_id == exam_id).all()
    
    def update_question(db: Session, question_id: int, question: schemas.QuestionCreate):
        db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
        if db_question:
            for key, value in question.dict().items():
                setattr(db_question, key, value)
            db.commit()
            db.refresh(db_question)
        return db_question
    
    def delete_question(db: Session, question_id: int):
        db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
        if db_question:
            db.delete(db_question)
            db.commit()
            return True
        return False
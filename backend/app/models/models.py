from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password = Column(String(100))
    sessions = relationship("ExamSession", back_populates="user")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(500))
    options = Column(JSON)  # JSON array of options
    correct_answer = Column(Integer)  # Index of the correct option
    explanation = Column(String(500))
    tags = Column(JSON)  # JSON array of tags
    time_limit = Column(Integer)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    exam = relationship("Exam", back_populates="questions")
    # New relationship:
    progresses = relationship("QuestionProgress", back_populates="question", cascade="all, delete-orphan")

class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    description = Column(String(500))
    total_time = Column(Integer)  # in minutes
    questions = relationship("Question", back_populates="exam")
    sessions = relationship("ExamSession", back_populates="exam")

class ExamSession(Base):
    __tablename__ = "exam_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exam_id = Column(Integer, ForeignKey("exams.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    is_complete = Column(Boolean, default=False)
    current_question = Column(Integer, default=0)
    answers = Column(JSON)  # you may deprecate this if using QuestionProgress instead
    score = Column(Float)
    user = relationship("User", back_populates="sessions")
    exam = relationship("Exam", back_populates="sessions")
    # New relationship:
    question_progresses = relationship("QuestionProgress", back_populates="session", cascade="all, delete-orphan")

# New model for tracking per-question progress:
class QuestionProgress(Base):
    __tablename__ = "question_progress"
    id = Column(Integer, primary_key=True, index=True)
    exam_session_id = Column(Integer, ForeignKey("exam_sessions.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer = Column(Integer, nullable=True)
    time_taken = Column(Integer, nullable=True)
    flagged = Column(Boolean, default=False)
    is_submitted = Column(Boolean, default=False)
    correct = Column(Boolean, nullable=True)

    session = relationship("ExamSession", back_populates="question_progresses")
    question = relationship("Question", back_populates="progresses")

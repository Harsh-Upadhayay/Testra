from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class QuestionBase(BaseModel):
    text: str
    options: List[str]
    correct_answer: int
    explanation: str
    tags: List[str]
    time_limit: int

class QuestionCreate(QuestionBase):
    exam_id: int

class Question(QuestionBase):
    id: int
    class Config:
        from_attributes = True

class ExamBase(BaseModel):
    title: str
    description: str
    total_time: int

class ExamCreate(ExamBase):
    pass

class Exam(ExamBase):
    id: int
    questions: List[Question] = []
    class Config:
        from_attributes = True

class SessionBase(BaseModel):
    exam_id: int

class SessionCreate(SessionBase):
    pass

class Session(SessionBase):
    id: int
    user_id: int
    start_time: datetime
    end_time: Optional[datetime]
    is_complete: bool
    current_question: int
    score: Optional[float]
    class Config:
        from_attributes = True
        
class QuestionProgressUpdate(BaseModel):
    answer: Optional[int]
    time_taken: Optional[int]
    flagged: bool
    submitted: bool
    correct: Optional[bool]

class QuestionProgressResponse(BaseModel):
    id: int
    exam_session_id: int
    question_id: int
    answer: Optional[int]
    time_taken: Optional[int]
    flagged: bool
    is_submitted: bool
    correct: Optional[bool]

    class Config:
        orm_mode = True
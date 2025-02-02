import React, { useState, useEffect, useRef } from 'react';
import ExamList from './components/ExamList';
import ExamContainer from './components/ExamContainer';
import Container from '@mui/material/Container';
import './App.css';

const backend = "http://159.223.187.90:8000";

function App() {
  // Global state
  const [examStarted, setExamStarted] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // seconds
  const [sessionId, setSessionId] = useState(null);
  const [questionProgress, setQuestionProgress] = useState({});
  const [showReveal, setShowReveal] = useState(false);

  const timerIntervalRef = useRef(null);
  const questionStartTimeRef = useRef(null);

  // Restore saved progress from localStorage on mount.
  useEffect(() => {
    const savedProgress = localStorage.getItem('questionProgress');
    const savedIndex = localStorage.getItem('currentQuestionIndex');
    const savedSession = localStorage.getItem('sessionId');
    const savedTime = localStorage.getItem('timeLeft');
    if (savedProgress) setQuestionProgress(JSON.parse(savedProgress));
    if (savedIndex) setCurrentQuestionIndex(parseInt(savedIndex));
    if (savedSession) setSessionId(savedSession);
    if (savedTime) setTimeLeft(parseInt(savedTime));
  }, []);

  // Save progress to localStorage and update backend session.
  const saveProgress = () => {
    localStorage.setItem('questionProgress', JSON.stringify(questionProgress));
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('timeLeft', timeLeft);
    updateSessionOnBackend();
  };

  const updateSessionOnBackend = () => {
    if (!sessionId) return;
    fetch(`${backend}/sessions/${sessionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_question: currentQuestionIndex,
        score: score
      })
    })
      .then(response => {
        if (!response.ok) {
          console.error("Failed to update session on backend");
        }
      })
      .catch(error => console.error("Error updating session: ", error));
  };

  // Timer effect: update timeLeft every second once exam starts.
  useEffect(() => {
    if (!examStarted) return;
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          endExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerIntervalRef.current);
  }, [examStarted]);

  // Helper to format time (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Start exam: create session and load questions.
  const startExam = (examId) => {
    setExamStarted(true);
    if (!sessionId) {
      fetch(`${backend}/sessions/?current_user_id=1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam_id: examId })
      })
        .then(response => {
          if (!response.ok) throw new Error("Session creation failed");
          return response.json();
        })
        .then(sessionData => {
          setSessionId(sessionData.id);
          localStorage.setItem('sessionId', sessionData.id);
          return fetch(`${backend}/exams/${examId}/questions`);
        })
        .then(response => {
          if (!response.ok) throw new Error("Failed to fetch exam questions");
          return response.json();
        })
        .then(questionsData => {
          const exam = {
            title: "Exam",
            total_time: questionsData.length * 60,
            questions: questionsData
          };
          setCurrentExam(exam);
          const initProgress = {};
          for (let i = 0; i < exam.questions.length; i++) {
            initProgress[i] = questionProgress[i] || { answer: null, timeTaken: 0, flagged: false, submitted: false, correct: null };
          }
          setQuestionProgress(initProgress);
          setTimeLeft(exam.total_time);
          questionStartTimeRef.current = Date.now();
        })
        .catch(error => {
          console.error("Error starting exam: ", error);
          alert("Error starting exam. Please try again later.");
        });
    } else {
      // Restore an existing session.
      fetch(`${backend}/exams/${examId}/questions`)
        .then(response => {
          if (!response.ok) throw new Error("Failed to fetch exam questions");
          return response.json();
        })
        .then(questionsData => {
          const exam = {
            title: "Exam",
            total_time: questionsData.length * 60,
            questions: questionsData
          };
          setCurrentExam(exam);
          const initProgress = {};
          for (let i = 0; i < exam.questions.length; i++) {
            initProgress[i] = questionProgress[i] || { answer: null, timeTaken: 0, flagged: false, submitted: false, correct: null };
          }
          setQuestionProgress(initProgress);
          questionStartTimeRef.current = Date.now();
        })
        .catch(error => console.error("Error fetching exam questions: ", error));
    }
  };

  // Called when a question is shown.
  const showQuestion = (index) => {
    setCurrentQuestionIndex(index);
    questionStartTimeRef.current = Date.now();
    setShowReveal(false);
    saveProgress();
  };

  // Record answer selection.
  const selectOption = (selectedIndex) => {
    const timeTaken = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
    const progress = { ...questionProgress[currentQuestionIndex] };
    progress.answer = selectedIndex;
    progress.timeTaken = timeTaken;
    setQuestionProgress({ ...questionProgress, [currentQuestionIndex]: progress });
    saveProgress();
    setShowReveal(true);
  };

  // Reveal the answer.
  const revealAnswer = () => {
    const question = currentExam.questions[currentQuestionIndex];
    const progress = { ...questionProgress[currentQuestionIndex] };
    progress.submitted = true;
    progress.correct = (progress.answer === question.correct_answer);
    if (progress.correct) {
      setScore(prev => prev + 1);
    }
    setQuestionProgress({ ...questionProgress, [currentQuestionIndex]: progress });
    saveProgress();
    updateQuestionProgress(currentQuestionIndex, progress);
  };

  const updateQuestionProgress = (questionIndex, progress) => {
    const questionId = currentExam.questions[questionIndex].id;
    fetch(`${backend}/sessions/${sessionId}/questions/${questionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress)
    })
      .then(response => {
        if (!response.ok) {
          console.error("Failed to update question progress on backend");
        }
      })
      .catch(error => console.error("Error updating question progress: ", error));
  };

  // Toggle flag for a question.
  const toggleFlag = () => {
    const progress = { ...questionProgress[currentQuestionIndex] };
    progress.flagged = !progress.flagged;
    setQuestionProgress({ ...questionProgress, [currentQuestionIndex]: progress });
    saveProgress();
    updateQuestionProgress(currentQuestionIndex, progress);
  };

  // Navigation functions.
  const nextQuestion = () => {
    if (currentExam && currentQuestionIndex < currentExam.questions.length - 1) {
      showQuestion(currentQuestionIndex + 1);
    } else {
      endExam();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      showQuestion(currentQuestionIndex - 1);
    }
  };

  // End exam.
  const endExam = () => {
    clearInterval(timerIntervalRef.current);
    alert(`Exam finished! Score: ${score} / ${currentExam.questions.length}`);
    localStorage.removeItem('questionProgress');
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('timeLeft');
    window.location.reload();
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      {!examStarted && <ExamList startExam={startExam} />}
      {examStarted && currentExam && (
        <ExamContainer
          currentExam={currentExam}
          currentQuestionIndex={currentQuestionIndex}
          questionProgress={questionProgress}
          selectOption={selectOption}
          revealAnswer={revealAnswer}
          toggleFlag={toggleFlag}
          nextQuestion={nextQuestion}
          prevQuestion={prevQuestion}
          showReveal={showReveal}
          formatTime={formatTime}
          timeLeft={timeLeft}
          showQuestion={showQuestion}
        />
      )}
    </Container>
  );
}

export default App;

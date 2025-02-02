import React from 'react';
import { Grid, Paper, Button } from '@mui/material';
import NavPane from './NavPane';
import QuestionContainer from './QuestionContainer';

const ExamContainer = ({
  currentExam,
  currentQuestionIndex,
  questionProgress,
  selectOption,
  revealAnswer,
  toggleFlag,
  nextQuestion,
  prevQuestion,
  showReveal, 
  formatTime,
  timeLeft,
  showQuestion,
}) => {
  const handleRevealAnswer = () => {
    // Call the revealAnswer function passed from the parent component
    revealAnswer();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <Paper sx={{ maxHeight: '80vh', overflowY: 'auto', padding: 1 }}>
          <NavPane
            currentExam={currentExam}
            questionProgress={questionProgress}
            showQuestion={showQuestion}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Paper sx={{ padding: 2 }}>
          <QuestionContainer 
            currentExam={currentExam}
            currentQuestionIndex={currentQuestionIndex}
            questionProgress={questionProgress}
            selectOption={selectOption}
            // Pass the new handleRevealAnswer function to QuestionContainer
            revealAnswer={handleRevealAnswer} 
            toggleFlag={toggleFlag}
            nextQuestion={nextQuestion}
            prevQuestion={prevQuestion}
            showReveal={showReveal} 
            formatTime={formatTime}
            timeLeft={timeLeft}
          />
          {/* Conditionally render the "Reveal Answer" button */}
          {showReveal && ( 
            <Button variant="contained" color="primary" onClick={handleRevealAnswer}>
              Reveal Answer
            </Button>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ExamContainer;

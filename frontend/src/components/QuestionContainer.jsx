import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

const QuestionContainer = ({
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
}) => {
  const currentQuestion = currentExam.questions[currentQuestionIndex];
  const progress = questionProgress[currentQuestionIndex] || {};

  return (
    <Box>
      <Typography variant="subtitle1" align="right">
        Time Left: {formatTime(timeLeft)}
      </Typography>
      
      {/* Display the question number header */}
      <Typography variant="subtitle2" sx={{ color: 'gray', mt: 1 }}>
        Question {currentQuestionIndex + 1} of {currentExam.questions.length}
      </Typography>
      
      <Typography variant="h5" sx={{ marginTop: 1, color: 'black' }}>
        {currentQuestion.text}
      </Typography>
      
      <Stack spacing={2} mt={2}>
        {currentQuestion.options.map((option, i) => {
          let variant = "contained";
          let color = "primary";
          if (progress.submitted) {
            if (i === currentQuestion.correct_answer) {
              color = "success";
            } else if (i === progress.answer) {
              color = "error";
            }
          }
          return (
            <Button 
              key={i}
              variant={variant}
              color={color}
              onClick={() => {
                if (!progress.submitted) {
                  selectOption(i);
                }
              }}
            >
              {option}
            </Button>
          );
        })}
      </Stack>
      
      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="outlined" onClick={toggleFlag}>Flag Question</Button>
        {showReveal && !progress.submitted && (
          <Button variant="contained" onClick={revealAnswer}>Reveal Answer</Button>
        )}
      </Stack>
      
      {progress.submitted && (
        <Box mt={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body1">
            {currentQuestion.explanation}
          </Typography>
        </Box>
      )}
      
      <Stack direction="row" spacing={2} mt={2}>
        {currentQuestionIndex > 0 && (
          <Button variant="outlined" onClick={prevQuestion}>Previous</Button>
        )}
        <Button variant="outlined" onClick={nextQuestion}>Next</Button>
      </Stack>
    </Box>
  );
};

export default QuestionContainer;

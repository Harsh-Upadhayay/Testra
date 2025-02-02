import React from 'react';
import { Grid, Button } from '@mui/material';

const NavPane = ({ currentExam, questionProgress, showQuestion }) => {
  return (
    <Grid container spacing={1}>
      {currentExam.questions.map((_, index) => {
        let bgColor = "";
        const progress = questionProgress[index];
        if (!progress || progress.answer === null) {
          bgColor = "#757575"; // Grey for not attempted
        } else if (progress.submitted) {
          bgColor = progress.correct ? "#388e3c" : "#d32f2f"; // Green or Red
        } else {
          bgColor = "#1976d2"; // Blue for attempted but not submitted
        }
        return (
          <Grid item xs={3} sm={2} md={2} key={index}>
            <Button
              variant="contained"
              onClick={() => showQuestion(index)}
              sx={{
                backgroundColor: bgColor,
                minWidth: 0,
                padding: '4px 8px',
                fontSize: '0.75rem',
                color: 'white',
                borderRadius: 1,
                textTransform: 'none'
              }}
            >
              {index + 1} {progress && progress.flagged ? "🚩" : ""}
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default NavPane;

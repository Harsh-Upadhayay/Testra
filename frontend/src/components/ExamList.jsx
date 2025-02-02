import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';

const ExamList = ({ startExam }) => {
  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ minWidth: 300 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            General Knowledge Exam
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={() => startExam(1)}>Start Exam</Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ExamList;

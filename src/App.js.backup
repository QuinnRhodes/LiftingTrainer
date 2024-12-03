import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  CardActions,
  Rating,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchWorkouts();
  }, []);  // We can safely ignore the exhaustive-deps warning here as fetchWorkouts is stable

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/workouts`);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      showNotification('Error fetching workouts', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/workouts`, {
        exercise,
        difficulty
      });
      setExercise('');
      setDifficulty(3);
      fetchWorkouts();
      showNotification('Workout added successfully!', 'success');
    } catch (error) {
      console.error('Error adding workout:', error);
      showNotification('Error adding workout', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/workouts/${id}`);
      fetchWorkouts();
      showNotification('Workout deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting workout:', error);
      showNotification('Error deleting workout', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Workout Logger
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Exercise"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            margin="normal"
            required
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography component="legend">Difficulty</Typography>
            <Rating
              value={difficulty}
              onChange={(event, newValue) => {
                setDifficulty(newValue);
              }}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Add Workout
          </Button>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom>
          Workout History
        </Typography>
        {workouts.map((workout) => (
          <Card key={workout.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{workout.exercise}</Typography>
              <Rating value={workout.difficulty} readOnly />
              <Typography color="text.secondary">
                {formatDate(workout.date)}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton 
                aria-label="delete"
                onClick={() => handleDelete(workout.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;

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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Snackbar,
  Alert,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    exercise: '',
    customExercise: '',
    weight: '',
    weight_unit: 'lbs',
    reps: '',
    rpe: '',
    tempo: ''
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchWorkouts();
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/exercises`);
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      showNotification('Error fetching exercises', 'error');
    }
  };

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
      const workoutData = {
        exercise: formData.exercise,
        customExercise: formData.customExercise,
        weight: parseFloat(formData.weight),
        weight_unit: formData.weight_unit,
        reps: parseInt(formData.reps),
        rpe: parseFloat(formData.rpe),
        tempo: formData.tempo
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/workouts`, workoutData);
      
      // Reset form
      setFormData({
        exercise: '',
        customExercise: '',
        weight: '',
        weight_unit: 'lbs',
        reps: '',
        rpe: '',
        tempo: ''
      });
      
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" 
                    sx={{ fontFamily: 'Elsie, cursive', color: '#333' }}>
          Workout Logger
        </Typography>

        <Card sx={{ mb: 4, p: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Exercise</InputLabel>
                  <Select
                    name="exercise"
                    value={formData.exercise}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="">Select an exercise</MenuItem>
                    {exercises.map((exercise) => (
                      <MenuItem key={exercise} value={exercise}>
                        {exercise}
                      </MenuItem>
                    ))}
                    <MenuItem value="Custom">Custom Exercise</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {formData.exercise === 'Custom' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Custom Exercise"
                    name="customExercise"
                    value={formData.customExercise}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Weight Unit</InputLabel>
                  <Select
                    name="weight_unit"
                    value={formData.weight_unit}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="lbs">lbs</MenuItem>
                    <MenuItem value="kgs">kgs</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Reps</InputLabel>
                  <Select
                    name="reps"
                    value={formData.reps}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="">Select reps</MenuItem>
                    {[...Array(25)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>RPE</InputLabel>
                  <Select
                    name="rpe"
                    value={formData.rpe}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="">Select RPE</MenuItem>
                    {[...Array(10)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tempo"
                  name="tempo"
                  placeholder="e.g., 3-1-1"
                  value={formData.tempo}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Add Workout
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>

        <Typography variant="h4" component="h2" gutterBottom>
          Workout History
        </Typography>
        
        {workouts.map((workout) => (
          <Card key={workout.id} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">{workout.exercise}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    Weight: {workout.weight} {workout.weight_unit}
                  </Typography>
                  <Typography>Reps: {workout.reps}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>RPE: {workout.rpe}</Typography>
                  <Typography>Tempo: {workout.tempo}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="text.secondary">
                    {formatDate(workout.date)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <IconButton
                onClick={() => handleDelete(workout.id)}
                color="error"
                aria-label="delete"
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
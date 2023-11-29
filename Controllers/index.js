// This file handles API requests and calls Repo.js

const express = require('express');
const Repo = require('../Repository/Repo');
const router = express.Router();

// Route to get exercises
router.get('/get_exercises', async (req, res) => {
    try {
        const repo = new Repo();

        const searchInput = req.query.searchInput; // Retrieve 'searchInput' from query parameters

        const exercises = await repo.getExercises(searchInput);

        res.json(exercises);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to post a workout
router.post('/post_workout', async (req, res) => {
    try {
        const repo = new Repo();

        const post_workout = await repo.postWorkout(req);

        res.status(200).send('Data received successfully');

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get the "previous set"
router.get('/get_previous_set', async (req, res) => {
    try {
        const repo = new Repo();

        const exercise_id = req.query.exercise_id; // get the exercise id of the set 
        const datetime = req.query.current_datetime; // get the date of the exercise 
        const set_number = req.query.set_number; // get the set number

        const prev_set = await repo.getPreviousSet(exercise_id, datetime, set_number);

        res.json(prev_set);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get the workout history 
router.get('/get_workout_history', async (req, res) => {
    try {
        const repo = new Repo();

        const workouts = await repo.getWorkoutHistory();

        res.json(workouts);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

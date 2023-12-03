// This file handles API requests and calls Repo.js

import express, { Request, Response, Router } from 'express';
import Repo from '../Repository/Repo';
import ModelExerciseInList from '../ModelsGET/ModelExerciseInList';

const router: Router = express.Router();

// Route to get exercises
router.get('/get_exercises', async (req: Request, res: Response) => {
    try {
        const repo = new Repo();

        const searchInput: string | undefined = req.query.searchInput as string | undefined; // Retrieve 'searchInput' from query parameters

        const exercises: ModelExerciseInList[] = await repo.getExercises(searchInput);

        res.json(exercises);
    } catch (error) {
        // Type assertion to specify the error type as any
        const errorMessage: string = (error as any).message || 'An error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

// Route to post a workout
router.post('/post_workout', async (req: Request, res: Response) => {
    try {
        const repo = new Repo();

        const post_workout: void = await repo.postWorkout(req);

        res.status(200).send('Data received successfully');

    } catch (error) {
        // Type assertion to specify the error type as any
        const errorMessage: string = (error as any).message || 'An error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

// Route to get the "previous set"
router.get('/get_previous_set', async (req: Request, res: Response) => {
    try {
        const repo = new Repo();

        const exercise_id: number = parseInt(req.query.exercise_id as string); // get the exercise id of the set 
        const set_number: number = parseInt(req.query.set_number as string); // get the set number

        const prev_set = await repo.getPreviousSet(exercise_id, set_number);

        res.json(prev_set);

    } catch (error) {
        // Type assertion to specify the error type as any
        const errorMessage: string = (error as any).message || 'An error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

// Route to get the ALL workout history in detail - only for testing purposes
router.get('/get_all_workout_history_detailed', async (req: Request, res: Response) => {
    try {
        const repo = new Repo();

        const workouts = await repo.getAllWorkoutHistoryDetails();

        res.json(workouts);

    } catch (error) {
        // Type assertion to specify the error type as any
        const errorMessage: string = (error as any).message || 'An error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

// Route to get workout history - no details  
router.get('/get_workout_history_without_details', async (req: Request, res: Response) => {
    try {
        const repo = new Repo();

        const workouts = await repo.getWorkoutHistoryWithoutDetails();

        res.json(workouts);

    } catch (error) {
        // Type assertion to specify the error type as any
        const errorMessage: string = (error as any).message || 'An error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

// Route to get a single workout history with details by a workout id   
router.get('/get_workout_history_by_workoutId', async (req: Request, res: Response) => {
    try {
        const repo = new Repo();

        const workoutId: number = parseInt(req.query.workout_id as string); // get the exercise id of the set 


        const workout = await repo.getWorkoutHistoryByWorkoutId(workoutId);

        res.json(workout);

    } catch (error) {
        // Type assertion to specify the error type as any
        const errorMessage: string = (error as any).message || 'An error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

module.exports = router;

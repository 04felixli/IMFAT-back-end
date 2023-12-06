// This class handles "business" logic and calls Dao.js to handle database related actions

import ModelExerciseInList from "../ModelsGET/ModelExerciseInList";
import ModelCompletedWorkout from "../ModelsPOST/ModelCompletedWorkout";
import ModelPostCompletedWorkout from "../ModelsPOST/ModelPostCompletedWorkout";
import ModelPostedWorkout from "../ModelsPOST/ModelPostedWorkout";
import ModelPostCompletedExercise from "../ModelsPOST/ModelPostCompletedExercise";
import ModelCompletedExercise from "../ModelsPOST/ModelCompletedExercise";
import ModelCompletedSet from "../ModelsPOST/ModelCompletedSet";
import ModelPostedExercise from "../ModelsPOST/ModelPostedExercise";
import ModelPostCompletedSet from "../ModelsPOST/ModelPostCompletedSet";
import ModelPostedSet from "../ModelsPOST/ModelPostedSet";
import ModelPreviousSet from "../ModelsGET/ModelPreviousSet";
import ModelPastExercise from "../ModelsGET/ModelPastExercise";
import Dao from '../Daos/Dao';
import ModelPastWorkout from "../ModelsGET/ModelPastWorkout";

class Repo {

    // Get the list of exercises 
    async getExercises(searchInput: string | undefined): Promise<ModelExerciseInList[]> {
        try {

            const dao = new Dao();

            const exercises: ModelExerciseInList[] = await dao.getExercisesFromDB(searchInput);

            return exercises;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Error fetching exercises: ${errorMessage}`);
        }
    }

    // Get latest set completed given an exercise and set number
    async getPreviousSet(exercise_id: number, set_number: number): Promise<ModelPreviousSet | null> {
        try {

            const dao = new Dao();

            const prev_set: ModelPreviousSet | null = await dao.getPreviousSetFromDB(exercise_id, set_number);

            return prev_set;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Error fetching exercises: ${errorMessage}`);
        }
    }

    // Post a workout
    async postWorkout(req: { body: any }): Promise<void> {
        try {

            const dao = new Dao();

            const completedWorkout: ModelCompletedWorkout = req.body;

            const { name, type, date, duration, exercises } = completedWorkout;

            const workoutToPost = new ModelPostCompletedWorkout(name, type, date, duration);

            const postedWorkout: ModelPostedWorkout = await dao.postWorkoutToDB(workoutToPost);

            const postedWorkoutId: number = postedWorkout.id;

            // const exercisesToPost: ModelPostCompletedExercise[] = [];
            const exerciseSets: ModelCompletedSet[][] = [];
            // const setsCompleted: ModelPostCompletedSet[] = [];

            // We link each exercise completed to a workout id 
            const exercisesToPost: ModelPostCompletedExercise[] = exercises.map((exercise: ModelCompletedExercise) => {
                const { id, notes, sets } = exercise;
                const exerciseToPost = new ModelPostCompletedExercise(id, postedWorkoutId, notes);
                exerciseSets.push(sets);
                return exerciseToPost
            });

            const postedExercises: ModelPostedExercise[] = await dao.postCompletedExercisesToDB(exercisesToPost);

            // we link each set to an exercise completed id from a workout  
            const setsCompleted: ModelPostCompletedSet[] = postedExercises.flatMap((exercise: ModelPostedExercise, index: number) => {
                const sets: ModelCompletedSet[] = exerciseSets[index]; // Get the sets for the current exercise

                const setsToPost: ModelPostCompletedSet[] = sets.map((set: ModelCompletedSet) => {
                    const { weight, reps, weight_unit, set_number } = set;
                    return new ModelPostCompletedSet(weight, reps, weight_unit, set_number, exercise.id);
                });

                return setsToPost;
            });

            const postedSets: ModelPostedSet[] = await dao.postCompletedSetsToDB(setsCompleted);

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Error posting exercises: ${errorMessage}`);
        }
    }

    // Get all workout history in detail 
    async getAllWorkoutHistoryDetails(): Promise<ModelPastWorkout<ModelPastExercise>[]> {
        try {

            const dao = new Dao();

            const workouts: ModelPastWorkout<ModelPastExercise>[] = await dao.getAllWorkoutHistoryDetailsFromDB();

            return workouts;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Error posting exercises: ${errorMessage}`);
        }
    }

    // Get workout history without detail
    async getWorkoutHistoryWithoutDetails(): Promise<ModelPastWorkout<string>[]> {
        try {

            const dao = new Dao();

            const workouts: ModelPastWorkout<string>[] = await dao.getWorkoutHistoryWithoutDetailsFromDB();

            return workouts;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Error posting exercises: ${errorMessage}`);
        }
    }

    // Get a single workout history by workout id
    async getWorkoutHistoryByWorkoutId(workoutId: number): Promise<ModelPastWorkout<ModelPastExercise>> {
        try {

            const dao = new Dao();

            const workout: ModelPastWorkout<ModelPastExercise> = await dao.getWorkoutHistoryByWorkoutIdFromDB(workoutId);

            return workout;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Error posting exercises: ${errorMessage}`);
        }
    }

    // Get a single workout history by workout id
    async getLatestExerciseInfo(exerciseIds: number[]): Promise<ModelPastExercise[]> {
        try {

            const dao = new Dao();

            const workout: ModelPastExercise[] = await dao.getLatestExerciseInfoFromDB(exerciseIds);

            return workout;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Error getting latest exercise info: ${errorMessage}`);
        }
    }


}

export default Repo;

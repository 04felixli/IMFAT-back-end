// This class handles "business" logic and calls Dao.js to handle database related actions

import ModelPOSTExercisesDoneInWorkout from "../ModelsPOST/ModelPOSTExercisesDoneInWorkout";
import ModelExerciseInList from "../ModelsGET/ModelExerciseInList";
import ModelPOSTSet from "../ModelsPOST/ModelPOSTSet";
import ModelCompletedWorkout from "../ModelsPOST/ModelCompletedWorkout";
import ModelPostCompletedWorkout from "../ModelsPOST/ModelPostCompletedWorkout";
import ModelPostedWorkout from "../ModelsPOST/ModelPostedWorkout";
import ModelPostCompletedExercise from "../ModelsPOST/ModelPostCompletedExercise";
import ModelCompletedExercise from "../ModelsPOST/ModelCompletedExercise";
import ModelCompletedSet from "../ModelsPOST/ModelCompletedSet";
import ModelPostedExercise from "../ModelsPOST/ModelPostedExercise";
import ModelPostCompletedSet from "../ModelsPOST/ModelPostCompletedSet";
import ModelPostedSet from "../ModelsPOST/ModelPostedSet";


const Dao = require('../Daos/Dao');
const ModelWorkout = require('../ModelsPOST/ModelWorkout');

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

    // // Get the list of exercises 
    // async getPreviousSet(exercise_id, datetime, set_number) {
    //     try {

    //         const dao = new Dao();

    //         const prev_set = await dao.getPreviousSetFromDB(exercise_id, datetime, set_number);

    //         return prev_set;

    //     } catch (error) {
    //         throw new Error(`Error fetching exercises: ${error.message}`);
    //     }
    // }

    // Post a workout
    async postWorkout(req: { body: any }): Promise<void> {
        try {

            const dao = new Dao();

            const completedWorkout: ModelCompletedWorkout = req.body;

            const { name, type, date, duration, exercises } = completedWorkout;

            const workoutToPost = new ModelPostCompletedWorkout(name, type, date, duration);

            const postedWorkout: ModelPostedWorkout = await dao.postWorkoutToDB(workoutToPost);

            const postedWorkoutId: number = postedWorkout.id;

            const exercisesToPost: ModelPostCompletedExercise[] = [];
            const exerciseSets: ModelCompletedSet[][] = [];
            const setsCompleted: ModelPostCompletedSet[] = [];

            // We link each exercise completed to a workout id 
            exercises.forEach((exercise: ModelCompletedExercise) => {
                const { id, notes, sets } = exercise;
                const exerciseToPost = new ModelPostCompletedExercise(id, postedWorkoutId, notes);
                exercisesToPost.push(exerciseToPost);
                exerciseSets.push(sets);
            });

            const postedExercises: ModelPostedExercise[] = await dao.postCompletedExercisesToDB(exercisesToPost);

            // we link each set to an exercise completed id from a workout  
            postedExercises.forEach((exercise: ModelPostedExercise, index: number) => {
                const sets: ModelCompletedSet[] = exerciseSets[index]; // Get the sets for the current exercise

                sets.forEach((set: ModelCompletedSet) => {
                    const { weight, reps, weight_unit, set_number } = set;
                    const setsToPost = new ModelPostCompletedSet(weight, reps, weight_unit, set_number, exercise.id);
                    setsCompleted.push(setsToPost);
                });
            });

            const postedSets: ModelPostedSet[] = await dao.postCompletedSetsToDB(setsCompleted);

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Error posting exercises: ${errorMessage}`);
        }
    }

    // // Get the list of exercises 
    // async getWorkoutHistory() {
    //     try {

    //         const dao = new Dao();

    //         const workouts = await dao.getWorkoutHistoryFromDB();

    //         return workouts;

    //     } catch (error) {
    //         throw new Error(`Error fetching exercises: ${error.message}`);
    //     }
    // }
}

export default Repo;

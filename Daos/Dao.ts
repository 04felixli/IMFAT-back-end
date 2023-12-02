// This class handles all database interactions

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import ModelExercise from '../ModelsPOST/ModelPOSTExercisesDoneInWorkout';
import ModelPreviousSet from '../ModelsGET/ModelPreviousSet';
import ModelWorkoutHistory from '../ModelsGET/ModelWorkoutHistory';
import ModelExerciseHistory from '../ModelsGET/ModelExerciseHistory';
import ModelSetHistory from '../ModelsGET/ModelSetHistory';
import ModelExerciseInList from '../ModelsGET/ModelExerciseInList';
import ModelPostCompletedWorkout from '../ModelsPOST/ModelPostCompletedWorkout';
import ModelPostedWorkout from '../ModelsPOST/ModelPostedWorkout';
import ModelPostCompletedExercise from '../ModelsPOST/ModelPostCompletedExercise';
import { Database } from '../database.types';
import ModelPostCompletedSet from '../ModelsPOST/ModelPostCompletedSet';
import ModelPostedExercise from '../ModelsPOST/ModelPostedExercise';
require('dotenv').config();

class Dao {
    private supabase: SupabaseClient<Database>;

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        // const supabaseKey = process.env.SUPABASE_KEY;
        const supabaseKey = process.env.SUPABASE_KEY_BYPASS_RLS;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials are missing');
        }

        this.supabase = createClient<Database>(
            supabaseUrl,
            supabaseKey
        );
    }

    // Get a list of exercises from "all_exercises" table 
    async getExercisesFromDB(searchInput: string | undefined): Promise<ModelExerciseInList[]> {
        try {
            let query = this.supabase.from('all_exercises').select('id, name, equipment, target_muscle');

            if (searchInput) {
                // Format search input for full-text search
                const formattedSearch = searchInput.split(' ').join(' & ');
                query = query.textSearch('full_exercise_name', formattedSearch);
            }

            const { data: all_exercises, error } = await query.returns<ModelExerciseInList[]>();

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            return all_exercises;
        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Database error: ${errorMessage}`);
        }
    }

    // Post a workout to "workouts" table
    async postWorkoutToDB(workout: ModelPostCompletedWorkout): Promise<ModelPostedWorkout> {
        try {

            const { type, date, name, duration } = workout;

            const { data, error } = await this.supabase.from('workouts')
                .insert({ workout_name: name, workout_type: type, workout_date: date, duration: duration })
                .select()
                .single()

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            const postedWorkout = new ModelPostedWorkout(data.created_at, data.duration, data.id, data.workout_date, data.workout_name, data.workout_type)

            return postedWorkout;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Database error: ${errorMessage}`);
        }
    }

    // Post completed exercises in workout posted in postWorkoutToDB() to "exercises_done_in_workout" table. 
    async postCompletedExercisesToDB(exercisesToPost: ModelPostCompletedExercise[]): Promise<ModelPostedExercise[]> {
        try {

            const { data, error } = await this.supabase.from('exercises_done_in_workout')
                .insert(exercisesToPost)
                .select()
                .returns<ModelPostedExercise[]>();

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            return data;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Database error: ${errorMessage}`);
        }
    }

    // Post completed sets for exercises posted in postCompletedExercisesToDB() to "sets" table. 
    async postCompletedSetsToDB(sets: ModelPostCompletedSet[]): Promise<ModelPostCompletedSet[]> {
        try {

            const { data, error } = await this.supabase.from('sets')
                .insert(sets)
                .select()
                .returns<ModelPostCompletedSet[]>();

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            return data;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Database error: ${errorMessage}`);
        }
    }

    // // Post completed sets for exercises posted in postCompletedExercisesToDB() to "sets" table. 
    // async getPreviousSetFromDB(exercise_id, datetime, set_number) {
    //     try {

    //         // we get the set with the same set number and exercise id and closest date and return:
    //         //      weight, reps, weight_unit
    //         const { data: sets, error } = await this.supabase
    //             .from('sets')
    //             .select(
    //                 `set_number, 
    //                 reps,
    //                 weight,
    //                 weight_unit,
    //                 exercises_done_in_workout!inner (
    //                     exercise_id
    //                 )`
    //             )
    //             // .lt('created_at', datetime)
    //             .eq('set_number', set_number)
    //             .eq('exercises_done_in_workout.exercise_id', exercise_id)
    //             .order('created_at', { ascending: false })
    //             .limit(1)
    //             .single();

    //         // If we don't find a previous set, return empty array
    //         if (sets === null) {
    //             return [];
    //         }

    //         if (error) {
    //             throw new Error(`Database error: ${error.message}`);
    //         }

    //         const { weight, reps, weight_unit } = sets;

    //         const prev_set = new ModelPreviousSet(weight, reps, weight_unit)

    //         return prev_set;

    //     } catch (error) {
    //         throw new Error(`Database error: ${error.message}`);
    //     }
    // }

    // // Get all past workouts 
    // async getWorkoutHistoryFromDB() {
    //     try {

    //         const { data, error } = await this.supabase
    //             .from('workouts')
    //             .select(
    //                 `workout_type, 
    //                 workout_date,
    //                 duration,
    //                 workout_name,
    //                 exercises_done_in_workout!inner (exercise_info : all_exercises!inner (name, equipment), notes, sets(weight, reps, weight_unit, set_number)
    //                 )`
    //             ).order('workout_date', { ascending: false });

    //         // If we don't find any past workouts, return the empty array
    //         if (data.length === 0) {
    //             return data;
    //         }

    //         if (error) {
    //             throw new Error(`Database error: ${error.message}`);
    //         }

    //         const workoutHistoryArray = []; // Array of ModelWorkoutHistory objects

    //         data.forEach(past_workout => {
    //             const { workout_type, workout_date, duration, workout_name, exercises_done_in_workout } = past_workout;

    //             const exerciseArray = []; // Array of ModelExerciseHistory objects

    //             exercises_done_in_workout.forEach(exercise => {
    //                 const { notes, exercise_info, sets } = exercise;
    //                 const { name, equipment } = exercise_info;

    //                 const setArray = []; // Array of ModelSetHistory objects

    //                 sets.forEach(set => {
    //                     const { weight, reps, weight_unit, set_number } = set;

    //                     const modelSet = new ModelSetHistory(weight, reps, weight_unit, set_number);
    //                     setArray.push(modelSet);
    //                 })

    //                 const modelExercise = new ModelExerciseHistory(name, equipment, notes, setArray);
    //                 exerciseArray.push(modelExercise);
    //             })

    //             const modelWorkout = new ModelWorkoutHistory(workout_type, workout_date, duration, workout_name, exerciseArray);
    //             workoutHistoryArray.push(modelWorkout);
    //         })

    //         return workoutHistoryArray;

    //     } catch (error) {
    //         throw new Error(`Database error: ${error.message}`);
    //     }
    // }

    // Other database interaction methods...
}

module.exports = Dao;
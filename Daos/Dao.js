// This class handles all database interactions

const { createClient } = require('@supabase/supabase-js');
const ModelExercise = require('../ModelsPOST/ModelExercise');
const ModelPreviousSet = require('../ModelsGET/ModelPreviousSet');
const ModelWorkoutHistory = require('../ModelsGET/ModelWorkoutHistory');
const ModelExerciseHistory = require('../ModelsGET/ModelExerciseHistory');
const ModelSetHistory = require('../ModelsGET/ModelSetHistory');
require('dotenv').config();

class Dao {
    constructor() {

        const supabaseUrl = process.env.SUPABASE_URL;
        // const supabaseKey = process.env.SUPABASE_KEY;
        const supabaseKey = process.env.SUPABASE_KEY_BYPASS_RLS;
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    // Get a list of exercises from "all_exercises" table 
    async getExercisesFromDB(searchInput) {
        try {
            let query = this.supabase.from('all_exercises').select('id, name, equipment, target_muscle');

            console.log("This is the search input: ", searchInput);

            if (searchInput) {
                // Format search input for full-text search
                const formattedSearch = searchInput.split(' ').join(' & ');
                query = query.textSearch('full_exercise_name', formattedSearch);
            }

            const { data: all_exercises, error } = await query;

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            return all_exercises;
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    // Post a workout to "workouts" table
    async postWorkoutToDB(workout) {
        try {

            const { type, date, name, duration } = workout;

            const { data, error } = await this.supabase.from('workouts')
                .insert({ workout_name: name, workout_type: type, workout_date: date, duration: duration })
                .select()

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            return data;

        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    // Post completed exercises in workout posted in postWorkoutToDB() to "exercises_done_in_workout" table. 
    async postCompletedExercisesToDB(exercises) {
        try {

            const { data, error } = await this.supabase.from('exercises_done_in_workout')
                .insert(exercises)
                .select()

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            return data;

        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    // Post completed sets for exercises posted in postCompletedExercisesToDB() to "sets" table. 
    async postCompletedSetsToDB(sets) {
        try {

            const { data, error } = await this.supabase.from('sets')
                .insert(sets)
                .select()

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            return data;

        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    // Post completed sets for exercises posted in postCompletedExercisesToDB() to "sets" table. 
    async getPreviousSetFromDB(exercise_id, datetime, set_number) {
        try {

            // we get the set with the same set number and exercise id and closest date and return:
            //      weight, reps, weight_unit
            const { data: sets, error } = await this.supabase
                .from('sets')
                .select(
                    `set_number, 
                    reps,
                    weight,
                    weight_unit,
                    exercises_done_in_workout!inner (
                        exercise_id
                    )`
                )
                // .lt('created_at', datetime)
                .eq('set_number', set_number)
                .eq('exercises_done_in_workout.exercise_id', exercise_id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            // If we don't find a previous set, return empty array
            if (sets === null) {
                return [];
            }

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            const { weight, reps, weight_unit } = sets;

            const prev_set = new ModelPreviousSet(weight, reps, weight_unit)

            return prev_set;

        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    // Get all past workouts 
    async getWorkoutHistoryFromDB() {
        try {

            const { data, error } = await this.supabase
                .from('workouts')
                .select(
                    `workout_type, 
                    workout_date,
                    duration,
                    workout_name,
                    exercises_done_in_workout!inner (exercise_info : all_exercises!inner (name, equipment), notes, sets(weight, reps, weight_unit, set_number)
                    )`
                ).order('workout_date', { ascending: false });

            // If we don't find any past workouts, return the empty array
            if (data.length === 0) {
                return data;
            }

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            const workoutHistoryArray = []; // Array of ModelWorkoutHistory objects

            data.forEach(past_workout => {
                const { workout_type, workout_date, duration, workout_name, exercises_done_in_workout } = past_workout;

                const exerciseArray = []; // Array of ModelExerciseHistory objects

                exercises_done_in_workout.forEach(exercise => {
                    const { notes, exercise_info, sets } = exercise;
                    const { name, equipment } = exercise_info;

                    const setArray = []; // Array of ModelSetHistory objects

                    sets.forEach(set => {
                        const { weight, reps, weight_unit, set_number } = set;

                        const modelSet = new ModelSetHistory(weight, reps, weight_unit, set_number);
                        setArray.push(modelSet);
                    })

                    const modelExercise = new ModelExerciseHistory(name, equipment, notes, setArray);
                    exerciseArray.push(modelExercise);
                })

                const modelWorkout = new ModelWorkoutHistory(workout_type, workout_date, duration, workout_name, exerciseArray);
                workoutHistoryArray.push(modelWorkout);
            })

            return workoutHistoryArray;

        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    // Other database interaction methods...
}

module.exports = Dao;
// This class handles all database interactions

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import ModelPreviousSet from '../ModelsGET/ModelPreviousSet';
import ModelExerciseInList from '../ModelsGET/ModelExerciseInList';
import ModelPostCompletedWorkout from '../ModelsPOST/ModelPostCompletedWorkout';
import ModelPostedWorkout from '../ModelsPOST/ModelPostedWorkout';
import ModelPostCompletedExercise from '../ModelsPOST/ModelPostCompletedExercise';
import { Database } from '../database.types';
import ModelPostCompletedSet from '../ModelsPOST/ModelPostCompletedSet';
import ModelPostedExercise from '../ModelsPOST/ModelPostedExercise';
import ModelPostedSet from '../ModelsPOST/ModelPostedSet';
import ModelPastExercise from '../ModelsGET/ModelPastExercise';
import ModelPastSet from '../ModelsGET/ModelPastSet';
import ModelPastWorkout from '../ModelsGET/ModelPastWorkout';
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
    async postCompletedSetsToDB(sets: ModelPostCompletedSet[]): Promise<ModelPostedSet[]> {
        try {

            const { data, error } = await this.supabase.from('sets')
                .insert(sets)
                .select()
                .returns<ModelPostedSet[]>();

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            return data;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Database error: ${errorMessage}`);
        }
    }

    // Get previous sets for exercises  
    async getPreviousSetFromDB(exercise_id: number, set_number: number): Promise<ModelPreviousSet | null> {
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
                .limit(1);

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            if (sets.length === 0) {
                return null;
            }

            const { weight, reps, weight_unit } = sets[0];

            const prev_set = new ModelPreviousSet(weight, reps, weight_unit)

            return prev_set;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Database error: ${errorMessage}`);
        }
    }

    // Get all past workouts 
    async getAllWorkoutHistoryDetailsFromDB(): Promise<ModelPastWorkout<ModelPastExercise>[]> {
        try {

            const { data, error } = await this.supabase
                .from('workouts')
                .select(
                    `
                    *,
                    exercises_done_in_workout!inner (*, exercise_info : all_exercises!inner (*), sets!inner(*)
                    )`
                ).order('id', { ascending: false })
                .returns<ModelPastWorkout<ModelPastExercise>[]>();

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            // If we don't find any past workouts, return the empty array
            if (data.length === 0) {
                return data;
            }

            return data;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Database error: ${errorMessage}`);
        }
    }

    // Get all past workouts without details
    async getWorkoutHistoryWithoutDetailsFromDB(): Promise<ModelPastWorkout<string>[]> {
        try {
            const { data, error } = await this.supabase
                .from('workouts')
                .select(
                    `
                    id,
                    workout_type, 
                    workout_date,
                    duration, 
                    workout_name,
                    exercises_done_in_workout!inner (exercise_info : all_exercises!inner (name))`
                ).order('id', { ascending: false })

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            const pastWorkouts: ModelPastWorkout<string>[] = data?.map(workout => {
                const { id, workout_type, workout_date, workout_name, duration, exercises_done_in_workout } = workout;

                // Map exercises for each workout to get an array of exercise names
                const exercises: string[] = exercises_done_in_workout.map(exercise => exercise?.exercise_info?.name || '');

                // Create a new ModelPastWorkout instance with exercise names as strings
                const pastWorkout: ModelPastWorkout<string> = new ModelPastWorkout<string>(
                    id,
                    workout_type,
                    workout_date,
                    workout_name,
                    duration,
                    exercises
                );

                return pastWorkout;
            });

            // If we don't find any past workouts, return the empty array
            if (data.length === 0) {
                return [];
            }

            return pastWorkouts;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Database error: ${errorMessage}`);
        }
    }

    // Get a workout by workout id with details
    async getWorkoutHistoryByWorkoutIdFromDB(workoutId: number): Promise<ModelPastWorkout<ModelPastExercise>> {
        try {
            const { data, error } = await this.supabase
                .from('workouts')
                .select(
                    `
                    id, 
                    workout_type, 
                    workout_date,
                    duration, 
                    workout_name,
                    exercises_done_in_workout!inner (exercise_info : all_exercises!inner (id, name, equipment), notes, sets(weight, reps, weight_unit, set_number)
                    )`
                ).eq('id', workoutId)
                .single()

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            const exercises: ModelPastExercise[] = data.exercises_done_in_workout.map(exercise => {
                const { exercise_info, notes, sets } = exercise;

                const { id, name, equipment } = exercise_info || { id: 0, name: '', equipment: '' };

                const mappedSets: ModelPastSet[] = sets.map(set => {
                    const { weight, reps, weight_unit, set_number } = set;
                    const pastSet = new ModelPastSet(weight, reps, weight_unit, set_number);
                    return pastSet;
                });

                // Creating a new ModelPastExercise instance with the extracted data
                const pastExercise = new ModelPastExercise(id, name, equipment, notes || null, mappedSets);

                return pastExercise;
            });

            const { id, workout_type: type, workout_date: date, duration, workout_name: name } = data;

            const pastWorkout: ModelPastWorkout<ModelPastExercise> = new ModelPastWorkout<ModelPastExercise>(id, type, date, name, duration, exercises)

            return pastWorkout;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Database error: ${errorMessage}`);
        }
    }

    // Get latest exercise information from DB
    // The way I did this is hella stupid...need to optimize later 
    async getLatestExerciseInfoFromDB(exerciseIds: number[]): Promise<ModelPastExercise[]> {
        try {
            const exercisesPromises: Promise<ModelPastExercise[]>[] = exerciseIds.map(async id => {
                const { data, error } = await this.supabase
                    .from('exercises_done_in_workout')
                    .select(
                        `
                        id, 
                        exercise_id,
                        exercise_info: all_exercises!inner(id, name, equipment),
                        sets!inner(set_number, reps, weight, weight_unit)
                        `
                    )
                    .eq('exercise_id', id)
                    .order('id', { ascending: false })
                    .limit(1);

                if (error) {
                    throw new Error(`Database error: ${error.message}`);
                }

                if (data.length === 0) {
                    const { data, error } = await this.supabase
                        .from('all_exercises')
                        .select(
                            `
                            id, 
                            name,
                            equipment
                            `
                        )
                        .eq('id', id)
                        .single();

                    if (error) {
                        throw new Error(`Database error: ${error.message}`);
                    }

                    const { name, equipment } = data || { name: '', equipment: '' };

                    const emptySet: ModelPastSet[] = [new ModelPastSet(-1, -1, 'lbs', 1)]; // dummy set 

                    const exerciseNeverDone: ModelPastExercise[] = [new ModelPastExercise(id, name, equipment, null, emptySet)];

                    return exerciseNeverDone;

                } else {
                    const pastExercises: ModelPastExercise[] = data.map(exercise => {
                        const { exercise_id, exercise_info, sets } = exercise;
                        const { name, equipment } = exercise_info || { name: '', equipment: '' };

                        const mappedSets: ModelPastSet[] = sets.map(set => {
                            const { weight, reps, weight_unit, set_number } = set;
                            return new ModelPastSet(weight, reps, weight_unit, set_number);
                        });

                        // Creating a new ModelPastExercise instance with the extracted data
                        return new ModelPastExercise(id, name, equipment, null, mappedSets);
                    });

                    return pastExercises;
                }
            });

            // Wait for all the promises to resolve
            const exercisesResults: ModelPastExercise[][] = await Promise.all(exercisesPromises);

            // Flatten the array of arrays into a single array
            const allExercises: ModelPastExercise[] = exercisesResults.flat();

            return allExercises;

        } catch (error) {
            const errorMessage: string = (error as any).message || 'An error occurred';
            throw new Error(`Database error: ${errorMessage}`);
        }
    }



    // Other database interaction methods...
}

export default Dao;
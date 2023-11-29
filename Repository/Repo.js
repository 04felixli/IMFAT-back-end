// This class handles "business" logic and calls Dao.js to handle database related actions

const Dao = require('../Daos/Dao');
const ModelSet = require('../ModelsPOST/ModelSet');
const ModelExercise = require('../ModelsPOST/ModelExercise');
const ModelWorkout = require('../ModelsPOST/ModelWorkout');

class Repo {

    // Get the list of exercises 
    async getExercises(searchInput) {
        try {

            const dao = new Dao();

            const exercises = await dao.getExercisesFromDB(searchInput);

            return exercises;

        } catch (error) {
            throw new Error(`Error fetching exercises: ${error.message}`);
        }
    }

    // Get the list of exercises 
    async getPreviousSet(exercise_id, datetime, set_number) {
        try {

            const dao = new Dao();

            const prev_set = await dao.getPreviousSetFromDB(exercise_id, datetime, set_number);

            return prev_set;

        } catch (error) {
            throw new Error(`Error fetching exercises: ${error.message}`);
        }
    }

    // Post a workout
    async postWorkout(req) {
        try {

            const dao = new Dao();

            const { type, date, name, duration, exercises } = req.body;

            const workout = new ModelWorkout(type, date, name, duration);

            const postedWorkout = await dao.postWorkoutToDB(workout);

            const postedWorkoutId = postedWorkout[0].id;

            const exercisesCompletedList = []; // holds an array of ModelExercise objects 
            const exerciseSets = []; // holds an array of arrays of sets
            // Each array of sets corresponds to a ModelExercise Object in "exercisesCompletedList"
            const setsCompleted = []; // holds an array of ModelSet objects

            // We link each exercise completed to a workout id 
            exercises.forEach(exercise => {
                const { id, notes, sets } = exercise;
                const modelExercise = new ModelExercise(id, postedWorkoutId, notes);
                exercisesCompletedList.push(modelExercise);
                exerciseSets.push(sets);
            });

            const postedExercises = await dao.postCompletedExercisesToDB(exercisesCompletedList);

            // we link each set to an exercise completed id from a workout  
            postedExercises.forEach((exercise, index) => {
                const sets = exerciseSets[index]; // Get the sets for the current exercise

                sets.forEach(set => {
                    const { weight, reps, weight_unit, set_number } = set;
                    const modelSet = new ModelSet(weight, reps, weight_unit, set_number, exercise.id);
                    setsCompleted.push(modelSet);
                });
            });

            console.log("postedExercises is: ", postedExercises);
            console.log("exerciseSets is: ", exerciseSets);
            console.log("setsCompleted is: ", setsCompleted);

            const postedSets = await dao.postCompletedSetsToDB(setsCompleted);

        } catch (error) {
            throw new Error(`Error posting workout: ${error.message}`);
        }
    }

    // Get the list of exercises 
    async getWorkoutHistory() {
        try {

            const dao = new Dao();

            const workouts = await dao.getWorkoutHistoryFromDB();

            return workouts;

        } catch (error) {
            throw new Error(`Error fetching exercises: ${error.message}`);
        }
    }
}

module.exports = Repo;

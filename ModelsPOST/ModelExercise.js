// This model defines the class for exercise objects 

class ModelExercise {

    constructor(exercise_id, workout_id, notes) {
        this.exercise_id = exercise_id; // id of exercise 
        this.workout_id = workout_id; // links exercise to workout from "workouts" table
        this.notes = notes;
    }

}

module.exports = ModelExercise;
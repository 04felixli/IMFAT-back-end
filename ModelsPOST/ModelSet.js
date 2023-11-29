// this is model defines a class for set objects 

class ModelSet {

    constructor(weight, reps, weight_unit, set_number, exercise_in_workout_id) {
        this.weight = weight;
        this.reps = reps;
        this.weight_unit = weight_unit;
        this.set_number = set_number;
        this.exercise_in_workout_id = exercise_in_workout_id; // links set to exercise from "exercises_done_in_workout" table
    }

}

module.exports = ModelSet;
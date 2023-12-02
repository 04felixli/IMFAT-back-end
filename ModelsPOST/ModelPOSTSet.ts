// this is model defines a class for set objects 

class ModelPOSTSet {
    weight: number;
    reps: number;
    weight_unit: string;
    set_number: number;
    exercise_in_workout_id: number;

    constructor(
        weight: number,
        reps: number,
        weight_unit: string,
        set_number: number,
        exercise_in_workout_id: number
    ) {
        this.weight = weight;
        this.reps = reps;
        this.weight_unit = weight_unit;
        this.set_number = set_number;
        this.exercise_in_workout_id = exercise_in_workout_id;
    }
}

export default ModelPOSTSet;

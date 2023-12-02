// Structure of a posted set row returned from inserting a row to "sets" table

class ModelPostedSet {
    created_at: string;
    exercise_in_workout_id: number;
    id: number;
    reps: number;
    set_number: number;
    weight: number;
    weight_unit: string;

    constructor(
        created_at: string,
        exercise_in_workout_id: number,
        id: number,
        reps: number,
        set_number: number,
        weight: number,
        weight_unit: string
    ) {
        this.created_at = created_at;
        this.exercise_in_workout_id = exercise_in_workout_id;
        this.id = id;
        this.reps = reps;
        this.set_number = set_number;
        this.weight = weight;
        this.weight_unit = weight_unit;
    }
}

export default ModelPostedSet;

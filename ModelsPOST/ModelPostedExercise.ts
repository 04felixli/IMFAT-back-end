// Structure of a posted exercise row returned from "exercises_done_in_workout" table

class ModelPostedExercise {
    id: number;
    created_at: string;
    exercise_id: number;
    workout_id: number;
    notes: string | null;

    constructor(exercise_id: number, workout_id: number, notes: string | null, id: number, created_at: string) {
        this.id = id;
        this.created_at = created_at;
        this.exercise_id = exercise_id;
        this.workout_id = workout_id;
        this.notes = notes;
    }
}

export default ModelPostedExercise; 
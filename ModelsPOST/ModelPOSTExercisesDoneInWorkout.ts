// This model defines the structure to post to exercises_done_in_workout table

class ModelPOSTExercisesDoneInWorkout {
    exercise_id: number;
    workout_id: number;
    notes: string | null;

    constructor(exercise_id: number, workout_id: number, notes: string | null) {
        this.exercise_id = exercise_id;
        this.workout_id = workout_id;
        this.notes = notes;
    }
}

export default ModelPOSTExercisesDoneInWorkout;
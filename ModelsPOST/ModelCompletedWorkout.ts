// Structure of completed workout
import ModelCompletedExercise from "./ModelCompletedExercise";

class ModelCompletedWorkout {
    type: string;
    date: string;
    name: string;
    duration: number;
    exercises: ModelCompletedExercise[];

    constructor(type: string, date: string, name: string, duration: number, exercises: ModelCompletedExercise[]) {
        this.type = type;
        this.date = date;
        this.name = name;
        this.duration = duration;
        this.exercises = exercises
    }
}

export default ModelCompletedWorkout;

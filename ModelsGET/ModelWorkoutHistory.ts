// This class defines the model for workout history objects 
import ModelExerciseHistory from "./ModelExerciseHistory";

class ModelWorkoutHistory {
    type: string;
    datetime: string;
    duration: number;
    name: string;
    exercises: ModelExerciseHistory[];

    constructor(
        type: string,
        datetime: string,
        duration: number,
        name: string,
        exercises: ModelExerciseHistory[]
    ) {
        this.type = type;
        this.datetime = datetime;
        this.duration = duration;
        this.name = name;
        this.exercises = exercises;
    }
}

export default ModelWorkoutHistory;

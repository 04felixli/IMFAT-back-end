// Structure of past exercise done in workout for workout history page
import ModelPastSet from "./ModelPastSet";

class ModelPastExercise {
    exercise_id: number;
    name: string;
    equipment: string;
    notes: string | null;
    sets: ModelPastSet[];

    constructor(
        exercise_id: number,
        name: string,
        equipment: string,
        notes: string | null,
        sets: ModelPastSet[]
    ) {
        this.exercise_id = exercise_id;
        this.name = name;
        this.equipment = equipment;
        this.notes = notes;
        this.sets = sets;
    }
}

export default ModelPastExercise;


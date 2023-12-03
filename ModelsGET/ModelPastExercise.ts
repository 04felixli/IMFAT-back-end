// Structure of past exercise done in workout 
import ModelPastSet from "./ModelPastSet";

class ModelPastExercise {
    exercise_info: {
        name: string;
        equipment: string;
    };
    notes: string | null;
    sets: ModelPastSet[];

    constructor(
        name: string,
        equipment: string,
        notes: string | null,
        sets: ModelPastSet[]
    ) {
        this.exercise_info = {
            name: name,
            equipment: equipment
        };
        this.notes = notes;
        this.sets = sets;
    }
}

export default ModelPastExercise;


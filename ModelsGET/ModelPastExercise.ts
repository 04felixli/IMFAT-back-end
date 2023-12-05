// Structure of past exercise done in workout for workout history page
import ModelPastSet from "./ModelPastSet";

class ModelPastExercise {
    name: string;
    equipment: string;
    notes: string | null;
    sets: ModelPastSet[];

    constructor(
        name: string,
        equipment: string,
        notes: string | null,
        sets: ModelPastSet[]
    ) {
        this.name = name;
        this.equipment = equipment;
        this.notes = notes;
        this.sets = sets;
    }
}

export default ModelPastExercise;


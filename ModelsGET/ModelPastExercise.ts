// Structure of past exercise done in workout for workout history page
import ModelPastSet from "./ModelPastSet";

class ModelPastExercise {
    id: number;
    name: string;
    equipment: string;
    notes: string | null;
    sets: ModelPastSet[];

    constructor(
        id: number,
        name: string,
        equipment: string,
        notes: string | null,
        sets: ModelPastSet[]
    ) {
        this.id = id;
        this.name = name;
        this.equipment = equipment;
        this.notes = notes;
        this.sets = sets;
    }
}

export default ModelPastExercise;


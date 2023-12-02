// This class defines the model for exercise objects within ModelWorkoutHistory 
import ModelPreviousSet from "./ModelPreviousSet";

class ModelExerciseHistory {
    name: string;
    equipment: string;
    notes: string;
    sets: ModelPreviousSet[];

    constructor(name: string, equipment: string, notes: string, sets: ModelPreviousSet[]) {
        this.name = name;
        this.equipment = equipment;
        this.notes = notes;
        this.sets = sets;
    }
}

export default ModelExerciseHistory;



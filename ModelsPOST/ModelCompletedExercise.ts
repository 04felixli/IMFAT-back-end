// Structure of completed exercise done in workout 

import ModelCompletedSet from "./ModelCompletedSet";

class ModelCompletedExercise {
    id: number;
    name: string;
    equipment: string;
    target_muscle: string;
    notes: string | null;
    sets: ModelCompletedSet[];

    constructor(id: number, name: string, equipment: string, target_muscle: string, notes: string | null, sets: ModelCompletedSet[]) {
        this.id = id;
        this.name = name;
        this.equipment = equipment;
        this.target_muscle = target_muscle;
        this.notes = notes;
        this.sets = sets;
    }
}

export default ModelCompletedExercise; 

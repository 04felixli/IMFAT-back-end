// This model defines the structure of each exercise within the list of exercises user can select from

class ModelExerciseInList {
    id: number;
    name: string;
    equipment: string;
    target_muscle: string;

    constructor(
        id: number,
        name: string,
        equipment: string,
        target_muscle: string
    ) {
        this.id = id;
        this.name = name;
        this.equipment = equipment;
        this.target_muscle = target_muscle;
    }
}

export default ModelExerciseInList;

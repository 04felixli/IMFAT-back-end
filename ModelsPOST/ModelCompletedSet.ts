// Structure of completed set done in exercise 

class ModelCompletedSet {
    weight: number;
    reps: number;
    weight_unit: string;
    set_number: number;

    constructor(
        weight: number,
        reps: number,
        weight_unit: string,
        set_number: number,
    ) {
        this.weight = weight;
        this.reps = reps;
        this.weight_unit = weight_unit;
        this.set_number = set_number;
    }
}

export default ModelCompletedSet; 
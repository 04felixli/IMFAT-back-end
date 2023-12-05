// Structure of past set done in exercise for workout history page

class ModelPastSet {
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

export default ModelPastSet; 
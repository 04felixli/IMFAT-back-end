// this is model defines a class for previous set objects to return to the API

class ModelPreviousSet {
    weight: number;
    reps: number;
    weight_unit: string;

    constructor(weight: number, reps: number, weight_unit: string) {
        this.weight = weight;
        this.reps = reps;
        this.weight_unit = weight_unit;
    }
}

export default ModelPreviousSet;

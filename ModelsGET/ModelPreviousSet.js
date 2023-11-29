// this is model defines a class for previous set objects to return to the API

class ModelPreviousSet {

    constructor(weight, reps, weight_unit) {
        this.weight = weight;
        this.reps = reps;
        this.weight_unit = weight_unit;
    }

}

module.exports = ModelPreviousSet;
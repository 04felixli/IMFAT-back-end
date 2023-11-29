// This class defines the model for set history objects inside of ModelExerciseHistory

class ModelSetHistory {

    constructor(weight, reps, weight_unit, set_number) {
        this.weight = weight;
        this.reps = reps;
        this.weight_unit = weight_unit;
        this.set_number = set_number;
    }

}

module.exports = ModelSetHistory;
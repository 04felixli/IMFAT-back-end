// This class defines the model for exercise objects within ModelWorkoutHistory 

class ModelExerciseHistory {

    constructor(name, equipment, notes, sets) {
        this.equipment = equipment,
            this.notes = notes,
            this.name = name,
            this.sets = sets // Array of ModelPreviousSet objects
    }

}

module.exports = ModelExerciseHistory;



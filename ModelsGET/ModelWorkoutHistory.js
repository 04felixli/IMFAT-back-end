// This class defines the model for workout history objects 

class ModelWorkoutHistory {

    constructor(type, datetime, duration, name, exercises) {
        this.type = type,
            this.datetime = datetime,
            this.duration = duration,
            this.name = name,
            this.exercises = exercises // Array of ModelExerciseHistory objects
    }

}

module.exports = ModelWorkoutHistory;
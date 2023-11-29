// This model defines a class for workout objects

class ModelWorkout {

    constructor(type, date, name, duration) {
        this.type = type;
        this.date = date;
        this.name = name;
        this.duration = duration;
    }

}

module.exports = ModelWorkout;
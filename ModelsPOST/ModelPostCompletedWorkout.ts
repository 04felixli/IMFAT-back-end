// Structure to insert a completed workout to "workouts" table

class ModelPostCompletedWorkout {
    name: string;
    type: string;
    date: string;
    duration: number;

    constructor(
        name: string,
        type: string,
        date: string,
        duration: number
    ) {
        this.name = name;
        this.type = type;
        this.date = date;
        this.duration = duration;
    }
}

export default ModelPostCompletedWorkout; 

// Structure of a posted workout row returned from db

class ModelPostedWorkout {
    created_at: string;
    duration: number;
    id: number;
    workout_date: string;
    workout_name: string;
    workout_type: string;

    constructor(
        created_at: string,
        duration: number,
        id: number,
        workout_date: string,
        workout_name: string,
        workout_type: string
    ) {
        this.created_at = created_at;
        this.duration = duration;
        this.id = id;
        this.workout_date = workout_date;
        this.workout_name = workout_name;
        this.workout_type = workout_type;
    }
}

export default ModelPostedWorkout; 

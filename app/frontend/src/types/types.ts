export interface AuthState {
    token: string | null;
    role: string | null;
}

export interface PreferencesState {
    isDarkMode: boolean
}
  
export interface RootState {
    auth: AuthState;
    preferences: PreferencesState
}

/* 
    User Types
*/

export interface UserProgramWorkout {
    id: number;
    programId: number;
    date: string;
    day: number;
    week: number;
    comment: string;
    name: string;
    warmup: string;
    completed: boolean;
    updated: boolean;
    order: number;
    exercises: UserProgramWorkoutExercise[]
    comments: WorkoutComment[]
}

export interface WorkoutComment {
    id: number;
    content: string;
    timestamp: Date,
    user_type: string;
}

export interface UserProgramWorkoutExercise {
    id: number;
    exerciseId: number;
    order?: string;
    instructions?: string;
    sets?: number;
    reps?: number;
    weight?: number;
    duration?: string;
    hold?: string;
    completed: boolean;
    results: string;
    name: string;
}

export interface UserProgram {
    id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    start_date: string;
    end_date: string;
    num_weeks: number;
    name: string;
    user_program_workouts: UserProgramWorkout[];
}

export interface UserOutcomeMeasureRecording {
    id: number;
    user_outcome_measure_id: number;
    value: string;
    date: string;
}

export interface UserOutcomeMeasure {
    id: number;
    outcome_measure_id: number;
    user_id: number;
    target_value: string;
    user_outcome_measure_recordings: UserOutcomeMeasureRecording[];
}

// Main User interface

export interface User {
    id: number;
    coach_id: number;
    first_name: string;
    last_name: string;
    birth_date: string;
    email: string;
    phone: string;
    active: boolean;
    profile_picture_url?: string;
    user_programs: UserProgram[];
    user_outcome_measures: UserOutcomeMeasure[];
}

export interface TodayWorkout {
    user_id: User["id"],
    first_name: User["first_name"],
    last_name: User["last_name"],
    workout_id: UserProgramWorkout["id"],
    workout_name: UserProgramWorkout["name"],
    workout_date: UserProgramWorkout["date"],
    completed: UserProgramWorkout["completed"]
}

export interface UpdatedWorkout {
    user_id: User["id"],
    first_name: User["first_name"],
    last_name: User["last_name"],
    workout: UserProgramWorkout
}
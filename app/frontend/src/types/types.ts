export interface AuthState {
  token: string | null;
  role: string | null;
}

export interface PreferencesState {
  isDarkMode: boolean;
}

export interface RootState {
  auth: AuthState;
  preferences: PreferencesState;
}

/* 
    Client Types
*/

export interface ClientProgramWorkout {
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
  exercises: ClientProgramWorkoutExercise[];
  comments: WorkoutComment[];
}

export interface WorkoutComment {
  id: number;
  content: string;
  timestamp: Date;
  user_type: string;
}

export interface ClientProgramWorkoutExercise {
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

export interface ClientProgram {
  id: number;
  client_id: number;
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string;
  num_weeks: number;
  name: string;
  client_program_workouts: ClientProgramWorkout[];
}

export interface CoachProgram {
  id: number;
  coach_id: number;
  num_weeks: number;
  name: string;
  created_at: string;
  updated_at: string;
  description?: string;
}

export interface ClientOutcomeMeasureRecording {
  id: number;
  client_outcome_measure_id: number;
  value: string;
  date: string;
}

export interface ClientOutcomeMeasure {
  id: number;
  outcome_measure_id: number;
  client_id: number;
  target_value: string;
  client_outcome_measure_recordings: ClientOutcomeMeasureRecording[];
}

// Main Client interface

export interface Client {
  id: number;
  coach_id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  phone: string;
  active: boolean;
  profile_picture_url?: string;
  client_programs: ClientProgram[];
  client_outcome_measures: ClientOutcomeMeasure[];
}

export interface TodayWorkout {
  client_id: Client['id'];
  first_name: Client['first_name'];
  last_name: Client['last_name'];
  workout_id: ClientProgramWorkout['id'];
  workout_name: ClientProgramWorkout['name'];
  workout_date: ClientProgramWorkout['date'];
  completed: ClientProgramWorkout['completed'];
}

export interface UpdatedWorkout {
  client_id: Client['id'];
  first_name: Client['first_name'];
  last_name: Client['last_name'];
  workout: ClientProgramWorkout;
}

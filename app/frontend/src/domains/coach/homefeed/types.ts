import { Role } from '../../shared/auth/types';

type BaseCommentPathParams = {
  clientId: number;
  programId: number;
  workoutId: number;
};

export type AddCommentDTO = BaseCommentPathParams & {
  content: string;
  timestamp: string;
  user_type: Role;
};

export type UpdateCommentDTO = BaseCommentPathParams & {
  commentId: number;
  timestamp: string;
  content: string;
  user_type: Role;
};

export type DeleteCommentDTO = BaseCommentPathParams & {
  commentId: number;
};


export interface WorkoutComment {
  id: number;
  content: string;
  timestamp: Date;
  user_type: 'coach' | 'client';
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

export interface WorkoutCommentResponse {
  id: number;
  content: string;
  timestamp: Date;
  user_type: 'coach' | 'client';
  client_program_workout_id: number;
  created_at: string;
  updated_at: string;
}

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
}

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
}

export interface ClientDetails extends Client {
  client_programs: ClientProgram[];
  client_outcome_measure: ClientOutcomeMeasure[];
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

export interface ClientProgramWorkout {
  id: number;
  programId: number;
  date: string;
  day: number;
  week: number;
  name: string;
  warmup: string;
  completed: boolean;
  updated: boolean;
  order: number;
  exercises: ClientProgramWorkoutExercise[];
  comments: WorkoutComment[];
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


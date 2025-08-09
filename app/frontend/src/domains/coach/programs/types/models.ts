import { Exercise } from "../../libraries/features/exercises/types";
import { DetailedRoutine } from "../../libraries/features/routines/types";

export interface Program {
  id: number;
  coach_id: number;
  num_weeks: number;
  name: string;
  description?: string;
  tags: ProgramTag[];
  created_at: string;
  updated_at: string;
}

export interface ProgramDetails extends Program {
  program_workouts: ProgramWorkout[];
}

export interface ProgramTag {
  id: number;
  name: string;
}

export interface ProgramWorkout {
  id: number;
  name?: string;
  program_id?: number;
  week: number;
  day: number;
  order: number;
  warmup_id: number | null;
  cooldown_id: number | null;
  warmup: DetailedRoutine | null;
  cooldown: DetailedRoutine | null;
  program_workout_exercises: ProgramWorkoutExercise[];
  created_at: string;
  updated_at: string;
}

export interface ProgramWorkoutExercise {
  id: number;
  exercise: Exercise;
  order: string;
  instructions?: string;
  created_at: string;
  updated_at: string;
}
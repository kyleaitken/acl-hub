import { Exercise } from "../libraries/features/exercises/types";
import { DetailedWarmupOrCooldown } from "../libraries/features/routines/types";

export type AddProgramDTO = {
  programName: string;
  programDescription?: string;
  num_weeks: number;
};

export type UpdateProgramDTO = {
  programId: number;
  programName?: string;
  programDescription?: string;
  num_weeks?: number;
};

export type BulkReorderProgramWorkoutsDTO = {
  programId: number;
  workouts_positions: WorkoutPositionData[];
};

export interface WorkoutPositionData {
  id: number;
  day: number;
  week: number;
  order: number;
}

export interface Program {
  id: number;
  coach_id: number;
  num_weeks: number;
  name: string;
  created_at: string;
  updated_at: string;
  description?: string;
  tags: ProgramTag[];
}

export interface ProgramTag {
  id: number;
  name: string;
}

export interface ProgramWorkout {
  id: number;
  day: number;
  week: number;
  order: number;
  program_workout_exercises: ProgramWorkoutExercise[];
  created_at: string;
  updated_at: string;
  name?: string;
  warmup?: DetailedWarmupOrCooldown;
  cooldown?: DetailedWarmupOrCooldown;
  program_id?: number;
  warmup_id?: number;
  cooldown_id?: number;
}

export interface ProgramWorkoutExercise {
  id: number;
  exercise: Exercise;
  order: string;
  instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgramDetails extends Program {
  program_workouts: ProgramWorkout[];
}

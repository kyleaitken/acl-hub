import { Exercise } from "../libraries/features/exercises/types";
import { DetailedWarmupOrCooldown } from "../libraries/features/routines/types";

// 1) Top‑level DTOs
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

export interface AddWorkoutDTO {
  programId: number;
  program_workout: ProgramWorkoutPayload;
}

export type UpdateWorkoutDTO = {
  programId: number;
  workoutId: number;
  name?: string;
  day?: number;
  week?: number;
  order?: number;
  warmup_id?: number | null;
  cooldown_id?: number | null;
  exercises?: ProgramWorkoutExercise[]; // 💡 might rename to `program_workout_exercises_attributes`
};

export type BulkReorderProgramWorkoutsDTO = {
  programId: number;
  workouts_positions: WorkoutPositionData[];
};

export interface BulkCopyWorkoutsDTO {
  programId: number;
  workoutIds: number[];
  targetDay: number;
  targetWeek: number;
}

// 2) Raw‑payload / “shape” types
interface RoutineAttributes {
  name?: string;
  instructions?: string;
  exercise_ids?: number[];
  custom: boolean;
}

export interface ExistingExerciseAttributes {
  exercise_id: number;
  order: string;
  instructions: string;
}

export interface NewExerciseAttributes {
  order: string;
  instructions: string;
  exercise_attributes: {
    name: string;
    custom: true;
  };
}

export type ProgramWorkoutExerciseAttributes =
  | ExistingExerciseAttributes
  | NewExerciseAttributes;

export interface ProgramWorkoutPayload {
  name?: string;
  week: number;
  day: number;
  order: number;

  warmup_id?: number;
  cooldown_id?: number;
  warmup_attributes?: RoutineAttributes;
  cooldown_attributes?: RoutineAttributes;

  program_workout_exercises_attributes: ProgramWorkoutExerciseAttributes[];
}

// helper for bulk reorder
export interface WorkoutPositionData {
  id: number;
  day: number;
  week: number;
  order: number;
}

// 3) Domain models
export interface ProgramTag {
  id: number;
  name: string;
}

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

export interface ProgramWorkoutExercise {
  id: number;
  exercise: Exercise;
  order: string;
  instructions?: string;
  created_at: string;
  updated_at: string;
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
  warmup: DetailedWarmupOrCooldown | null;
  cooldown: DetailedWarmupOrCooldown | null;
  program_workout_exercises: ProgramWorkoutExercise[];
  created_at: string;
  updated_at: string;
}

export interface ProgramDetails extends Program {
  program_workouts: ProgramWorkout[];
}

// 4) UI / form helper types
interface WorkoutCardItem extends ProgramWorkout {
  __type: "card";
}

export interface WorkoutFormItem {
  __type: "form";
  tempId: string;
  initialData?: {
    day: number;
    week: number;
    order: number;
  };
  existingData?: ProgramWorkout;
}

export type WorkoutStackItem = WorkoutCardItem | WorkoutFormItem;

export interface ExerciseStackItem {
  name: string;
  instructions: string;
  order: string;
  exerciseId?: number;
  tempId?: number;
  videoUrl?: string;
}

export interface RawWorkoutData {
  name?: string;
  warmupId?: number;
  warmupInstructions: string;
  warmupExerciseIds: number[];
  cooldownId?: number;
  cooldownInstructions: string;
  cooldownExerciseIds: number[];
  exercisesStack: ExerciseStackItem[];
}

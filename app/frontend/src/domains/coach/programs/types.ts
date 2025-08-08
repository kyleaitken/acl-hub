import { Exercise } from "../libraries/features/exercises/types";
import { DetailedRoutine } from "../libraries/features/routines/types";

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
  program_workout: CreateNewProgramWorkoutPayload;
}

export interface UpdateWorkoutDTO {
  workoutId: number;
  programId: number;
  program_workout: UpdateProgramWorkoutPayload;
}

export interface UpdateProgramWorkoutPayload {
  name?: string; 
  warmup_id?: number;
  cooldown_id?: number;
  warmup_attributes?: RoutineAttributes;
  cooldown_attributes?: RoutineAttributes;
  program_workout_exercises_attributes: UpdateWorkoutExerciseAttributes[];
}

export type UpdateWorkoutExerciseAttributes =
  | UpdateExistingProgramWorkoutExercise
  | CreateWorkoutExerciseFromLibraryExercise
  | CreateWorkoutExerciseFromNewExercise;

export interface UpdateExistingProgramWorkoutExercise {
  id: number;
  order?: string;
  instructions?: string;
  exercise_id?: number;
  _destroy?: boolean;
  exercise_attributes?: {
    id?: number;
    name?: string;
    custom: true;
  };
}

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
export interface RoutineAttributes {
  name?: string;
  instructions?: string;
  exercise_ids?: number[];
  custom: boolean;
}

export interface CreateWorkoutExerciseFromLibraryExercise {
  exercise_id: number;
  order: string;
  instructions: string;
}

export interface CreateWorkoutExerciseFromNewExercise {
  order: string;
  instructions: string;
  exercise_attributes: {
    name: string;
    custom: true;
  };
}

export type CreateWorkoutExerciseAttributes =
  | CreateWorkoutExerciseFromLibraryExercise
  | CreateWorkoutExerciseFromNewExercise

// for updates, if it's an existing exercise and we're changing some kind of detail, like order/instructions, I don't need the exerciseid, 
// just the program_workout_exercise_id
// If the name is changing and it's a custom exercise, will need the exercise_id so the backend can change the exercise record with the new name
// if adding an existing exercise in the update form, it will be a ExistingExerciseAttributes type with exercise_id, order, instructions
// if adding a new exercise in the update form, it will be newExerciseAttributes type
// if deleting a exercise, delete the program_workout_exercise and if that program_workout_exercise's exercise was a custom one, delete that too
// If editing a program_workout_exercise to change the exercise to a new id, but an existing exercise, similarly the payload would need the PWE id and the exercise_id, and then any other updates to the PWE, if there were any (order, isntructions) 

export interface CreateNewProgramWorkoutPayload {
  name?: string;
  week?: number;
  day?: number;
  order?: number;

  warmup_id?: number;
  cooldown_id?: number;
  warmup_attributes?: RoutineAttributes;
  cooldown_attributes?: RoutineAttributes;

  program_workout_exercises_attributes: CreateWorkoutExerciseAttributes[];
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
  warmup: DetailedRoutine | null;
  cooldown: DetailedRoutine | null;
  program_workout_exercises: ProgramWorkoutExercise[];
  created_at: string;
  updated_at: string;
}

export interface ProgramDetails extends Program {
  program_workouts: ProgramWorkout[];
}

// 4) UI / form helper types
export interface WorkoutCardItem extends ProgramWorkout {
  __type: "card";
}

export interface EditFormItem {
  __type: "form";
  mode: "edit";
  existingCard: WorkoutCardItem;
}

export interface CreateFormItem {
  __type: "form";
  mode: "create";
  tempId: string;
}

export type WorkoutFormItem = CreateFormItem | EditFormItem;

export type WorkoutStackItem = WorkoutCardItem | WorkoutFormItem;

export interface ExerciseStackItem {
  name: string;
  instructions: string;
  order: string;
  exerciseId?: number;
  programWorkoutExerciseId?: number; 
  tempId?: number;
  videoUrl?: string;
}

export interface RawWorkoutData {
  name?: string;
  workoutId?: number;

  warmupId?: number;
  warmupInstructions: string;
  warmupExercises: Exercise[];
  isCustomWarmup: boolean;

  cooldownId?: number;
  cooldownInstructions: string;
  cooldownExercises: Exercise[];
  isCustomCooldown: boolean;

  exercisesStack: ExerciseStackItem[];
  deletedWorkoutExerciseIds: number[];
}

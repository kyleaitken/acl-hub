import { Exercise } from "../../libraries/features/exercises/types";
import { ProgramWorkout } from "./models";

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
  customExercise?: boolean;
  programWorkoutExerciseId?: number; 
  tempId?: string;
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
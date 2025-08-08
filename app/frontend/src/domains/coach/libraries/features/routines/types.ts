import { Exercise } from "../exercises/types";

export interface LibraryRoutine {
  id: number;
  name: string;
  instructions?: string;
  exerciseIds?: number[];
  custom: boolean;
}

export interface DetailedRoutine extends Omit<LibraryRoutine, 'exerciseIds'> {
  exercises: Exercise[];
  coach_id: number;
  created_at: string;
  updated_at: string;
}

export type UpdateWarmupCooldownDTO = {
  id: number;
  name: string;
  instructions?: string;
  exerciseIds?: Array<number>;
}

export type AddWarmupCooldownDTO = {
  name: string;
  instructions?: string;
  exerciseIds?: Array<number>;
}

export type RoutineType = "warmup" | "cooldown";
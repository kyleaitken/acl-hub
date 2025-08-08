import { CreateNewProgramWorkoutPayload, UpdateProgramWorkoutPayload } from "./payloads";

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

export interface BulkCopyWorkoutsDTO {
  programId: number;
  workoutIds: number[];
  targetDay: number;
  targetWeek: number;
}
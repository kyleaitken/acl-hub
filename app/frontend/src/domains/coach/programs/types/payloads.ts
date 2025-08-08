
// export interface CreateNewProgramWorkoutPayload {
//   name?: string;
//   week?: number;
//   day?: number;
//   order?: number;

//   warmup_id?: number;
//   cooldown_id?: number;
//   warmup_attributes?: RoutineAttributes;
//   cooldown_attributes?: RoutineAttributes;

//   program_workout_exercises_attributes: CreateWorkoutExerciseAttributes[];
// }

// export interface UpdateProgramWorkoutPayload {
//   name?: string; 
//   warmup_id?: number;
//   cooldown_id?: number;
//   warmup_attributes?: RoutineAttributes;
//   cooldown_attributes?: RoutineAttributes;
//   program_workout_exercises_attributes: UpdateWorkoutExerciseAttributes[];
// }

// export interface RoutineAttributes {
//   name?: string;
//   instructions?: string;
//   exercise_ids?: number[];
//   custom: boolean;
// }

// interface BaseExerciseAttrs {
//   order: string;
//   instructions: string;
// }

// export type CreateFromLibrary = BaseExerciseAttrs & { exerciseId: number }
// export type UpdateFromLibrary = BaseExerciseAttrs & { 
//   id: number; exerciseId: number; _destroy?: boolean 
// }

// export type UpdateWorkoutExerciseAttributes =
//   | UpdateExistingProgramWorkoutExercise
//   | CreateWorkoutExerciseFromLibraryExercise
//   | CreateWorkoutExerciseFromNewExercise;

// export type CreateWorkoutExerciseAttributes =
//   | CreateWorkoutExerciseFromLibraryExercise
//   | CreateWorkoutExerciseFromNewExercise

// export interface UpdateExistingProgramWorkoutExercise {
//   id: number;
//   order?: string;
//   instructions?: string;
//   exercise_id?: number;
//   _destroy?: boolean;
//   exercise_attributes?: {
//     id?: number;
//     name?: string;
//     custom: true;
//   };
// }

// export interface CreateWorkoutExerciseFromLibraryExercise {
//   exercise_id: number;
//   order: string;
//   instructions: string;
// }

// export interface CreateWorkoutExerciseFromNewExercise {
//   order: string;
//   instructions: string;
//   exercise_attributes: {
//     name: string;
//     custom: true;
//   };
// }


export interface CreateNewProgramWorkoutPayload {
  name?: string;
  week?: number;
  day?: number;
  order?: number;
  warmup_id?: number;
  cooldown_id?: number;
  warmup_attributes?: RoutineAttributes;
  cooldown_attributes?: RoutineAttributes;

  // ← now a single union
  program_workout_exercises_attributes: ProgramWorkoutExerciseAttrs[];
}

export interface UpdateProgramWorkoutPayload {
  name?: string;
  warmup_id?: number;
  cooldown_id?: number;
  warmup_attributes?: RoutineAttributes;
  cooldown_attributes?: RoutineAttributes;

  // ← same union here
  program_workout_exercises_attributes: ProgramWorkoutExerciseAttrs[];
}

export interface RoutineAttributes {
  name?: string;
  instructions?: string;
  exercise_ids?: number[];
  custom: boolean;
}

interface BaseExerciseAttrs {
  order: string;
  instructions: string;
}

export interface DeletePWE extends BaseExerciseAttrs {
  id: number;
  _destroy: true;
}

export interface UpdatePWE extends BaseExerciseAttrs {
  id: number;
  _destroy?: false;       
  exercise_id?: number;   
  exercise_attributes?: {  
    id?: number;
    name?: string;
    custom: true;
  };
}

export interface CreateFromLibrary extends BaseExerciseAttrs {
  id?: never;             
  _destroy?: never;
  exercise_id: number;  
}

export interface CreateNewCustom extends BaseExerciseAttrs {
  id?: never;
  _destroy?: never;
  exercise_attributes: {
    name: string;
    custom: true;
  };
}

export type ProgramWorkoutExerciseAttrs =
  | DeletePWE
  | UpdatePWE
  | CreateFromLibrary
  | CreateNewCustom;


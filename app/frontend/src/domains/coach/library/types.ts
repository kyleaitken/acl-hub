export enum LibraryTab {
    Exercises = 'exercises',
    Warmups = 'warmups',
    Cooldowns = 'cooldowns',
    Metrics = 'metrics'
}

export type UpdateWarmupDTO = {
    warmupId: number;
    name: string;
    instructions?: string;
    exerciseIds?: Array<number>;
}

export type AddWarmupDTO = {
    name: string;
    instructions?: string;
    exerciseIds?: Array<number>;
}

export type AddExerciseDTO = {
    name: string;
    description?: string;
    category?: string;
    muscleGroup?: string;
    videoUrl?: string;
  }
  
  export type UpdateExerciseDTO = {
    exerciseId: number;
    name?: string;
    description?: string;
    category?: string;
    muscleGroup?: string;
    videoUrl?: string;
  }
  
  export type Warmup = {
    id: number;
    name: string;
    instructions?: string;
    exerciseIds?: number[];
  }
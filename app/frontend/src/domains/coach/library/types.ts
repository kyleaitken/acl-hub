export enum LibraryTab {
    Exercises = 'exercises',
    Warmups = 'warmups',
    Cooldowns = 'cooldowns',
    Metrics = 'metrics'
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
  
  export type WarmupOrCooldown = {
    id: number;
    name: string;
    instructions?: string;
    exerciseIds?: number[];
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
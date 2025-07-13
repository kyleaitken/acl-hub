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
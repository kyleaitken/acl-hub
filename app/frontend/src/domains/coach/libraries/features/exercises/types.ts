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

export interface Exercise {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  description?: string;
  category?: string;
  video_url?: string;
  muscle_group?: string;
  images: ExerciseImage[];
}

export interface ExerciseImage {
  id: number;
  exerciseId: number;
  created_at: string;
  updated_at: string;
  order?: number;
  url?: string; // TODO - make this 
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}

export interface PaginatedExercisesResponse {
  data: Exercise[];
  pagination: PaginationMeta;
}

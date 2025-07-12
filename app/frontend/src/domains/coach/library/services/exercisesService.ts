import { AddExerciseDTO, UpdateExerciseDTO } from '../../core/types/dtos';
import { Exercise, PaginatedExercisesResponse } from '../../core/types/models';
import { apiRequest } from '../../core/api/api';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/exercises`;
const EXERCISES_LIMIT = 25;

const fetchExercises = (token: string, page: number): Promise<PaginatedExercisesResponse> =>
  apiRequest(`${baseUrl}?page=${page}&limit=${EXERCISES_LIMIT}`, 'GET', token);

const fetchExercise = (
  token: string,
  exerciseId: number,
): Promise<Exercise> => apiRequest(`${baseUrl}/${exerciseId}`, 'GET', token);

const searchExercises = (
  token: string,
  query: string,
): Promise<Exercise[]> => apiRequest(`${baseUrl}?query=${query}`, 'GET', token);

const addExercise = (
  token: string,
  dto: AddExerciseDTO,
): Promise<Exercise> => {
  const { name, description, category, muscleGroup, videoUrl } = dto;

  const body = Object.fromEntries(
  Object.entries({
    name: name,
    description: description,
    category: category,
    muscle_group: muscleGroup,
    video_url: videoUrl
    }).filter(([_, value]) => typeof value !== 'undefined'),
  );
  return apiRequest(baseUrl, 'POST', token, body);
};

export const deleteExercse = async (token: string, exerciseId: number) => {
  const url = `${baseUrl}/${exerciseId}`;
  return apiRequest(url, 'DELETE', token);
};

export const updateExercise = async (
  token: string,
  dto: UpdateExerciseDTO,
): Promise<Exercise> => {
  const { exerciseId, name, description, category, muscleGroup, videoUrl } = dto;
  const url = `${baseUrl}/${exerciseId}`;

  const body = Object.fromEntries(
    Object.entries({
      name: name,
      description: description,
      category: category,
      muscle_group: muscleGroup,
      video_url: videoUrl
    }).filter(([_, value]) => typeof value !== 'undefined'),
  );
  return apiRequest(url, 'PUT', token, body);
};

// TODO: How to add/delete exercise images

export default {
  fetchExercises,
  fetchExercise,
  searchExercises,
  addExercise,
  deleteExercse,
  updateExercise,
};

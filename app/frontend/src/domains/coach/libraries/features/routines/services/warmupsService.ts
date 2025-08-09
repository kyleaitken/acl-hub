import { AddWarmupCooldownDTO, UpdateWarmupCooldownDTO, LibraryRoutine, DetailedRoutine } from '../types';
import { apiRequest } from '../../../../core/api/api';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches/warmups`;

const fetchWarmups = (token: string): Promise<LibraryRoutine[]> =>
  apiRequest(`${baseUrl}`, 'GET', token);

const fetchWarmup = (
  token: string,
  warmupId: number,
): Promise<LibraryRoutine> => apiRequest(`${baseUrl}/${warmupId}`, 'GET', token);

const fetchDetailedWarmup = (
  token: string,
  warmupId: number
): Promise<DetailedRoutine> => apiRequest(`${baseUrl}/${warmupId}/detailed`, 'GET', token);

const addWarmup = (
  token: string,
  dto: AddWarmupCooldownDTO,
): Promise<LibraryRoutine> => {
  const { name, instructions, exerciseIds } = dto;

  const body = Object.fromEntries(
    Object.entries({
        name: name,
        instructions: instructions,
        exercise_ids: exerciseIds
    }).filter(([_, value]) => typeof value !== 'undefined'),
  );
  return apiRequest(baseUrl, 'POST', token, body);
};

export const deleteWarmup = async (token: string, warmupId: number) => {
  const url = `${baseUrl}/${warmupId}`;
  return apiRequest(url, 'DELETE', token);
};

export const updateWarmup = async (
  token: string,
  dto: UpdateWarmupCooldownDTO,
): Promise<LibraryRoutine> => {
  const { id, name, instructions, exerciseIds } = dto;
  const url = `${baseUrl}/${id}`;

  const body = Object.fromEntries(
    Object.entries({
      name: name,
      instructions: instructions,
      exercise_ids: exerciseIds,
    }).filter(([_, value]) => typeof value !== 'undefined'),
  );
  return apiRequest(url, 'PUT', token, body);
};

export default {
  fetchWarmups,
  fetchWarmup,
  fetchDetailedWarmup,
  addWarmup,
  deleteWarmup,
  updateWarmup,
};

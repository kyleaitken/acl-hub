import { AddWarmupCooldownDTO, UpdateWarmupCooldownDTO, WarmupOrCooldown } from '../types';
import { apiRequest } from '../../../../core/api/api';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches/warmups`;

const fetchWarmups = (token: string): Promise<WarmupOrCooldown[]> =>
  apiRequest(`${baseUrl}`, 'GET', token);

const fetchWarmup = (
  token: string,
  warmupId: number,
): Promise<WarmupOrCooldown> => apiRequest(`${baseUrl}/${warmupId}`, 'GET', token);

const addWarmup = (
  token: string,
  dto: AddWarmupCooldownDTO,
): Promise<WarmupOrCooldown> => {
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
): Promise<WarmupOrCooldown> => {
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
  addWarmup,
  deleteWarmup,
  updateWarmup,
};

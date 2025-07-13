import { AddWarmupCooldownDTO, UpdateWarmupCooldownDTO, WarmupOrCooldown } from '../types';
import { apiRequest } from '../../core/api/api';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches/cooldowns`;

const fetchCooldowns = (token: string): Promise<WarmupOrCooldown[]> =>
  apiRequest(`${baseUrl}`, 'GET', token);

const fetchCooldown = (
  token: string,
  cooldownId: number,
): Promise<WarmupOrCooldown> => apiRequest(`${baseUrl}/${cooldownId}`, 'GET', token);

const addCooldown = (
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

export const deleteCooldown = async (token: string, cooldownId: number) => {
  const url = `${baseUrl}/${cooldownId}`;
  return apiRequest(url, 'DELETE', token);
};

export const updateCooldown = async (
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
  fetchCooldowns,
  fetchCooldown,
  addCooldown,
  deleteCooldown,
  updateCooldown,
};

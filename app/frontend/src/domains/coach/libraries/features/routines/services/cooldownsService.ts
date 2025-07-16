import { AddWarmupCooldownDTO, LibraryWarmupOrCooldown, UpdateWarmupCooldownDTO } from '../types';
import { apiRequest } from '../../../../core/api/api';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches/cooldowns`;

const fetchCooldowns = (token: string): Promise<LibraryWarmupOrCooldown[]> =>
  apiRequest(`${baseUrl}`, 'GET', token);

const fetchCooldown = (
  token: string,
  cooldownId: number,
): Promise<LibraryWarmupOrCooldown> => apiRequest(`${baseUrl}/${cooldownId}`, 'GET', token);

const addCooldown = (
  token: string,
  dto: AddWarmupCooldownDTO,
): Promise<LibraryWarmupOrCooldown> => {
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
): Promise<LibraryWarmupOrCooldown> => {
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

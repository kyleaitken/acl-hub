import { useCooldownsStore } from './../store/cooldownsStore';
import { useAuthenticatedUser } from '../../../shared/auth/hooks/useAuthenticatedUser';
import { AddWarmupCooldownDTO, UpdateWarmupCooldownDTO } from '../types';

export const useCooldownsActions = () => {
  const { token } = useAuthenticatedUser();

  const fetchCooldowns = useCooldownsStore((s) => s.fetchCooldowns);
  const fetchCooldown = useCooldownsStore((s) => s.fetchCooldown);
  const addCooldown = useCooldownsStore((s) => s.addCooldown);
  const deleteCooldown = useCooldownsStore((s) => s.deleteCooldown);
  const updateCooldown = useCooldownsStore((s) => s.updateCooldown);

  return {
    fetchCooldowns: () => fetchCooldowns(token),
    fetchCooldown: (id: number) => fetchCooldown(token, id),
    addCooldown: (cooldownData: AddWarmupCooldownDTO) => addCooldown(token, cooldownData),
    updateCooldown: (cooldownData: UpdateWarmupCooldownDTO) => updateCooldown(token, cooldownData),
    deleteCooldown: (id: number) => deleteCooldown(token, id)
  };
};

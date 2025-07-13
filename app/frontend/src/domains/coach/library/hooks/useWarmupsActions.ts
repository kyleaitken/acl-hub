import { useWarmupsStore } from './../store/warmupsStore';
import { useAuthenticatedUser } from '../../../shared/auth/hooks/useAuthenticatedUser';
import { AddWarmupCooldownDTO, UpdateWarmupCooldownDTO } from '../types';

export const useWarmupsActions = () => {
  const { token } = useAuthenticatedUser();

  const fetchWarmups = useWarmupsStore((s) => s.fetchWarmups);
  const fetchWarmup = useWarmupsStore((s) => s.fetchWarmup);
  const addWarmup = useWarmupsStore((s) => s.addWarmup);
  const deleteWarmup = useWarmupsStore((s) => s.deleteWarmup);
  const updateWarmup = useWarmupsStore((s) => s.updateWarmup);

  return {
    fetchWarmups: () => fetchWarmups(token),
    fetchWarmup: (id: number) => fetchWarmup(token, id),
    addWarmup: (warmupData: AddWarmupCooldownDTO) => addWarmup(token, warmupData),
    updateWarmup: (warmupData: UpdateWarmupCooldownDTO) => updateWarmup(token, warmupData),
    deleteWarmup: (id: number) => deleteWarmup(token, id)
  };
};

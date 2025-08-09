import { useCooldownsStore } from '../store/cooldownsStore';

export const useCooldownsData = () => {
  return {
    cooldowns: Object.values(useCooldownsStore((s) => s.cooldowns)),
    loading: useCooldownsStore((s) => s.loading),
    error: useCooldownsStore((s) => s.error),
  };
};

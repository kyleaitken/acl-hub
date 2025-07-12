import { useWarmupsStore } from './../store/warmupsStore';

export const useWarmupsData = () => {
  return {
    warmups: Object.values(useWarmupsStore((s) => s.warmups)),
    loading: useWarmupsStore((s) => s.loading),
    error: useWarmupsStore((s) => s.error),
  };
};

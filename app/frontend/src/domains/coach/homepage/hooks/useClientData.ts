import { useCoachClientStore } from '../store/coachClientStore';

export const useClientData = () => {
  const clients = useCoachClientStore((state) => state.clientsById);
  const loading = useCoachClientStore((state) => state.loading);
  const error = useCoachClientStore((state) => state.error);
  const fetchClients = useCoachClientStore((state) => state.fetchClients);
  const resetError = useCoachClientStore((state) => state.resetError);

  return {
    clients,
    loading,
    error,
    fetchClients,
    resetError,
  };
};

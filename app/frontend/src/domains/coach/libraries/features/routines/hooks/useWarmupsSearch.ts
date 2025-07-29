import { LibraryWarmupOrCooldown } from './../types';
import { useAuthenticatedUser } from '../../../../../shared/auth/hooks/useAuthenticatedUser';
import { useState } from 'react';
import { useWarmupsActions } from './useWarmupsActions';

export const useWarmupsSearch = () => {
  const { token } = useAuthenticatedUser();
  const [warmupSearchResults, setWarmupSearchResults] = useState<LibraryWarmupOrCooldown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const { fetchWarmups } = useWarmupsActions();

  const searchWarmups = async (query: string) => {
  if (!token) return;

    try {
        setLoading(true);
        const lowerCaseQuery = query.toLowerCase();
        const warmups = await fetchWarmups();
        const filtered = warmups.filter((cd) => cd.name.toLowerCase().includes(lowerCaseQuery));
        setWarmupSearchResults(filtered);
    } catch (err) {
        console.error('Failed to search warmups', err);
        setError('Failed to search warmups');
    } finally {
        setLoading(false);
    }
  };

  return {
    warmupSearchResults,
    loading,
    error,
    searchWarmups,
  };
};
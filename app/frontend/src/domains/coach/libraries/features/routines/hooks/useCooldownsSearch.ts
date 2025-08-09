import { LibraryRoutine } from './../types';
import { useAuthenticatedUser } from '../../../../../shared/auth/hooks/useAuthenticatedUser';
import { useState } from 'react';
import { useCooldownsActions } from './useCooldownsActions';

export const useCooldownsSearch = () => {
  const { token } = useAuthenticatedUser();
  const [cooldownSearchResults, setCooldownsSearchResults] = useState<LibraryRoutine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const { fetchCooldowns } = useCooldownsActions();

  const searchCooldowns = async (query: string) => {
  if (!token) return;

    try {
        setLoading(true);
        const lowerCaseQuery = query.toLowerCase();
        const cooldowns = await fetchCooldowns();
        const filtered = cooldowns.filter((cd) => cd.name.toLowerCase().includes(lowerCaseQuery));
        setCooldownsSearchResults(filtered);
    } catch (err) {
        console.error('Failed to search cooldowns', err);
        setError('Failed to search cooldowns');
    } finally {
        setLoading(false);
    }
  };

  return {
    cooldownSearchResults,
    loading,
    error,
    searchCooldowns,
  };
};
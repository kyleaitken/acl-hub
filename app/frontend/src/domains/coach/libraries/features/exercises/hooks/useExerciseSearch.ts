import exercisesService from '../services/exercisesService';
import { useAuthenticatedUser } from '../../../../../shared/auth/hooks/useAuthenticatedUser';
import { useState } from 'react';
import { Exercise } from '../types';
import { useExercisesStore } from '../store/exercisesStore';

export const useExerciseSearch = () => {
  const { token } = useAuthenticatedUser();
  const [results, setResults] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const addSearchedExercises = useExercisesStore(s => s.addSearchedExercises);

  const search = async (query: string) => {
  if (!token) return;

    try {
        setLoading(true);
        const response = await exercisesService.searchExercises(token, query);
        setResults(response);
        addSearchedExercises(response);
    } catch (err) {
        console.error('Failed to search exercises', err);
        setError('Failed to search exercises');
    } finally {
        setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    search,
  };
};
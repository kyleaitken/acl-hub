import { AddExerciseDTO, UpdateExerciseDTO } from '../types';
import { useAuthenticatedUser } from '../../../../../shared/auth/hooks/useAuthenticatedUser';
import { useExercisesStore } from '../store/exercisesStore';

export const useExercisesActions = () => {
  const { token } = useAuthenticatedUser();

  const fetchExercises = useExercisesStore((s) => s.fetchExercises);
  const fetchExercise = useExercisesStore((s) => s.fetchExerciseById);
  const addExercise = useExercisesStore((s) => s.addExercise);
  const deleteExercise = useExercisesStore((s) => s.deleteExercise);
  const updateExercise = useExercisesStore((s) => s.updateExercise);

  return {
    fetchExercises: (page: number = 1) => fetchExercises(token, page),
    fetchExercise: (id: number) => fetchExercise(token, id),
    addExercise: (exerciseData: AddExerciseDTO) => addExercise(token, exerciseData),
    updateExercise: (exerciseData: UpdateExerciseDTO) => updateExercise(token, exerciseData),
    deleteExercise: (id: number) => deleteExercise(token, id)
  };
};

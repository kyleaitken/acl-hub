import { useExercisesStore } from './../store/exercisesStore';

export const useExercisesData = () => {
  return {
    exercises: Object.values(useExercisesStore((s) => s.exercises)),
    loading: useExercisesStore((s) => s.loading),
    error: useExercisesStore((s) => s.error),
    page: useExercisesStore((s) => s.page),
    hasMore: useExercisesStore((s) => s.hasMore)
  };
};

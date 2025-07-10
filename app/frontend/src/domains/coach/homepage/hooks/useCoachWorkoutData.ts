import { useCoachWorkoutStore } from '../store/coachWorkoutStore';

export const useCoachWorkoutData = () => ({
  todayWorkouts: useCoachWorkoutStore((s) => s.todayWorkouts),
  updatedWorkouts: useCoachWorkoutStore((s) => s.updatedWorkouts),
  updatedWorkoutComments: useCoachWorkoutStore((s) => s.updatedWorkoutComments),
  loading: useCoachWorkoutStore((s) => s.loading),
  error: useCoachWorkoutStore((s) => s.error),
});

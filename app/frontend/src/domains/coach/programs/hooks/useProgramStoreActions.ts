import { useAuthenticatedUser } from '../../../shared/auth/hooks/useAuthenticatedUser';
import { useProgramStore } from '../store/programStore';
import { curryToken } from '../../core/utils/curryToken';

export const useProgramStoreActions = () => {
  const { token } = useAuthenticatedUser();
  const store = useProgramStore.getState(); 

  return {
    fetchPrograms: curryToken(store.fetchPrograms, token),
    fetchProgram: curryToken(store.fetchProgram, token),
    addProgram: curryToken(store.addProgram, token),
    updateProgramDetails: curryToken(store.updateProgramDetails, token),
    updateWorkoutPositions: curryToken(store.updateWorkoutPositions, token),
    deleteProgram: curryToken(store.deleteProgram, token),
    addTagToProgram: curryToken(store.addTagToProgram, token),
    removeTagFromProgram: curryToken(store.removeTagFromProgram, token),
    addWorkoutToProgram: curryToken(store.addWorkoutToProgram, token),
    updateWorkout: curryToken(store.updateWorkout, token),
    deleteWorkoutsFromProgram: curryToken(store.deleteWorkoutsFromProgram, token),
    bulkCopyWorkoutsToProgram: curryToken(store.bulkCopyWorkoutsToProgram, token),
    deleteWeekFromProgram: curryToken(store.deleteWeekFromProgram, token),

    // Non curried state setters
    setCopiedWorkoutIds: store.setCopiedWorkoutIds,
    setSelectedWorkoutIds: store.setSelectedWorkoutIds,
    setIsEditingWorkout: store.setIsEditingWorkout,
    setError: store.setError,
    resetError: store.resetError,
  };
};

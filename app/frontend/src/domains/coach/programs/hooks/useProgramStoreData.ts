import { useProgramStore } from '../store/programStore';

export const useProgramData = () => {
  return {
    programsMap: (useProgramStore((s) => s.programs)),
    programs: Object.values(useProgramStore((s) => s.programs)),
    copiedWorkoutIds: (useProgramStore((s) => s.copiedWorkoutIds)),
    selectedWorkoutIds: (useProgramStore((s) => s.selectedWorkoutIds)),
    loading: useProgramStore((s) => s.loading),
    error: useProgramStore((s) => s.error),
    isEditingWorkout: useProgramStore((s) => s.isEditingWorkout),
  };
};

export const useProgramDetails = (programId: number) => {
  const program = useProgramStore((s) => s.detailedPrograms[programId]);
  const loading = useProgramStore((s) => s.loading);
  const error = useProgramStore((s) => s.error);
  return { program, loading, error };
};
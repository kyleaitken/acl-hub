import { useProgramStore } from '../store/programStore';

export const useProgramData = () => {
  return {
    programsMap: (useProgramStore((s) => s.programs)),
    programs: Object.values(useProgramStore((s) => s.programs)),
    loading: useProgramStore((s) => s.loading),
    error: useProgramStore((s) => s.error),
  };
};

export const useProgramDetails = (programId: number) => {
  const program = useProgramStore((s) => s.detailedPrograms[programId]);
  const loading = useProgramStore((s) => s.loading);
  const error = useProgramStore((s) => s.error);
  return { program, loading, error };
};
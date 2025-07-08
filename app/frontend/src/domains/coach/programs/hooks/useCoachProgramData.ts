import { useCoachProgramStore } from '../store/coachProgramStore';

export const useCoachProgramData = () => {
  return {
    programs: Object.values(useCoachProgramStore((s) => s.programs)),
    loading: useCoachProgramStore((s) => s.loading),
    error: useCoachProgramStore((s) => s.error),
  };
};

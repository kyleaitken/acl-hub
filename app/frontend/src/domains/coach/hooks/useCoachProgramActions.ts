import { useAuthenticatedUser } from '../../shared/auth/hooks/useAuthenticatedUser';
import { useCoachProgramStore } from '../store/coachProgramStore';
import { UpdateCoachProgramDTO, AddCoachProgramDTO } from '../types/dtos';

export const useCoachProgramActions = () => {
  const { token } = useAuthenticatedUser();

  const fetchPrograms = useCoachProgramStore((s) => s.fetchPrograms);
  const fetchProgramById = useCoachProgramStore((s) => s.fetchProgramById);
  const addProgram = useCoachProgramStore((s) => s.addProgram);
  const updateProgram = useCoachProgramStore((s) => s.updateProgram);
  const deleteProgram = useCoachProgramStore((s) => s.deleteProgram);
  const setError = useCoachProgramStore((s) => s.setError);
  const resetError = useCoachProgramStore((s) => s.resetError);

  return {
    fetchPrograms: () => fetchPrograms(token),
    fetchProgramById: (id: number) => fetchProgramById(token, id),
    addProgram: (dto: AddCoachProgramDTO) => addProgram(token, dto),
    updateProgram: (dto: UpdateCoachProgramDTO) => updateProgram(token, dto),
    deleteProgram: (id: number) => deleteProgram(token, id),
    setError: (error: string) => setError(error),
    resetError: () => resetError(),
  };
};

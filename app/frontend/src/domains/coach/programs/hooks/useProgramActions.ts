import { useAuthenticatedUser } from '../../../shared/auth/hooks/useAuthenticatedUser';
import { useProgramStore } from '../store/programStore';
import { UpdateProgramDTO, AddProgramDTO, BulkReorderProgramWorkoutsDTO } from '../types';

export const useProgramActions = () => {
  const { token } = useAuthenticatedUser();

  const fetchPrograms = useProgramStore((s) => s.fetchPrograms);
  const fetchProgram = useProgramStore((s) => s.fetchProgram);
  const addProgram = useProgramStore((s) => s.addProgram);
  const updateProgram = useProgramStore((s) => s.updateProgram);
  const updateWorkoutPositions = useProgramStore((s) => s.updateWorkoutPositions);
  const deleteProgram = useProgramStore((s) => s.deleteProgram);
  const addTagToProgram = useProgramStore((s) => s.addTagToProgram);
  const removeTagFromProgram = useProgramStore(
    (s) => s.removeTagFromProgram,
  );
  const setError = useProgramStore((s) => s.setError);
  const resetError = useProgramStore((s) => s.resetError);

  return {
    fetchPrograms: () => fetchPrograms(token),
    fetchProgram: (id: number) => fetchProgram(token, id),
    addProgram: (dto: AddProgramDTO) => addProgram(token, dto),
    updateProgram: (dto: UpdateProgramDTO) => updateProgram(token, dto),
    updateWorkoutPositions: (dto: BulkReorderProgramWorkoutsDTO) => updateWorkoutPositions(token, dto),
    deleteProgram: (id: number) => deleteProgram(token, id),
    addTagToProgram: (programId: number, tagId: number) =>
      addTagToProgram(token, programId, tagId),
    removeTagFromProgram: (programId: number, tagId: number) =>
      removeTagFromProgram(token, programId, tagId),
    setError: (error: string) => setError(error),
    resetError: () => resetError(),
  };
};

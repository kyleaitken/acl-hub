import { 
  BulkCopyWorkoutsDTO,
  UpdateWorkoutDTO, 
  UpdateProgramDTO, 
  AddProgramDTO, 
  BulkReorderProgramWorkoutsDTO, 
  AddWorkoutDTO 
} from '../types/dtos';
import { useAuthenticatedUser } from '../../../shared/auth/hooks/useAuthenticatedUser';
import { useProgramStore } from '../store/programStore';

export const useProgramActions = () => {
  const { token } = useAuthenticatedUser();

  const fetchPrograms = useProgramStore((s) => s.fetchPrograms);
  const fetchProgram = useProgramStore((s) => s.fetchProgram);
  const addProgram = useProgramStore((s) => s.addProgram);
  const updateProgramDetails = useProgramStore((s) => s.updateProgramDetails);
  const updateWorkoutPositions = useProgramStore((s) => s.updateWorkoutPositions);
  const deleteProgram = useProgramStore((s) => s.deleteProgram);
  const addTagToProgram = useProgramStore((s) => s.addTagToProgram);
  const removeTagFromProgram = useProgramStore(
    (s) => s.removeTagFromProgram,
  );
  const addWorkoutToProgram = useProgramStore((s) => s.addWorkoutToProgram);
  const updateWorkout = useProgramStore((s) => s.updateWorkout); 
  const deleteWorkoutsFromProgram = useProgramStore((s) => s.deleteWorkoutsFromProgram);
  const bulkCopyWorkoutsToProgram = useProgramStore((s) => s.bulkCopyWorkoutsToProgram);
  const setCopiedWorkoutIds = useProgramStore((s) => s.setCopiedWorkoutIds);
  const setSelectedWorkoutIds = useProgramStore((s) => s.setSelectedWorkoutIds);
  const setIsEditingWorkout = useProgramStore((s) => s.setIsEditingWorkout);
  const setError = useProgramStore((s) => s.setError);
  const resetError = useProgramStore((s) => s.resetError);

  return {
    fetchPrograms: () => fetchPrograms(token),
    fetchProgram: (id: number) => fetchProgram(token, id),
    addProgram: (dto: AddProgramDTO) => addProgram(token, dto),
    updateProgramDetails: (dto: UpdateProgramDTO) => updateProgramDetails(token, dto),
    updateWorkoutPositions: (dto: BulkReorderProgramWorkoutsDTO) => updateWorkoutPositions(token, dto),
    deleteProgram: (id: number) => deleteProgram(token, id),
    addTagToProgram: (programId: number, tagId: number) =>
      addTagToProgram(token, programId, tagId),
    removeTagFromProgram: (programId: number, tagId: number) =>
      removeTagFromProgram(token, programId, tagId),
    addWorkoutToProgram: (dto: AddWorkoutDTO) => addWorkoutToProgram(token, dto),
    updateWorkout: (dto: UpdateWorkoutDTO) => updateWorkout(token, dto),
    deleteWorkoutsFromProgram: (programId: number, workoutIds: number[]) => deleteWorkoutsFromProgram(token, programId, workoutIds),
    bulkCopyWorkoutsToProgram: (workoutsData: BulkCopyWorkoutsDTO) => bulkCopyWorkoutsToProgram(token, workoutsData),
    setCopiedWorkoutIds: (workoutIds: number[]) => setCopiedWorkoutIds(workoutIds),
    setSelectedWorkoutIds: (workoutIds: number[]) => setSelectedWorkoutIds(workoutIds),
    setIsEditingWorkout: (flag: boolean) => setIsEditingWorkout(flag),
    setError: (error: string) => setError(error),
    resetError: () => resetError(),
  };
};

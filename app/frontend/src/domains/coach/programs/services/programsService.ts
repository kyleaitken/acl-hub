import { 
  AddProgramDTO, 
  UpdateProgramDTO, 
  BulkReorderProgramWorkoutsDTO, 
  AddWorkoutDTO, 
  BulkCopyWorkoutsDTO, 
  UpdateWorkoutDTO
} from '../types/dtos';
import { Program, ProgramDetails, ProgramWorkout } from "../types/models"
import { apiRequest } from '../../core/api/api';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches/programs`;

const fetchPrograms = (token: string): Promise<Program[]> =>
  apiRequest(`${baseUrl}`, 'GET', token);

const fetchProgram = (
  token: string,
  programId: number,
): Promise<ProgramDetails> => apiRequest(`${baseUrl}/${programId}`, 'GET', token);

const addProgram = (
  token: string,
  dto: AddProgramDTO,
): Promise<Program> => {
  const body = {
    name: dto.programName,
    description: dto.programDescription,
    num_weeks: dto.num_weeks,
  };
  return apiRequest(baseUrl, 'POST', token, body);
};

export const deleteProgram = async (token: string, programId: number) => {
  const url = `${baseUrl}/${programId}`;
  return apiRequest(url, 'DELETE', token);
};

export const updateProgramDetails = async (
  token: string,
  dto: UpdateProgramDTO,
): Promise<Program> => {
  const { programId, programName, programDescription, num_weeks } = dto;
  const url = `${baseUrl}/${programId}`;

  const body = Object.fromEntries(
    Object.entries({
      name: programName,
      description: programDescription,
      num_weeks,
    }).filter(([_, value]) => typeof value !== 'undefined'),
  );
  return apiRequest(url, 'PUT', token, body);
};

export const updateWorkoutPositions = async(
  token: string,
  dto: BulkReorderProgramWorkoutsDTO,
): Promise<ProgramDetails> => {
  const { programId, workouts_positions } = dto;
  const url = `${baseUrl}/${programId}/update_positions`;
  return apiRequest(url, 'PATCH', token, {program_workouts: workouts_positions});
}

const addTagToProgram = (
  token: string,
  programId: number,
  tagId: number,
): Promise<Program> =>
  apiRequest(`${baseUrl}/${programId}/add_tag/${tagId}`, 'POST', token);

const removeTagFromProgram = (
  token: string,
  programId: number,
  tagId: number,
): Promise<Program> =>
  apiRequest(`${baseUrl}/${programId}/remove_tag/${tagId}`, 'DELETE', token);

const deleteWorkoutsFromProgram = (
  token: string,
  programId: number,
  workoutIds: number[]
): Promise<void> => {
  return apiRequest(
    `${baseUrl}/${programId}/program_workouts/destroy_multiple`,
    "DELETE",
    token,
    { ids: workoutIds }
  );
};

const addWorkoutToProgram = (
  token: string,
  dto: AddWorkoutDTO
): Promise<ProgramWorkout> => {
  const { programId, program_workout } = dto;
  const url = `${baseUrl}/${programId}/program_workouts`;

  const cleaned = Object.fromEntries(
    Object.entries(program_workout).filter(
      ([, v]) => v !== undefined
    )
  );

  return apiRequest(
    url,
    'POST',
    token,
    { program_workout: cleaned }
  );
}

const updateWorkout = (token: string, dto: UpdateWorkoutDTO): Promise<ProgramWorkout> => {
  const { programId, workoutId, program_workout } = dto;
  const url = `${baseUrl}/${programId}/program_workouts/${workoutId}`;

  const cleaned = Object.fromEntries(
    Object.entries(program_workout).filter(
      ([, v]) => v !== undefined
    )
  );

  return apiRequest(
    url,
    'PATCH',
    token,
    { program_workout: cleaned }
  );
};

const bulkCopyWorkoutsToProgram = (
  token: string,
  dto: BulkCopyWorkoutsDTO
): Promise<{ program: { id: number; num_weeks: number }, workouts: ProgramWorkout[] }> => {
  return apiRequest(
    `${baseUrl}/${dto.programId}/program_workouts/copy_workouts`,
    "POST",
    token,
    {
      workout_ids:  dto.workoutIds,
      target_week:  dto.targetWeek,
      target_day:   dto.targetDay,
    }
  );
};

export default {
  fetchPrograms,
  fetchProgram,
  addProgram,
  deleteProgram,
  updateProgramDetails,
  updateWorkoutPositions,
  bulkCopyWorkoutsToProgram,
  addTagToProgram,
  removeTagFromProgram,
  deleteWorkoutsFromProgram,
  addWorkoutToProgram,
  updateWorkout
};

import { AddProgramDTO, UpdateProgramDTO, Program, ProgramDetails, BulkReorderProgramWorkoutsDTO } from '../types';
import { apiRequest } from '../../core/api/api';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches/programs`;

const fetchPrograms = (token: string): Promise<Program[]> =>
  apiRequest(`${baseUrl}`, 'GET', token);

const fetchProgram = (
  token: string,
  programId: number,
): Promise<ProgramDetails> => apiRequest(`${baseUrl}/${programId}`, 'GET', token);

// TODO: Make sure number of weeks is on form and mandatory. Pass empty string default from component for description, or handle that in the backend
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

export const updateProgram = async (
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

export default {
  fetchPrograms,
  fetchProgram,
  addProgram,
  deleteProgram,
  updateProgram,
  updateWorkoutPositions,
  addTagToProgram,
  removeTagFromProgram,
};

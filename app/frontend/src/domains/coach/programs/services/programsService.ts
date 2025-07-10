import { AddCoachProgramDTO, UpdateCoachProgramDTO } from '../../core/types/dtos';
import { CoachProgram } from '../../core/types/models';
import { apiRequest } from '../../core/api/api';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches/programs`;

const fetchCoachPrograms = (token: string): Promise<CoachProgram[]> =>
  apiRequest(`${baseUrl}`, 'GET', token);

const fetchCoachProgram = (
  token: string,
  programId: number,
): Promise<CoachProgram> => apiRequest(`${baseUrl}/${programId}`, 'GET', token);

// TODO: Make sure number of weeks is on form and mandatory. Pass empty string default from component for description, or handle that in the backend
const addCoachProgram = (
  token: string,
  dto: AddCoachProgramDTO,
): Promise<CoachProgram> => {
  const body = {
    name: dto.programName,
    description: dto.programDescription,
    num_weeks: dto.num_weeks,
  };
  return apiRequest(baseUrl, 'POST', token, body);
};

export const deleteCoachProgram = async (token: string, programId: number) => {
  const url = `${baseUrl}/${programId}`;
  return apiRequest(url, 'DELETE', token);
};

export const updateCoachProgram = async (
  token: string,
  dto: UpdateCoachProgramDTO,
): Promise<CoachProgram> => {
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

const addTagToProgram = (
  token: string,
  programId: number,
  tagId: number,
): Promise<CoachProgram> =>
  apiRequest(`${baseUrl}/${programId}/add_tag/${tagId}`, 'POST', token);

const removeTagFromProgram = (
  token: string,
  programId: number,
  tagId: number,
): Promise<CoachProgram> =>
  apiRequest(`${baseUrl}/${programId}/remove_tag/${tagId}`, 'DELETE', token);

export default {
  fetchCoachPrograms,
  fetchCoachProgram,
  addCoachProgram,
  deleteCoachProgram,
  updateCoachProgram,
  addTagToProgram,
  removeTagFromProgram,
};

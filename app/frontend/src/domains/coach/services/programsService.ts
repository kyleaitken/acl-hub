import { AddCoachProgramDTO, UpdateCoachProgramDTO } from '../types/dtos';
import { CoachProgram } from '../types/models';
import { apiRequest } from './api';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches/programs`;

const fetchCoachPrograms = (token: string): Promise<CoachProgram[]> =>
  apiRequest(`${baseUrl}`, 'GET', token);

const fetchCoachProgram = (
  token: string,
  programId: number,
): Promise<CoachProgram> => apiRequest(`${baseUrl}/${programId}`, 'GET', token);

// export const fetchCoachPrograms = async (token: string) => {
//   const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/programs`;

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) throw new Error('Failed to fetch programs');

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log("Error fetching coach's programs: ", error);
//     throw error;
//   }
// };

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

// export const addCoachProgram = async (
//   token: string,
//   programName: string,
//   programDescription?: string,
//   num_weeks?: number,
// ) => {
//   const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/programs`;

//   const body = {
//     num_weeks: num_weeks || 1,
//     name: programName,
//     description: programDescription || '',
//   };

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) throw new Error('Failed to create new program');

//     const data = await response.json();
//     console.log('Return from add program: ', data);
//     return data;
//   } catch (error) {
//     console.log('Error creating new program: ', error);
//     throw error;
//   }
// };

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

export default {
  fetchCoachPrograms,
  fetchCoachProgram,
  addCoachProgram,
  deleteCoachProgram,
  updateCoachProgram,
};

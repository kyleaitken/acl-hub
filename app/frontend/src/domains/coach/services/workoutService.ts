import { apiRequest } from './api';
import {
  AddCommentDTO,
  DeleteCommentDTO,
  UpdateCommentDTO,
} from '../types/dtos';
import { UpdatedWorkout, WorkoutCommentResponse } from '../types/models';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients`;

const fetchTodayWorkouts = (token: string) =>
  apiRequest(`${baseUrl}/todayWorkouts`, 'GET', token);

const fetchUpdatedWorkouts = (token: string): Promise<UpdatedWorkout[]> =>
  apiRequest(`${baseUrl}/updates`, 'GET', token);

const addCommentToWorkout = (
  token: string,
  dto: AddCommentDTO,
): Promise<WorkoutCommentResponse> => {
  const { clientId, programId, workoutId, ...body } = dto;
  const url = `${baseUrl}/${clientId}/client_programs/${programId}/client_program_workouts/${workoutId}/workout_comments`;
  return apiRequest(url, 'POST', token, body);
};

const updateWorkoutComment = (
  token: string,
  dto: UpdateCommentDTO,
): Promise<WorkoutCommentResponse> => {
  const { clientId, programId, workoutId, commentId, ...body } = dto;
  const url = `${baseUrl}/${clientId}/client_programs/${programId}/client_program_workouts/${workoutId}/workout_comments/${commentId}`;
  return apiRequest(url, 'PUT', token, body);
};

const deleteWorkoutComment = (token: string, dto: DeleteCommentDTO) => {
  const { clientId, programId, workoutId, commentId } = dto;
  const url = `${baseUrl}/${clientId}/client_programs/${programId}/client_program_workouts/${workoutId}/workout_comments/${commentId}`;
  return apiRequest(url, 'DELETE', token);
};

export default {
  fetchTodayWorkouts,
  fetchUpdatedWorkouts,
  addCommentToWorkout,
  updateWorkoutComment,
  deleteWorkoutComment,
};

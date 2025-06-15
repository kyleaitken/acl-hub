import { createAsyncThunk } from '@reduxjs/toolkit';
import workoutsService from '../../services/workoutsService';
import { RootState } from '../../store';

export const fetchTodayWorkouts = createAsyncThunk(
  'clients/todayWorkouts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error('client is not authenticated');
      }

      const response = await workoutsService.fetchTodayWorkouts(token);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchUpdatedWorkouts = createAsyncThunk(
  'clients/updates',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error('client is not authenticated');
      }

      const response = await workoutsService.fetchUpdatedWorkouts(token);
      console.log('fetch updated workouts response: ', response);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  },
);

export const addCommentToWorkout = createAsyncThunk(
  'workouts/addCommentToWorkout',
  async (
    {
      token,
      clientId,
      programId,
      workoutId,
      comment,
    }: {
      token: string;
      clientId: number;
      programId: number;
      workoutId: number;
      comment: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const updatedWorkout = await workoutsService.addCommentToWorkout(
        token,
        clientId,
        programId,
        workoutId,
        comment,
      );
      console.log('updated workout in thunk: ', updatedWorkout);
      return updatedWorkout;
    } catch (error) {
      return rejectWithValue('Failed to add comment to workout');
    }
  },
);

export const updateWorkoutComment = createAsyncThunk(
  'workouts/updateWorkoutComment',
  async (
    {
      token,
      commentId,
      clientId,
      programId,
      workoutId,
      comment,
    }: {
      token: string;
      commentId: number;
      clientId: number;
      programId: number;
      workoutId: number;
      comment: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const updatedWorkoutComment = await workoutsService.updateWorkoutComment(
        token,
        commentId,
        clientId,
        programId,
        workoutId,
        comment,
      );
      console.log('updated workout comment in thunk: ', updatedWorkoutComment);
      return updatedWorkoutComment;
    } catch (error) {
      return rejectWithValue('Failed to add comment to workout');
    }
  },
);

export const deleteWorkoutComment = createAsyncThunk(
  'workouts/deleteWorkoutComment',
  async (
    {
      token,
      commentId,
      clientId,
      programId,
      workoutId,
    }: {
      token: string;
      commentId: number;
      clientId: number;
      programId: number;
      workoutId: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const deletedWorkoutComment = await workoutsService.deleteWorkoutComment(
        token,
        commentId,
        clientId,
        programId,
        workoutId,
      );
      console.log('updated workout comment in thunk: ', deleteWorkoutComment);
      return {
        ...deletedWorkoutComment,
        id: commentId,
        client_program_workout_id: workoutId,
      };
    } catch (error) {
      return rejectWithValue('Failed to add comment to workout');
    }
  },
);

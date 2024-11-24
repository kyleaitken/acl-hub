import { createAsyncThunk } from "@reduxjs/toolkit";
import workoutsService from "../../services/workoutsService";
import { RootState } from "../../store";


export const fetchTodayWorkouts = createAsyncThunk(
  "users/todayWorkouts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState; 
      const token = state.auth.token; 

      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await workoutsService.fetchTodayWorkouts(token);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUpdatedWorkouts = createAsyncThunk(
    'users/updates',
    async (_, { getState, rejectWithValue }) => {
      try {
        const state = getState() as RootState; 
        const token = state.auth.token; 
  
        if (!token) {
          throw new Error("User is not authenticated");
        }

        const response = await workoutsService.fetchUpdatedWorkouts(token);
        console.log("fetch updated workouts response: ", response)
        return response
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
        return rejectWithValue(errorMessage);
      }
    }
);


export const addCommentToWorkout = createAsyncThunk(
  'workouts/addCommentToWorkout',
  async (
      { token, userId, programId, workoutId, comment }: 
      { token: string; userId: number; programId: number; workoutId: number; comment: string },
      { rejectWithValue }
  ) => {
      try {
          const updatedWorkout = await workoutsService.addCommentToWorkout(
              token,
              userId,
              programId,
              workoutId,
              comment
          );
          console.log("updated workout in thunk: ", updatedWorkout)
          return updatedWorkout;
      } catch (error) {
          return rejectWithValue('Failed to add comment to workout');
      }
  }
);


export const updateWorkoutComment = createAsyncThunk(
  'workouts/updateWorkoutComment',
  async (
      { token, commentId, userId, programId, workoutId, comment }: 
      { token: string; commentId: number, userId: number; programId: number; workoutId: number; comment: string },
      { rejectWithValue }
  ) => {
      try {
          const updatedWorkoutComment = await workoutsService.updateWorkoutComment(
              token,
              commentId,
              userId,
              programId,
              workoutId,
              comment
          );
          console.log("updated workout comment in thunk: ", updatedWorkoutComment)
          return updatedWorkoutComment;
      } catch (error) {
          return rejectWithValue('Failed to add comment to workout');
      }
  }
);



export const deleteWorkoutComment = createAsyncThunk(
  'workouts/deleteWorkoutComment',
  async (
      { token, commentId, userId, programId, workoutId }: 
      { token: string; commentId: number, userId: number; programId: number; workoutId: number; },
      { rejectWithValue }
  ) => {
      try {
          const deletedWorkoutComment = await workoutsService.deleteWorkoutComment(
              token,
              commentId,
              userId,
              programId,
              workoutId,
          );
          console.log("updated workout comment in thunk: ", deleteWorkoutComment)
          return {
            ...deletedWorkoutComment,
            id: commentId,
            user_program_workout_id: workoutId,
          };      
        } catch (error) {
          return rejectWithValue('Failed to add comment to workout');
      }
  }
);
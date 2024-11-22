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
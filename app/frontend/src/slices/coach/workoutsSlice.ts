import { createSlice } from '@reduxjs/toolkit';
import { UpdatedWorkout, TodayWorkout } from '../../types/types';
import { fetchTodayWorkouts, fetchUpdatedWorkouts } from '../thunks/workoutThunks';

interface WorkoutsState {
    todaysWorkouts: TodayWorkout[];
    updatedWorkouts: UpdatedWorkout[];
    loading: boolean;
    error?: string;
}

const initialState: WorkoutsState = {
    todaysWorkouts: [],
    updatedWorkouts: [],
    loading: false,
    error: undefined
}

const workoutSlice = createSlice({
    name: 'workouts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodayWorkouts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTodayWorkouts.fulfilled, (state, action) => {
                state.todaysWorkouts = action.payload;
                state.loading = false;
            })
            .addCase(fetchTodayWorkouts.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
        builder
            .addCase(fetchUpdatedWorkouts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUpdatedWorkouts.fulfilled, (state, action) => {
                state.updatedWorkouts = action.payload;
                state.loading = false;
            })
            .addCase(fetchUpdatedWorkouts.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });  
    },
});


export default workoutSlice.reducer;
export const { } = workoutSlice.actions;
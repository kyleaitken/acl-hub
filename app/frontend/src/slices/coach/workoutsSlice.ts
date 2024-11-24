import { createSlice } from '@reduxjs/toolkit';
import { UpdatedWorkout, TodayWorkout } from '../../types/types';
import { fetchTodayWorkouts, fetchUpdatedWorkouts, addCommentToWorkout, updateWorkoutComment, deleteWorkoutComment } from '../thunks/workoutThunks';

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
        builder
            .addCase(addCommentToWorkout.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCommentToWorkout.fulfilled, (state, action) => {
                state.loading = false;
                const workoutIndex = state.updatedWorkouts.findIndex(
                    (updatedWorkout) => updatedWorkout.workout.id === action.payload.user_program_workout_id
                );
                if (workoutIndex !== -1) {
                    state.updatedWorkouts[workoutIndex].workout.comments.push({
                        id: action.payload.id,
                        content: action.payload.content,
                        timestamp: action.payload.timestamp,
                        user_type: action.payload.user_type,
                    });
                }
            })
            .addCase(addCommentToWorkout.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            }); 
        builder
            .addCase(updateWorkoutComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateWorkoutComment.fulfilled, (state, action) => {
                state.loading = false;
                const workoutIndex = state.updatedWorkouts.findIndex(
                    (updatedWorkout) => updatedWorkout.workout.id === action.payload.user_program_workout_id
                );
                const comments = state.updatedWorkouts[workoutIndex].workout.comments;
                const commentIndex = comments.findIndex(
                    (comment) => comment.id === action.payload.id
                );

                if (commentIndex !== -1) {
                    comments[commentIndex] = {
                        ...comments[commentIndex], 
                        content: action.payload.content, 
                    };
                }
            })
            .addCase(updateWorkoutComment.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            }); 
        builder
            .addCase(deleteWorkoutComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteWorkoutComment.fulfilled, (state, action) => {
                state.loading = false;
                const workoutIndex = state.updatedWorkouts.findIndex(
                    (updatedWorkout) => updatedWorkout.workout.id === action.payload.user_program_workout_id
                );
                const comments = state.updatedWorkouts[workoutIndex].workout.comments;
                state.updatedWorkouts[workoutIndex].workout.comments = comments.filter(
                    (comment) => comment.id !== action.payload.id
                );
            })
            .addCase(deleteWorkoutComment.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            }); 
    },
});


export default workoutSlice.reducer;
export const { } = workoutSlice.actions;
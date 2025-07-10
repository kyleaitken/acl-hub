import { create } from 'zustand';
import workoutService from '../services/workoutService';
import { TodayWorkout, UpdatedWorkout, WorkoutComment } from '../../core/types/models';
import {
  AddCommentDTO,
  UpdateCommentDTO,
  DeleteCommentDTO,
} from '../../core/types/dtos';

interface CoachWorkoutStore {
  todayWorkouts: TodayWorkout[];
  updatedWorkouts: UpdatedWorkout[];
  updatedWorkoutComments: { [workoutId: number]: WorkoutComment[] };
  todayLastFetchedAt?: number;
  updatedLastFetchedAt?: number;
  loading: boolean;
  error?: string;

  fetchTodayWorkouts: (token: string) => Promise<void>;
  fetchUpdatedWorkouts: (token: string) => Promise<void>;
  addCommentToWorkout: (
    token: string,
    commentData: AddCommentDTO,
  ) => Promise<void>;
  updateWorkoutComment: (
    token: string,
    commentData: UpdateCommentDTO,
  ) => Promise<void>;
  deleteWorkoutComment: (
    token: string,
    commentData: DeleteCommentDTO,
  ) => Promise<void>;
}

export const useCoachWorkoutStore = create<CoachWorkoutStore>((set) => ({
  todayWorkouts: [],
  updatedWorkouts: [],
  updatedWorkoutComments: {},
  loading: false,
  error: undefined,

  fetchTodayWorkouts: async (token: string) => {
    set({ loading: true });
    try {
      const data = await workoutService.fetchTodayWorkouts(token);
      set({
        todayWorkouts: data,
        loading: false,
        todayLastFetchedAt: Date.now(),
      });
    } catch (err) {
      set({ error: "Failed to fetch today's workouts", loading: false });
    }
  },

  fetchUpdatedWorkouts: async (token: string) => {
    set({ loading: true });
    try {
      const workouts = await workoutService.fetchUpdatedWorkouts(token);

      const updatedWorkoutComments: CoachWorkoutStore['updatedWorkoutComments'] =
        {};

      const normalizedWorkouts = workouts.map((w) => {
        updatedWorkoutComments[w.workout.id] = w.workout.comments;
        return {
          ...w,
          workout: {
            ...w.workout,
            comments: [], // strip them out for the main workout object
          },
        };
      });

      set({
        updatedWorkouts: normalizedWorkouts,
        updatedWorkoutComments: updatedWorkoutComments,
        loading: false,
        updatedLastFetchedAt: Date.now(),
      });
    } catch (err) {
      set({ error: 'Failed to fetch updated workouts', loading: false });
    }
  },

  addCommentToWorkout: async (token: string, commentData: AddCommentDTO) => {
    try {
      const newComment = await workoutService.addCommentToWorkout(
        token,
        commentData,
      );

      set((state) => {
        const existing =
          state.updatedWorkoutComments[commentData.workoutId] || [];
        return {
          updatedWorkoutComments: {
            ...state.updatedWorkoutComments,
            [commentData.workoutId]: [
              ...existing,
              {
                id: newComment.id,
                content: newComment.content,
                user_type: newComment.user_type,
                timestamp: newComment.timestamp,
              },
            ],
          },
        };
      });
    } catch (err) {
      set({ error: 'Failed to add comment to workout' });
    }
  },

  updateWorkoutComment: async (
    token: string,
    commentData: UpdateCommentDTO,
  ) => {
    try {
      const updated = await workoutService.updateWorkoutComment(
        token,
        commentData,
      );

      set((state) => {
        const workoutId = commentData.workoutId;
        const comments = state.updatedWorkoutComments[workoutId] || [];

        return {
          updatedWorkoutComments: {
            ...state.updatedWorkoutComments,
            [workoutId]: comments.map((c) =>
              c.id === updated.id ? { ...c, content: updated.content } : c,
            ),
          },
        };
      });
    } catch (err) {
      set({ error: 'Failed to update workout comment' });
    }
  },

  deleteWorkoutComment: async (
    token: string,
    commentData: DeleteCommentDTO,
  ) => {
    try {
      await workoutService.deleteWorkoutComment(token, commentData);

      set((state) => {
        const comments =
          state.updatedWorkoutComments[commentData.workoutId] || [];

        return {
          updatedWorkoutComments: {
            ...state.updatedWorkoutComments,
            [commentData.workoutId]: comments.filter(
              (c) => c.id !== commentData.commentId,
            ),
          },
        };
      });
    } catch (err) {
      set({ error: 'Failed to delete workout comment' });
    }
  },

  resetError: () => set({ error: undefined }),
}));

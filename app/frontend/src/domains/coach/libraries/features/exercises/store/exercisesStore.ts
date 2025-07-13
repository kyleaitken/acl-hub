import { create } from 'zustand';
import exercisesService from '../services/exercisesService';
import { Exercise, AddExerciseDTO, UpdateExerciseDTO } from '../types';

interface ExercisesStore {
  exercises: Record<number, Exercise>;
  loading: boolean;
  error?: string;
  page: number;
  hasMore: boolean;

  fetchExercises: (token: string, page: number) => Promise<void>;
  fetchExerciseById: (token: string, exerciseId: number) => Promise<void>;
  updateExercise: (
    token: string,
    exerciseData: UpdateExerciseDTO,
  ) => Promise<void>;
  deleteExercise: (token: string, exerciseId: number) => Promise<void>;
  addExercise: (token: string, exerciseData: AddExerciseDTO) => Promise<void>;

  setError: (message: string) => void;
  resetError: () => void;
}

export const useExercisesStore = create<ExercisesStore>((set) => ({
  exercises: {},
  loading: false,
  error: undefined,
  page: 1,
  hasMore: true,

  fetchExercises: async (token: string, page: number) => {
    set({ loading: true });
    try {
      const response = await exercisesService.fetchExercises(token, page);
      const { data, pagination } = response;  

      const normalized = Object.fromEntries(
        data.map((exercise: Exercise) => [exercise.id, exercise])
      );

      set((state) => ({
        exercises: {
          ...state.exercises,
          ...normalized,
        },
        page: pagination.page,
        hasMore: pagination.has_more,
        loading: false,
      }));
    } catch (err) {
      set({ error: "Failed to fetch coach's programs", loading: false });
    }
  },
  fetchExerciseById: async (token: string, exerciseId: number) => {
    set({ loading: true });
    try {
      const exercise = await exercisesService.fetchExercise(token, exerciseId);
      set((state) => ({
        exercises: { ...state.exercises, [exerciseId]: exercise },
      }));
    } catch (err) {
      set({
        error: `Failed to fetch exercise with id: ${exerciseId}`,
        loading: false,
      });
    }
  },
  updateExercise: async (token: string, exerciseData: UpdateExerciseDTO) => {
    set({ loading: true });
    const { exerciseId } = exerciseData;
    try {
      const updatedExercise = await exercisesService.updateExercise(
        token,
        exerciseData,
      );
      set((state) => {
        const existing = state.exercises[exerciseId];
        return {
          programs: {
            ...state.exercises,
            [exerciseId]: {
              ...existing,
              ...updatedExercise,
              images: existing?.images ?? [],
            },
          },
          loading: false,
        };
      });
    } catch (err) {
      set({
        error: `Failed to update exercise with id: ${exerciseId}`,
        loading: false,
      });
    }
  },
  deleteExercise: async (token: string, exerciseId: number) => {
    set({ loading: true });
    try {
      await exercisesService.deleteExercse(token, exerciseId);
      set((state) => {
        const { [exerciseId]: _, ...rest } = state.exercises;
        return { exercises: rest };
      });
    } catch (err) {
      set({
        error: `Failed to delete exercise with id: ${exerciseId}`,
        loading: false,
      });
    }
  },
  addExercise: async (token: string, exerciseData: AddExerciseDTO) => {
    set({ loading: true });
    try {
      const newExercise = await exercisesService.addExercise(
        token,
        exerciseData,
      );

      // add empty tags collection to new program
      const normalizedExercise: Exercise = {
        ...newExercise,
        images: newExercise.images ?? [],
      };

      set((state) => ({
        exercises: { 
          ...state.exercises, 
          [newExercise.id]: normalizedExercise 

        },
      }));
    } catch (err) {
      set({ error: `Failed to add new exercise`, loading: false });
    }
  },

  setError: (message) => set({ error: message }),
  resetError: () => set({ error: undefined }),
}));

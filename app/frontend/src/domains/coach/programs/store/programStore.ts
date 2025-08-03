import { BulkCopyWorkoutsDTO, ProgramWorkout } from './../types';
import { create } from 'zustand';
import programsService from '../services/programsService';
import { Program, AddProgramDTO, UpdateProgramDTO, ProgramDetails, BulkReorderProgramWorkoutsDTO, AddWorkoutDTO, UpdateWorkoutDTO } from '../types';

interface ProgramStore {
  programs: Record<number, Program>;
  detailedPrograms: Record<number, ProgramDetails>;
  copiedWorkoutIds: number[];
  selectedWorkoutIds: number[];

  isEditingWorkout: boolean;
  loading: boolean;
  error?: string;

  fetchPrograms: (token: string) => Promise<void>;
  fetchProgram: (token: string, programId: number) => Promise<void>;
  updateProgramDetails: (
    token: string,
    programData: UpdateProgramDTO,
  ) => Promise<void>;
  updateWorkoutPositions: (token: string, programData: BulkReorderProgramWorkoutsDTO) => Promise<void>;
  deleteProgram: (token: string, programId: number) => Promise<void>;
  addProgram: (token: string, programData: AddProgramDTO) => Promise<void>;
  addTagToProgram: (
    token: string,
    programId: number,
    tagId: number,
  ) => Promise<void>;
  removeTagFromProgram: (
    token: string,
    programId: number,
    tagId: number,
  ) => Promise<void>;
  bulkCopyWorkoutsToProgram: (token: string, workoutsData: BulkCopyWorkoutsDTO) => Promise<{ program: { id: number; num_weeks: number }, workouts: ProgramWorkout[] }>;
  setCopiedWorkoutIds: (workoutIds: number[]) => void;
  setSelectedWorkoutIds: (workoutIds: number[]) => void;
  addWorkoutToProgram: (token: string, workoutData: AddWorkoutDTO) => Promise<void>;
  deleteWorkoutsFromProgram: (token: string, programId: number, workoutIds: number[]) => Promise<void>;
  updateWorkout: (workoutData: UpdateWorkoutDTO) => Promise<void>;

  setIsEditingWorkout: (flag: boolean) => void;
  setError: (message: string) => void;
  resetError: () => void;
}

export const useProgramStore = create<ProgramStore>((set) => ({
  programs: {},
  detailedPrograms: {},
  selectedWorkoutIds: [],
  loading: false,
  error: undefined,
  copiedWorkoutIds: [],
  isEditingWorkout: false,

  fetchPrograms: async (token: string) => {
    set({ loading: true });
    try {
      const list = await programsService.fetchPrograms(token);
      const normalized = Object.fromEntries(list.map((p) => [p.id, p]));
      set({ programs: normalized, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch coach's programs", loading: false });
    }
  },
  fetchProgram: async (token: string, programId: number) => {
    set({ loading: true });
    try {
      const program = await programsService.fetchProgram(token, programId);
      set((state) => ({
        detailedPrograms: { 
          ...state.detailedPrograms, 
          [programId]: program 
        },
        loading: false
      }));
    } catch (err) {
      set({
        error: `Failed to fetch program with id: ${programId}`,
        loading: false,
      });
    }
  },
  updateProgramDetails: async (token: string, programData: UpdateProgramDTO) => {
    set({ loading: true });
    const { programId } = programData;
    try {
      const updatedProgram = await programsService.updateProgramDetails(
        token,
        programData,
      );
      set((state) => {
        const existingBasic = state.programs[programId];
        const existingDetail  = state.detailedPrograms[programData.programId] || {}

        return {
          programs: {
            ...state.programs,
            [programId]: {
              ...existingBasic,
              ...updatedProgram,
              tags: existingBasic?.tags ?? [],
            },
          },
          detailedPrograms: {
            ...state.detailedPrograms,
            [programData.programId]: {
              ...existingDetail,
              ...updatedProgram,
            }
          },
          loading: false,
        };
      });
    } catch (err) {
      set({
        error: `Failed to update program with id: ${programId}`,
        loading: false,
      });
    }
  },
  updateWorkoutPositions: async (token: string, programData: BulkReorderProgramWorkoutsDTO) => {
    set({ loading: true });
    const { programId } = programData;
    try {
      const updatedProgram = await programsService.updateWorkoutPositions(token, programData);
      set((state) => {
        const existingProgram = state.detailedPrograms[programId];
        return {
          detailedPrograms: {
            ...state.detailedPrograms,
            [programId]: {
              ...existingProgram,
              ...updatedProgram,
              tags: existingProgram?.tags ?? [],
            },
          },
          loading: false,
        };
      });
    } catch (err) {
      set({
        error: `Failed to bulk update program with id: ${programId}`,
        loading: false,
      });
    }
  },
  deleteProgram: async (token: string, programId: number) => {
    set({ loading: true });
    try {
      await programsService.deleteProgram(token, programId);
      set((state) => {
        const { [programId]: _, ...rest } = state.programs;
        return { programs: rest };
      });
    } catch (err) {
      set({
        error: `Failed to delete program with id: ${programId}`,
        loading: false,
      });
    }
  },
  addProgram: async (token: string, programData: AddProgramDTO) => {
    set({ loading: true });
    try {
      const newProgram = await programsService.addProgram(
        token,
        programData,
      );

      // add empty tags collection to new program
      const normalizedProgram: Program = {
        ...newProgram,
        tags: newProgram.tags ?? [],
      };

      set((state) => ({
        programs: { 
          ...state.programs, 
          [newProgram.id]: normalizedProgram 

        },
      }));
    } catch (err) {
      set({ error: `Failed to add new program`, loading: false });
    }
  },
  addTagToProgram: async (token: string, programId: number, tagId: number) => {
    try {
      const updated = await programsService.addTagToProgram(
        token,
        programId,
        tagId,
      );
      set((state) => ({
        programs: { ...state.programs, [programId]: updated },
      }));
    } catch (err) {
      set({ error: 'Failed to add tag to program' });
    }
  },

  removeTagFromProgram: async (
    token: string,
    programId: number,
    tagId: number,
  ) => {
    try {
      const updated = await programsService.removeTagFromProgram(
        token,
        programId,
        tagId,
      );
      set((state) => ({
        programs: { ...state.programs, [programId]: updated },
      }));
    } catch (err) {
      set({ error: 'Failed to remove tag from program' });
    }
  },
  addWorkoutToProgram: async (
    token: string,
    workoutData: AddWorkoutDTO
  ) => {
    set({ loading: true });
    try {
      const programId = workoutData.programId;
      const newWorkout = await programsService.addWorkoutToProgram(token, workoutData);

      set((state) => {
        const detailed = state.detailedPrograms[programId]!
        return {
          detailedPrograms: {
            ...state.detailedPrograms,
            [programId]: {
              ...detailed,
              program_workouts: [...detailed.program_workouts, newWorkout],
            },
          },
          loading: false,
        }
      })
  
    } catch (err) {
      set({ loading: false, error: (err as Error).message })
      throw err
    }
  },
  bulkCopyWorkoutsToProgram: async (
    token: string,
    workoutsData: BulkCopyWorkoutsDTO
  ): Promise<{ program: { id: number; num_weeks: number }, workouts: ProgramWorkout[] }> => {
    set({ loading: true });
    try {
      const response = await programsService.bulkCopyWorkoutsToProgram(token, workoutsData);
      set((state) => {
        const prog = state.detailedPrograms[workoutsData.programId]!;
        return {
          detailedPrograms: {
            ...state.detailedPrograms,
            [workoutsData.programId]: {
              ...prog,
              num_weeks: response.program.num_weeks,
              program_workouts: [
                ...prog.program_workouts,
                ...response.workouts,
              ],
            },
          },
          loading: false,
        };
      });
      return response;
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
      throw err;
    }
  },
  deleteWorkoutsFromProgram: async (
    token: string,
    programId: number,
    workoutIds: number[]
  ) => {
    set({ loading: true });
    try {
      await programsService.deleteWorkoutsFromProgram(token, programId, workoutIds);
      set((state) => {
        const prog = state.detailedPrograms[programId];
        return {
          detailedPrograms: {
            ...state.detailedPrograms,
            [programId]: {
              ...prog,
              program_workouts: prog.program_workouts.filter((w) => !workoutIds.includes(w.id)) 
            }
          },
          loading: false
        }
      })
    } catch (err) {
      set({ error: "Failed to delete workouts", loading: false });
    }
  },
  updateWorkout: async () => {

  },
  setIsEditingWorkout: (flag) => set({isEditingWorkout: flag}),
  setCopiedWorkoutIds: (workoutIds) => set({ copiedWorkoutIds: workoutIds }),
  setSelectedWorkoutIds: (workoutIds) => set({ selectedWorkoutIds: workoutIds }),
  setError: (message) => set({ error: message }),
  resetError: () => set({ error: undefined }),
}));

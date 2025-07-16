import { create } from 'zustand';
import programsService from '../services/programsService';
import { Program, AddProgramDTO, UpdateProgramDTO, ProgramDetails, BulkReorderProgramWorkoutsDTO } from '../types';

interface ProgramStore {
  programs: Record<number, Program>;
  detailedPrograms: Record<number, ProgramDetails>;
  loading: boolean;
  error?: string;

  fetchPrograms: (token: string) => Promise<void>;
  fetchProgram: (token: string, programId: number) => Promise<void>;
  updateProgram: (
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

  setError: (message: string) => void;
  resetError: () => void;
}

export const useProgramStore = create<ProgramStore>((set) => ({
  programs: {},
  detailedPrograms: {},
  loading: false,
  error: undefined,

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
  updateProgram: async (token: string, programData: UpdateProgramDTO) => {
    set({ loading: true });
    const { programId } = programData;
    try {
      const updatedProgram = await programsService.updateProgram(
        token,
        programData,
      );
      set((state) => {
        const existing = state.programs[programId];
        return {
          programs: {
            ...state.programs,
            [programId]: {
              ...existing,
              ...updatedProgram,
              tags: existing?.tags ?? [],
            },
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
  setError: (message) => set({ error: message }),
  resetError: () => set({ error: undefined }),
}));

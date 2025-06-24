import { create } from 'zustand';
import programsService from '../services/programsService';
import { CoachProgram } from '../types/models';
import { AddCoachProgramDTO, UpdateCoachProgramDTO } from '../types/dtos';

interface CoachProgramStore {
  programs: Record<number, CoachProgram>;
  loading: boolean;
  error?: string;

  fetchPrograms: (token: string) => Promise<void>;
  fetchProgramById: (token: string, programId: number) => Promise<void>;
  updateProgram: (
    token: string,
    programData: UpdateCoachProgramDTO,
  ) => Promise<void>;
  deleteProgram: (token: string, programId: number) => Promise<void>;
  addProgram: (token: string, programData: AddCoachProgramDTO) => Promise<void>;
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

export const useCoachProgramStore = create<CoachProgramStore>((set) => ({
  programs: {},
  loading: false,
  error: undefined,

  fetchPrograms: async (token: string) => {
    set({ loading: true });
    try {
      const list = await programsService.fetchCoachPrograms(token);
      const normalized = Object.fromEntries(list.map((p) => [p.id, p]));
      set({ programs: normalized, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch coach's programs", loading: false });
    }
  },
  fetchProgramById: async (token: string, programId: number) => {
    set({ loading: true });
    try {
      const program = await programsService.fetchCoachProgram(token, programId);
      set((state) => ({
        programs: { ...state.programs, [programId]: program },
      }));
    } catch (err) {
      set({
        error: `Failed to fetch program with id: ${programId}`,
        loading: false,
      });
    }
  },
  updateProgram: async (token: string, programData: UpdateCoachProgramDTO) => {
    set({ loading: true });
    const { programId } = programData;
    try {
      const updatedProgram = await programsService.updateCoachProgram(
        token,
        programData,
      );
      set((state) => ({
        programs: { ...state.programs, [programId]: updatedProgram },
      }));
    } catch (err) {
      set({
        error: `Failed to update program with id: ${programId}`,
        loading: false,
      });
    }
  },
  deleteProgram: async (token: string, programId: number) => {
    set({ loading: true });
    try {
      await programsService.deleteCoachProgram(token, programId);
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
  addProgram: async (token: string, programData: AddCoachProgramDTO) => {
    set({ loading: true });
    console.log(programData);
    try {
      const newProgram = await programsService.addCoachProgram(
        token,
        programData,
      );
      set((state) => ({
        programs: { ...state.programs, [newProgram.id]: newProgram },
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

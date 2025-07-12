import { Warmup, AddWarmupDTO, UpdateWarmupDTO } from './../types';
import { create } from 'zustand';
import warmupsService from '../services/warmupsService';

interface WarmupsStore {
  warmups: Record<number, Warmup>;
  loading: boolean;
  error?: string;

  fetchWarmups: (token: string) => Promise<void>;
  fetchWarmup: (token: string, warmupId: number) => Promise<void>;
  updateWarmup: (
    token: string,
    warmupData: UpdateWarmupDTO,
  ) => Promise<void>;
  deleteWarmup: (token: string, warmupId: number) => Promise<void>;
  addWarmup: (token: string, warmupData: AddWarmupDTO) => Promise<void>;

  setError: (message: string) => void;
  resetError: () => void;
}

export const useWarmupsStore = create<WarmupsStore>((set) => ({
  warmups: {},
  loading: false,
  error: undefined,

  fetchWarmups: async (token: string) => {
    set({ loading: true });
    try {
      const warmups = await warmupsService.fetchWarmups(token);

      const normalized = Object.fromEntries(
        warmups.map((raw: any) => {
          const warmup = normalizeWarmup(raw);
          return [warmup.id, warmup];
        })
      );

      set((state) => ({
        warmups: {
          ...state.warmups,
          ...normalized,
        },
        loading: false,
      }));
    } catch (err) {
      set({ error: "Failed to fetch coach's warmups", loading: false });
    }
  },
  fetchWarmup: async (token: string, warmupId: number) => {
    set({ loading: true });
    try {
      const rawWarmup = await warmupsService.fetchWarmup(token, warmupId);
      const warmup = normalizeWarmup(rawWarmup);
      
      set((state) => ({
        warmups: { ...state.warmups, [warmupId]: warmup },
        loading: false,
      }));
    } catch (err) {
      set({
        error: `Failed to fetch exercise with id: ${warmupId}`,
        loading: false,
      });
    }
  },
  updateWarmup: async (token: string, warmupData: UpdateWarmupDTO) => {
    set({ loading: true });
    const { warmupId } = warmupData;
    try {
      const updatedWarmup = await warmupsService.updateWarmup(
        token,
        warmupData,
      );
      set((state) => {
        const existing = state.warmups[warmupId];
        return {
          warmups: {
            ...state.warmups,
            [warmupId]: {
              ...existing,
              ...updatedWarmup,
            },
          },
          loading: false,
        };
      });
    } catch (err) {
      set({
        error: `Failed to update exercise with id: ${warmupId}`,
        loading: false,
      });
    }
  },
  deleteWarmup: async (token: string, warmupId: number) => {
    set({ loading: true });
    try {
      await warmupsService.deleteWarmup(token, warmupId);
      set((state) => {
        const { [warmupId]: _, ...rest } = state.warmups;
        return { warmups: rest };
      });
    } catch (err) {
      set({
        error: `Failed to delete exercise with id: ${warmupId}`,
        loading: false,
      });
    }
  },
  addWarmup: async (token: string, warmupData: AddWarmupDTO) => {
    set({ loading: true });
    try {
      const newWarmup = await warmupsService.addWarmup(
        token,
        warmupData,
      );

      set((state) => ({
        warmups: { 
          ...state.warmups, 
          [newWarmup.id]: newWarmup 
        },
        loading: false,
      }));
    } catch (err) {
      set({ error: `Failed to add new warmup`, loading: false });
    }
  },

  setError: (message) => set({ error: message }),
  resetError: () => set({ error: undefined }),
}));


const normalizeWarmup = (raw: any): Warmup => ({
  id: raw.id,
  name: raw.name,
  instructions: raw.instructions,
  exerciseIds: raw.exercise_ids, // map here
});
import { LibraryRoutine, AddWarmupCooldownDTO, UpdateWarmupCooldownDTO, DetailedRoutine } from '../types';
import { create } from 'zustand';
import warmupsService from '../services/warmupsService';

interface WarmupsStore {
  warmups: Record<number, LibraryRoutine>;
  detailedWarmups: Record<number, DetailedRoutine>;
  loading: boolean;
  error?: string;

  fetchWarmups: (token: string) => Promise<LibraryRoutine[]>;
  fetchWarmup: (token: string, warmupId: number) => Promise<void>;
  fetchDetailedWarmup: (token: string, warmupId: number) => Promise<DetailedRoutine>;
  updateWarmup: (
    token: string,
    warmupData: UpdateWarmupCooldownDTO,
  ) => Promise<void>;
  deleteWarmup: (token: string, warmupId: number) => Promise<void>;
  addWarmup: (token: string, warmupData: AddWarmupCooldownDTO) => Promise<LibraryRoutine>;

  setError: (message: string) => void;
  resetError: () => void;
}

export const useWarmupsStore = create<WarmupsStore>((set, get) => ({
  warmups: {},
  detailedWarmups: {},
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
      return Object.values(normalized);
    } catch (err) {
      set({ error: "Failed to fetch coach's warmups", loading: false });
      return [];
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
        error: `Failed to fetch warmup with id: ${warmupId}`,
        loading: false,
      });
    }
  },
  fetchDetailedWarmup: async (token: string, warmupId: number) => {
    const state = get();
    const cached = state.detailedWarmups[warmupId];
    if (cached) {
      return cached;
    }
    
    set({ loading: true });
    try {
      const warmup = await warmupsService.fetchDetailedWarmup(token, warmupId);
      set((state) => ({
        detailedWarmups: { ...state.detailedWarmups, [warmupId]: warmup },
        loading: false,
      }));
      return warmup;
    } catch (err) {
      set({
        error: `Failed to fetch warmup with id: ${warmupId}`,
        loading: false,
      });
      throw (err);
    }
  },
  updateWarmup: async (token: string, warmupData: UpdateWarmupCooldownDTO) => {
    set({ loading: true });
    const { id } = warmupData;
    try {
      const updatedWarmup = await warmupsService.updateWarmup(
        token,
        warmupData,
      );
      set((state) => {
        const existing = state.warmups[id];
        return {
          warmups: {
            ...state.warmups,
            [id]: {
              ...existing,
              ...updatedWarmup,
            },
          },
          loading: false,
        };
      });
    } catch (err) {
      set({
        error: `Failed to update warmup with id: ${id}`,
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
        error: `Failed to delete warmup with id: ${warmupId}`,
        loading: false,
      });
    }
  },
  addWarmup: async (token: string, warmupData: AddWarmupCooldownDTO) => {
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
      return newWarmup;
    } catch (err) {
      set({ error: `Failed to add new warmup`, loading: false });
      throw(err);
    }
  },

  setError: (message) => set({ error: message }),
  resetError: () => set({ error: undefined }),
}));


const normalizeWarmup = (raw: any): LibraryRoutine => ({
  id: raw.id,
  name: raw.name,
  instructions: raw.instructions,
  exerciseIds: raw.exercise_ids,
  custom: raw.custom
});
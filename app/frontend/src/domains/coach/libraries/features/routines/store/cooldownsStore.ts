import { LibraryRoutine, AddWarmupCooldownDTO, UpdateWarmupCooldownDTO, DetailedRoutine } from '../types';
import { create } from 'zustand';
import cooldownsService from '../services/cooldownsService';

interface CooldownsStore {
  cooldowns: Record<number, LibraryRoutine>;
  detailedCooldowns: Record<number, DetailedRoutine>;
  loading: boolean;
  error?: string;

  fetchCooldowns: (token: string) => Promise<LibraryRoutine[]>;
  fetchCooldown: (token: string, cooldownId: number) => Promise<void>;
  fetchDetailedCooldown: (token: string, cooldownId: number) => Promise<DetailedRoutine>;
  updateCooldown: (
    token: string,
    cooldownData: UpdateWarmupCooldownDTO,
  ) => Promise<void>;
  deleteCooldown: (token: string, cooldownId: number) => Promise<void>;
  addCooldown: (token: string, cooldownData: AddWarmupCooldownDTO) => Promise<LibraryRoutine>;

  setError: (message: string) => void;
  resetError: () => void;
}

export const useCooldownsStore = create<CooldownsStore>((set, get) => ({
  cooldowns: {},
  detailedCooldowns: {},
  loading: false,
  error: undefined,

  fetchCooldowns: async (token: string) => {
    set({ loading: true });
    try {
      const cooldowns = await cooldownsService.fetchCooldowns(token);

      const normalized = Object.fromEntries(
        cooldowns.map((raw: any) => {
          const cooldown = normalizeCooldown(raw);
          return [cooldown.id, cooldown];
        })
      );

      set((state) => ({
        cooldowns: {
          ...state.cooldowns,
          ...normalized,
        },
        loading: false,
      }));
      return Object.values(normalized);
    } catch (err) {
      set({ error: "Failed to fetch coach's cooldowns", loading: false });
      return [];
    }
  },
  fetchCooldown: async (token: string, cooldownId: number) => {
    set({ loading: true });
    try {
      const rawCooldown = await cooldownsService.fetchCooldown(token, cooldownId);
      const cooldown = normalizeCooldown(rawCooldown);
      
      set((state) => ({
        cooldowns: { ...state.cooldowns, [cooldownId]: cooldown },
        loading: false,
      }));
    } catch (err) {
      set({
        error: `Failed to fetch cooldown with id: ${cooldownId}`,
        loading: false,
      });
    }
  },
  fetchDetailedCooldown: async (token: string, cooldownId: number) => {
    const state = get();
    const cached = state.detailedCooldowns[cooldownId];
    if (cached) {
      return cached;
    }
  
    set({ loading: true });
    try {
      const cooldown = await cooldownsService.fetchDetailedCooldown(token, cooldownId);
      set((state) => ({
        detailedCooldowns: { ...state.detailedCooldowns, [cooldownId]: cooldown },
        loading: false,
      }));
      return cooldown;
    } catch (err) {
      set({ error: `Failed to fetch cooldown with id: ${cooldownId}`, loading: false });
      throw err;
    }
  },
  
  updateCooldown: async (token: string, cooldownData: UpdateWarmupCooldownDTO) => {
    set({ loading: true });
    const { id } = cooldownData;
    try {
      const updatedCooldown = await cooldownsService.updateCooldown(
        token,
        cooldownData,
      );
      set((state) => {
        const existing = state.cooldowns[id];
        return {
          cooldowns: {
            ...state.cooldowns,
            [id]: {
              ...existing,
              ...updatedCooldown,
            },
          },
          loading: false,
        };
      });
    } catch (err) {
      set({
        error: `Failed to update cooldown with id: ${id}`,
        loading: false,
      });
    }
  },
  deleteCooldown: async (token: string, cooldownId: number) => {
    set({ loading: true });
    try {
      await cooldownsService.deleteCooldown(token, cooldownId);
      set((state) => {
        const { [cooldownId]: _, ...rest } = state.cooldowns;
        return { cooldowns: rest };
      });
    } catch (err) {
      set({
        error: `Failed to delete cooldown with id: ${cooldownId}`,
        loading: false,
      });
    }
  },
  addCooldown: async (token: string, cooldownData: AddWarmupCooldownDTO) => {
    set({ loading: true });
    try {
      const newCooldown = await cooldownsService.addCooldown(
        token,
        cooldownData,
      );

      set((state) => ({
        cooldowns: { 
          ...state.cooldowns, 
          [newCooldown.id]: newCooldown 
        },
        loading: false,
      }));
      return newCooldown;
    } catch (err) {
      set({ error: `Failed to add new cooldown`, loading: false });
      throw(err);
    }
  },

  setError: (message) => set({ error: message }),
  resetError: () => set({ error: undefined }),
}));


const normalizeCooldown = (raw: any): LibraryRoutine => ({
  id: raw.id,
  name: raw.name,
  instructions: raw.instructions,
  exerciseIds: raw.exercise_ids,
  custom: raw.custom
});
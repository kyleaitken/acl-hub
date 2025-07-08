import { create } from 'zustand';
import tagsService from '../services/tagsService';
import { ProgramTag } from '../../core/types/models';

interface TagStore {
  tags: Record<number, ProgramTag>;
  loading: boolean;
  error?: string;

  fetchTags: (token: string) => Promise<void>;
  addTag: (token: string, tagName: string) => Promise<void>;
  deleteTag: (token: string, tagId: number) => Promise<void>;
  updateTag: (token: string, tagId: number, newName: string) => Promise<void>;

  setError: (message: string) => void;
  resetError: () => void;
}

export const useTagStore = create<TagStore>((set) => ({
  tags: {},
  loading: false,
  error: undefined,

  fetchTags: async (token: string) => {
    set({ loading: true });
    try {
      const list = await tagsService.fetchTags(token);
      console.log('tag list', list);
      const normalized = Object.fromEntries(list.map((p) => [p.id, p]));
      set({ tags: normalized, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch coach's tags", loading: false });
    }
  },
  updateTag: async (token: string, tagId: number, newName: string) => {
    set({ loading: true });
    try {
      const updatedTag = await tagsService.updateTag(token, tagId, newName);
      set((state) => ({
        tags: { ...state.tags, [tagId]: updatedTag },
        loading: false,
      }));
    } catch (err) {
      set({
        error: `Failed to update tag with id: ${tagId}`,
        loading: false,
      });
    }
  },
  deleteTag: async (token: string, tagId: number) => {
    set({ loading: true });
    try {
      await tagsService.deleteTag(token, tagId);
      set((state) => {
        const { [tagId]: _, ...rest } = state.tags;
        return { tags: rest, loading: false };
      });
    } catch (err) {
      set({
        error: `Failed to delete tag with id: ${tagId}`,
        loading: false,
      });
    }
  },
  addTag: async (token: string, tagName: string) => {
    set({ loading: true });
    try {
      const newTag = await tagsService.addTag(token, tagName);
      set((state) => ({
        tags: { ...state.tags, [newTag.id]: newTag },
        loading: false,
      }));
    } catch (err) {
      set({ error: `Failed to add new program`, loading: false });
    }
  },
  setError: (message) => set({ error: message }),
  resetError: () => set({ error: undefined }),
}));

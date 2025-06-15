import { create } from 'zustand';
import clientService from '../services/clientService';
import { Client } from '../types';

interface CoachClientStore {
  clients: Client[];
  loading: boolean;
  error?: string;

  fetchClients: (token: string) => Promise<void>;
  addClient: (token: string, client: Client) => Promise<void>;
  updateClient: (token: string, client: Client) => Promise<void>;
  deleteClient: (token: string, clientId: number) => Promise<void>;
  resetError: () => void;
}

export const useCoachClientStore = create<CoachClientStore>((set) => ({
  clients: [],
  loading: false,
  error: undefined,

  fetchClients: async (token: string) => {
    set({ loading: true });
    try {
      const data = await clientService.fetchClients(token);
      set({ clients: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch clients', loading: false });
    }
  },

  addClient: async (token: string, client: Client) => {
    set({ loading: true });
    try {
      const newClient = await clientService.addClient(token, client);
      set((state) => ({
        clients: [...state.clients, newClient],
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to add client', loading: false });
    }
  },

  updateClient: async (token: string, client: Client) => {
    set({ loading: true });
    try {
      const updatedClient = await clientService.updateClient(token, client);
      set((state) => ({
        clients: state.clients.map((c) =>
          c.id === updatedClient.id ? updatedClient : c,
        ),
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to update client', loading: false });
    }
  },

  deleteClient: async (token: string, clientId: number) => {
    set({ loading: true });
    try {
      await clientService.deleteClient(token, clientId);
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== clientId),
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to delete client', loading: false });
    }
  },

  resetError: () => set({ error: undefined }),
}));

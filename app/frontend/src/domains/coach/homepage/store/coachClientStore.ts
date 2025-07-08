import { create } from 'zustand';
import clientService from '../services/clientService';
import { Client, ClientDetails } from '../../core/types/models';

interface CoachClientStore {
  clientsById: Record<number, Client>;
  detailedClientsById: Record<number, ClientDetails>;
  loading: boolean;
  error?: string;

  fetchClients: (token: string) => Promise<void>;
  fetchClientDetails: (token: string, id: number) => Promise<void>;
  addClient: (token: string, client: Client) => Promise<void>;
  updateClient: (token: string, client: Client) => Promise<void>;
  deleteClient: (token: string, clientId: number) => Promise<void>;
  resetError: () => void;
}

export const useCoachClientStore = create<CoachClientStore>((set) => ({
  clientsById: {},
  detailedClientsById: {},
  loading: false,
  error: undefined,

  fetchClients: async (token: string) => {
    set({ loading: true });
    try {
      const data = await clientService.fetchClients(token);
      const byId = Object.fromEntries(
        data.map((client) => [client.id, client]),
      );
      set({ clientsById: byId, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch clients', loading: false });
    }
  },

  fetchClientDetails: async (token, clientId) => {
    set({ loading: true });
    try {
      const data: ClientDetails = await clientService.fetchClientDetails(
        token,
        clientId,
      );
      set((state) => ({
        detailedClientsById: {
          ...state.detailedClientsById,
          [clientId]: data,
        },
        loading: false,
      }));
    } catch {
      set({ error: 'Failed to fetch client details', loading: false });
    }
  },

  addClient: async (token: string, client: Client) => {
    set({ loading: true });
    try {
      const newClient = await clientService.addClient(token, client);
      set((state) => ({
        clientsById: { ...state.clientsById, [newClient.id]: newClient },
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
        clientsById: {
          ...state.clientsById,
          [updatedClient.id]: updatedClient,
        },
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
      set((state) => {
        const { [clientId]: _, ...rest } = state.clientsById;
        return {
          clientsById: rest,
          loading: false,
        };
      });
    } catch (err) {
      set({ error: 'Failed to delete client', loading: false });
    }
  },

  resetError: () => set({ error: undefined }),
}));

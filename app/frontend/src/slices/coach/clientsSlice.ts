import { createSlice, createSelector } from '@reduxjs/toolkit';
import { RootState, Client } from '../../types/types';
import {
  fetchClients,
  addClient,
  deleteClient,
  updateClient,
} from '../thunks/clientThunks';

interface ClientState {
  clients: Client[];
  loading: boolean;
  error?: string;
}

const initialState: ClientState = {
  clients: [],
  loading: false,
  error: undefined,
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    resetError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.clients = action.payload;
        state.loading = false;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });

    builder
      .addCase(addClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.clients.push(action.payload);
        state.loading = false;
      })
      .addCase(addClient.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });

    builder
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.clients = state.clients.map((client) =>
          client.id === action.payload.id ? action.payload : client,
        );
        state.loading = false;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });

    builder
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(
          (client) => client.id !== action.payload,
        );
        state.loading = false;
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default clientSlice.reducer;
export const { resetError } = clientSlice.actions;

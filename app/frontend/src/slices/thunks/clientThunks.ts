import { createAsyncThunk } from '@reduxjs/toolkit';
import clientService from '../../services/clientService';
import { Client } from '../../types/types';

// Define async thunk to fetch clients
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (token: string, thunkAPI) => {
    try {
      const response = await clientService.fetchClients(token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch clients');
    }
  },
);

// Async thunk to add a client
export const addClient = createAsyncThunk(
  'clients/addClient',
  async (payload: { token: string; clientData: Client }, thunkAPI) => {
    try {
      const { token, clientData } = payload;
      const response = await clientService.addClient(token, clientData); // Make API call
      return response.data; // Return the added client
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to add client.'); // Return error message
    }
  },
);

// Async thunk to update a client
export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async (payload: { token: string; clientData: Client }, thunkAPI) => {
    try {
      const { token, clientData } = payload;
      const response = await clientService.updateClient(token, clientData); // API call for updating client
      return response.data; // Return updated client data
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to update client.'); // Return error message
    }
  },
);

// Async thunk to delete a client
export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (payload: { token: string; clientId: number }, thunkAPI) => {
    try {
      const { token, clientId } = payload;
      const response = await clientService.deleteClient(token, clientId); // API call to delete the client
      return clientId;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to delete client.'); // Return error message
    }
  },
);

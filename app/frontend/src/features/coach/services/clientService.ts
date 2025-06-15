import { apiRequest } from './api';
import { Client } from '../types';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients`;

const fetchClients = (token: string) => apiRequest(baseUrl, 'GET', token);

const fetchDetailedClientData = (token: string) =>
  apiRequest(`${baseUrl}/detailed`, 'GET', token);

const addClient = (token: string, clientData: Client) =>
  apiRequest(baseUrl, 'POST', token, clientData);

const updateClient = (token: string, clientData: Client) =>
  apiRequest(baseUrl, 'PUT', token, clientData);

const deleteClient = (token: string, clientId: number) =>
  apiRequest(`${baseUrl}/${clientId}`, 'DELETE', token);

export default {
  fetchClients,
  fetchDetailedClientData,
  addClient,
  updateClient,
  deleteClient,
};

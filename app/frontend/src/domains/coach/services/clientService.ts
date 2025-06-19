import { apiRequest } from './api';
import { Client, ClientDetails } from '../types/models';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients`;

const fetchClients = (token: string): Promise<Client[]> =>
  apiRequest(baseUrl, 'GET', token);

const fetchClientDetails = (
  token: string,
  clientId: number,
): Promise<ClientDetails> => apiRequest(`${baseUrl}/${clientId}`, 'GET', token);

const addClient = (token: string, clientData: Client): Promise<Client> =>
  apiRequest(baseUrl, 'POST', token, clientData);

const updateClient = (token: string, clientData: Client): Promise<Client> =>
  apiRequest(baseUrl, 'PUT', token, clientData);

const deleteClient = (token: string, clientId: number) =>
  apiRequest(`${baseUrl}/${clientId}`, 'DELETE', token);

export default {
  fetchClients,
  fetchClientDetails,
  addClient,
  updateClient,
  deleteClient,
};

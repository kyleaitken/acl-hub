import { Client } from '../types/types';

const fetchClients = async (token: string) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch clients');

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching clients: ', error);
    throw error;
  }
};

const fetchDetailedClientData = async (token: string) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients/detailed`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch clients');

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching clients: ', error);
    throw error;
  }
};

const addClient = async (token: string, clientData: Client) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) throw new Error('Failed to add client');

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error adding client: ', error);
    throw error;
  }
};

const updateClient = async (token: string, clientData: Client) => {
  console.log('In update client');
  const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) throw new Error('Failed to update client');

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error updating client: ', error);
    throw error;
  }
};

const deleteClient = async (token: string, clientId: number) => {
  console.log('In delete client');
  const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients/${clientId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to delete client');

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error deleting client: ', error);
    throw error;
  }
};

export default {
  fetchClients,
  fetchDetailedClientData,
  addClient,
  updateClient,
  deleteClient,
};

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const selectClients = (state: RootState) => state.clients.clients;

export const selectClientById = (clientId: number) =>
  createSelector([selectClients], (clients) =>
    clients.find((client: { id: number }) => client.id === clientId),
  );

export const selectClientProfilePicture = (clientId: number) =>
  createSelector([selectClients], (clients) => {
    const client = clients.find(
      (client: { id: number }) => client.id == clientId,
    );
    return client ? client.profile_picture_url : null;
  });

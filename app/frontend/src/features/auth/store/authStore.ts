// src/roles/coach/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'coach' | 'client';

interface AuthState {
  token: string | null;
  role: Role | null;
  id: number | null;
  firstName: string;
  lastName: string;
  isLoggedIn: boolean;
  profilePictureUrl: string | null;

  login: (data: {
    token: string;
    role: Role;
    id: number;
    firstName: string;
    lastName: string;
    profilePictureUrl: string | null;
  }) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      id: null,
      firstName: '',
      lastName: '',
      isLoggedIn: false,
      profilePictureUrl: null,

      login: ({ token, role, id, firstName, lastName, profilePictureUrl }) =>
        set({
          token,
          role,
          id,
          firstName,
          lastName,
          profilePictureUrl,
          isLoggedIn: true,
        }),
      logout: () =>
        set({
          token: null,
          role: null,
          id: null,
          firstName: '',
          lastName: '',
          profilePictureUrl: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);

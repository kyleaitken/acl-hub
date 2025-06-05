// src/roles/coach/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type Role = 'coach' | 'user';

interface AuthState {
  token: string | null;
  role: Role | null;
  id: number | null;
  firstName: string;
  lastName: string;
  isLoggedIn: boolean;
  login: (data: {
    token: string;
    role: Role;
    id: number;
    firstName: string;
    lastName: string;
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
      login: ({ token, role, id, firstName, lastName }) =>
        set({
          token,
          role,
          id,
          firstName,
          lastName,
          isLoggedIn: true,
        }),
      logout: () =>
        set({
          token: null,
          role: null,
          id: null,
          firstName: '',
          lastName: '',
          isLoggedIn: false,
        }),
    }),
    {
      name: 'auth-storage', 
    }
  )
);

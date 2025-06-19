import { useAuthStore } from '../store/authStore';
import { Role } from '../types';

export const useAuthenticatedUser = (): {
  token: string;
  role: 'coach' | 'client';
  id: number;
  firstName: string;
  lastName: string;
} => {
  const { token, role, id, firstName, lastName } = useAuthStore();

  if (!token || !role || id === null) {
    throw new Error(
      'useAuthenticatedUser was called without an authenticated user',
    );
  }

  return {
    token,
    role: role as Role, // optional cast if Role is union of 'coach' | 'client'
    id,
    firstName,
    lastName,
  };
};

export type AuthenticatedUser = ReturnType<typeof useAuthenticatedUser>;

import { Role } from '../types';

export interface CoachSignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  token: string;
  first_name: string;
  last_name: string;
  id: number;
  role: Role;
  profile_picture_url: string | null;
}

const loginUser = async (
  email: string,
  password: string,
  role: string,
): Promise<LoginResponse> => {
  try {
    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/${role === 'coach' ? 'coaches' : 'clients'}/sign_in`;

    const body = {
      [role]: {
        email,
        password,
      },
      scope: role,
    };

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error('Failed to login');

    const data = await response.json();
    return {
      token: data.token,
      first_name: data[role].first_name,
      last_name: data[role].last_name,
      id: data[role].id,
      role: role as 'coach' | 'client',
      profile_picture_url: data[role].profile_picture_url ?? null,
    };
  } catch (error) {
    throw error;
  }
};

const logoutUser = async (role: string, token: string) => {
  try {
    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/${role === 'coach' ? 'coaches' : 'clients'}/sign_out`;

    const response = await fetch(baseUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to logout');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const signupCoach = async (coachData: CoachSignupData) => {
  const { firstName, lastName, email, phone, password, confirmPassword } =
    coachData;
  try {
    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches`;

    const body = {
      coach: {
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        password,
        password_confirmation: confirmPassword,
      },
    };

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Signup failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Signup successful:', data);
    return data;
  } catch (error) {
    console.error('Error signing up coach:', error);
    throw error;
  }
};

export default {
  loginUser,
  logoutUser,
};

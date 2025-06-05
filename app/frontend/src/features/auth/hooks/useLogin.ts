import { useAuthStore } from '../store/authStore';
import authService from '../services/authService';

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const loginUser = async (email: string, password: string, isCoach: boolean) => {
    const role = isCoach ? 'coach' : 'user';

    const loginData = await authService.loginUser(email, password, role);

    login({
      token: loginData.token,
      role: loginData.role,
      id: loginData.id,
      firstName: loginData.first_name,
      lastName: loginData.last_name,
    });

    return loginData.role;
  };

  const logoutUser = async (role: string, token: string) => {
    try {
        await authService.logoutUser(role, token);
        logout(); 
        return true;
    } catch (error) {
        console.error('Logout failed:', error);
        return false;
    }
  }

  return { loginUser, logoutUser };
};

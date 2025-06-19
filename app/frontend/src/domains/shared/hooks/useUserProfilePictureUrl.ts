import { useCoachClientStore } from '../../coach/store/coachClientStore';
import { useAuthStore } from '../auth/store/authStore';

type UserType = 'coach' | 'client';

export const useUserProfilePictureUrl = (
  userId: number,
  userType: UserType,
): string | undefined => {
  const auth = useAuthStore();

  // return the logged in user's picture
  if (auth.role === userType && auth.id === userId) {
    return auth.profilePictureUrl ?? undefined;
  }

  if (userType === 'client') {
    const client = useCoachClientStore((state) => state.clientsById[userId]);
    return client?.profile_picture_url || undefined;
  }

  return undefined;
};

import { useAuthenticatedUser } from '../../../shared/auth/hooks/useAuthenticatedUser';
import { useCoachWorkoutStore } from '../store/coachWorkoutStore';
import {
  AddCommentDTO,
  DeleteCommentDTO,
  UpdateCommentDTO,
} from '../types';

export const useCoachWorkoutActions = () => {
  const { token } = useAuthenticatedUser();

  const fetchTodayWorkouts = useCoachWorkoutStore((s) => s.fetchTodayWorkouts);
  const fetchUpdatedWorkouts = useCoachWorkoutStore(
    (s) => s.fetchUpdatedWorkouts,
  );
  const addCommentToWorkout = useCoachWorkoutStore(
    (s) => s.addCommentToWorkout,
  );
  const updateWorkoutComment = useCoachWorkoutStore(
    (s) => s.updateWorkoutComment,
  );
  const deleteWorkoutComment = useCoachWorkoutStore(
    (s) => s.deleteWorkoutComment,
  );

  return {
    fetchTodayWorkouts: () => fetchTodayWorkouts(token),
    fetchUpdatedWorkouts: () => fetchUpdatedWorkouts(token),
    addCommentToWorkout: (dto: AddCommentDTO) =>
      addCommentToWorkout(token, dto),
    updateWorkoutComment: (dto: UpdateCommentDTO) =>
      updateWorkoutComment(token, dto),
    deleteWorkoutComment: (dto: DeleteCommentDTO) =>
      deleteWorkoutComment(token, dto),
  };
};

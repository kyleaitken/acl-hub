import { Role } from '../../auth/types';

type BaseCommentPathParams = {
  clientId: number;
  programId: number;
  workoutId: number;
};

export type AddCommentDTO = BaseCommentPathParams & {
  content: string;
  timestamp: string;
  user_type: Role;
};

export type UpdateCommentDTO = BaseCommentPathParams & {
  commentId: number;
  timestamp: string;
  content: string;
  user_type: Role;
};

export type DeleteCommentDTO = BaseCommentPathParams & {
  commentId: number;
};

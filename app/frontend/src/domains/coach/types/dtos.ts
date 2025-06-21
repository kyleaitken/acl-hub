import { Role } from '../../shared/auth/types';

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

export type AddCoachProgramDTO = {
  programName: string;
  programDescription?: string;
  num_weeks: number;
};

export type UpdateCoachProgramDTO = {
  programId: number;
  programName?: string;
  programDescription?: string;
  num_weeks?: number;
};

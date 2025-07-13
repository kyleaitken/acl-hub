import { Divider, Paper } from '@mui/material';
import { formatDateString } from '../../core/utils/dateUtils';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import WorkoutCommentBox from '../../../shared/components/WorkoutCommentBox';
import {
  AuthenticatedUser,
  useAuthenticatedUser,
} from '../../../shared/auth/hooks/useAuthenticatedUser';
import WorkoutHeader from './WorkoutHeader';
import React from 'react';
import ExerciseCard from './ExerciseCard';
import { UpdatedWorkout } from '../../core/types/models';
import { useCoachWorkoutActions } from '../hooks/useCoachWorkoutActions';

interface UpdatedWorkoutProps {
  workout: UpdatedWorkout;
}

interface WarmupSectionProps {
  warmup: string;
}

const UpdatedWorkoutPaper = ({ workout }: UpdatedWorkoutProps) => {
  const formattedDate = formatDateString(workout.workout.date);
  const { firstName, lastName, role }: AuthenticatedUser =
    useAuthenticatedUser();
  const programId = workout.workout.programId;
  const workoutId = workout.workout.id;
  const clientId = workout.client_id;

  const { addCommentToWorkout, updateWorkoutComment, deleteWorkoutComment } =
    useCoachWorkoutActions();

  const addComment = async (newComment: string) => {
    await addCommentToWorkout({
      clientId,
      programId,
      workoutId,
      content: newComment,
      timestamp: new Date().toISOString(),
      user_type: role,
    });
  };

  const updateComment = async (commentId: number, updatedComment: string) => {
    try {
      await updateWorkoutComment({
        clientId,
        programId,
        workoutId,
        commentId,
        content: updatedComment,
        timestamp: new Date().toISOString(),
        user_type: role,
      });
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await deleteWorkoutComment({
        clientId,
        programId,
        workoutId,
        commentId: commentId,
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: '850px',
        mb: '50px',
      }}
    >
      <div className="flex flex-col">
        <WorkoutHeader
          clientId={workout.client_id}
          firstName={firstName}
          lastName={lastName}
          dueDate={formattedDate}
        />
        <div id="workout-content-container" className="mr-10 ml-6">
          <p className="m-5 ml-0 text-xl font-bold">
            {workout.workout.name || 'Workout'}
          </p>
          <Divider />
          {workout.workout.warmup && (
            <WarmupSection warmup={workout.workout.warmup} />
          )}
          <div className="mt-5">
            {workout.workout.exercises.map((exercise, index) => (
              <ExerciseCard exercise={exercise} key={index} />
            ))}
          </div>
        </div>
        <Divider
          sx={{
            mb: workout.workout.comments.length > 0 ? '10px' : '0px',
          }}
        />
        <WorkoutCommentBox
          workoutId={workout.workout.id}
          clientId={clientId}
          coachFirstName={firstName}
          coachLastName={lastName}
          clientFirstName={workout.first_name}
          clientLastName={workout.last_name}
          onAddComment={addComment}
          onUpdateComment={updateComment}
          onDeleteComment={deleteComment}
        />
      </div>
    </Paper>
  );
};

export default React.memo(UpdatedWorkoutPaper);

const WarmupSection = ({ warmup }: WarmupSectionProps) => {
  const [warmupExpanded, setWarmupExpanded] = useState(false);

  return (
    <div className="flex flex-col" id="warmup-wrapper">
      <div id="warmup" className="mt-5 flex items-center">
        <LocalFireDepartmentIcon sx={{ fontSize: '25px' }} />
        <button
          type="button"
          className="flex cursor-pointer justify-items-center hover:underline"
          onClick={() => setWarmupExpanded((prev) => !prev)}
        >
          {warmupExpanded ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
          <p className="font-bold">Warmup</p>
        </button>
      </div>
      {warmupExpanded && (
        <p className="mt-4 ml-12 whitespace-pre-line">
          {warmup || 'Squats x 10\n Push up x 10'}
        </p>
      )}
      <Divider sx={{ marginTop: '20px' }} />
    </div>
  );
};

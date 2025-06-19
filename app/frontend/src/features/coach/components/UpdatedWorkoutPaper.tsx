import { Divider, Paper } from '@mui/material';
import { formatDateString } from '../../../utils/dateUtils';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import WorkoutCommentBox from '../../../components/WorkoutCommentBox';
import {
  AuthenticatedUser,
  useAuthenticatedUser,
} from '../../auth/hooks/useAuthenticatedUser';
import WorkoutHeader from './WorkoutHeader';
import React from 'react';
import ExerciseCard from './ExerciseCard';
import { useCoachWorkoutData } from '../hooks/useCoachWorkoutData';

interface UpdatedWorkoutProps {
  workoutId: number;
}

interface WarmupSectionProps {
  warmup: string;
}

const UpdatedWorkoutPaper = ({ workoutId }: UpdatedWorkoutProps) => {
  const { updatedWorkouts } = useCoachWorkoutData();

  const updatedWorkout = updatedWorkouts.find(
    (w) => w.workout.id === workoutId,
  );

  if (!updatedWorkout) {
    return null;
  }
  const formattedDate = formatDateString(updatedWorkout.workout.date);
  const clientId = updatedWorkout.client_id;
  const programId = updatedWorkout.workout.programId;

  const { firstName, lastName }: AuthenticatedUser = useAuthenticatedUser();

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
          clientId={clientId}
          firstName={updatedWorkout.first_name}
          lastName={updatedWorkout.last_name}
          dueDate={formattedDate}
        />
        <div id="workout-content-container" className="mr-10 ml-6">
          <p className="m-5 ml-0 text-xl font-bold">
            {updatedWorkout.workout.name || 'Workout'}
          </p>
          <Divider />
          {updatedWorkout.workout.warmup && (
            <WarmupSection warmup={updatedWorkout.workout.warmup} />
          )}
          <div className="mt-5">
            {updatedWorkout.workout.exercises.map((exercise, index) => (
              <ExerciseCard exercise={exercise} key={index} />
            ))}
          </div>
        </div>
        <Divider
          sx={{
            mb: updatedWorkout.workout.comments.length > 0 ? '10px' : '0px',
          }}
        />
        <WorkoutCommentBox
          programId={programId}
          workoutId={updatedWorkout.workout.id}
          clientId={updatedWorkout.client_id}
          coachFirstName={firstName}
          coachLastName={lastName}
          clientFirstName={updatedWorkout.first_name}
          clientLastName={updatedWorkout.last_name}
        />
      </div>
    </Paper>
  );
};
// UpdatedWorkoutPaper.whyDidYouRender = true;

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

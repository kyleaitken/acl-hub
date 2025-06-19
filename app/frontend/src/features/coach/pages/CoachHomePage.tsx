import { List, Collapse, ListItem } from '@mui/material';
import { getDaySuffix, getTimeOfDay } from '../../../utils/dateUtils';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ProfilePictureBubble from '../../../components/ProfilePictureBubble';
import { capitalize } from '../../../utils/utils';
import UpdatedWorkoutPaper from '../components/UpdatedWorkoutPaper';
import UpdatedWorkoutSkeleton from '../components/UpdatedWorkoutSkeleton';
import React from 'react';
import { useAuthenticatedUser } from '../../auth/hooks/useAuthenticatedUser';
import { useCoachWorkoutActions } from '../hooks/useCoachWorkoutActions';
import { useCoachWorkoutData } from '../hooks/useCoachWorkoutData';

const CoachHomePage = () => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const { firstName } = useAuthenticatedUser();
  const { todayWorkouts, updatedWorkouts, loading } = useCoachWorkoutData();
  const { fetchTodayWorkouts, fetchUpdatedWorkouts } = useCoachWorkoutActions();

  const currentDate = new Date();
  const timeOfDay = getTimeOfDay(currentDate);
  const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' });
  const dayOfMonth = currentDate.getDate();
  const month = currentDate.toLocaleString('en-US', { month: 'long' });
  const daySuffix = getDaySuffix(dayOfMonth);

  useEffect(() => {
    fetchTodayWorkouts();
    fetchUpdatedWorkouts();
  }, []);

  return (
    <div
      id="coach-home-page-wrapper"
      className="ml-[220px] flex min-h-screen text-[var(--color-text)]"
    >
      <div
        id="today-workouts-container"
        className="sticky top-0 max-h-screen px-8 py-10"
      >
        <p className="text-md">{dayOfWeek}</p>
        <p className="mb-4 text-[24px] leading-[1.1] font-bold">
          {month} {dayOfMonth}
          {daySuffix}
        </p>
        <div className="divider my-4 w-full border-t border-[var(--color-text)]" />
        <button
          type="button"
          onClick={() => setCollapseOpen((prev) => !prev)}
          className="flex h-12 cursor-pointer items-center font-bold"
        >
          <div className="flex items-center justify-items-center">
            {collapseOpen ? (
              <ExpandMoreIcon sx={{ pb: '1px', mr: '5px' }} />
            ) : (
              <ExpandLessIcon sx={{ pb: '1px', mr: '5px' }} />
            )}
            <p className="mr-6 font-medium hover:underline">Today's Workouts</p>
          </div>
          <div className="rounded-lg bg-[var(--button-highlight)] px-2.5 py-0.5">
            <p className="text-sm font-medium">{todayWorkouts?.length ?? 0}</p>
          </div>
        </button>
        <Collapse in={collapseOpen}>
          <List sx={{ overflowY: 'auto', maxHeight: '80vh' }}>
            {/* TODO: Make the today workout a link to the client workout and make this scrollable */}
            {todayWorkouts.map((workoutItem, index) => (
              <ListItem
                key={index}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <div className="flex items-center">
                  <ProfilePictureBubble
                    userType="client"
                    height={40}
                    userId={workoutItem.client_id}
                    name={`${workoutItem.first_name} ${workoutItem.last_name}`}
                  />
                  <div className="ml-3 flex flex-col">
                    <p className="font-medium">
                      {capitalize(workoutItem.first_name)}{' '}
                      {capitalize(workoutItem.last_name)}
                    </p>
                    <p className="font-medium">
                      {workoutItem.workout_name || 'Workout'}
                    </p>
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </div>
      <div
        id="updated-workouts-wrapper"
        className="flex flex-grow items-center justify-center bg-[#F3F4F6]"
      >
        <div
          id="workouts"
          className="mr-[500px] ml-[100px] pt-[30px] pb-[40px]"
        >
          <p className="mt-2 mb-8 text-2xl font-bold">
            Good {timeOfDay},{' '}
            {firstName.charAt(0).toUpperCase() + firstName.slice(1)}!
          </p>
          {loading ? (
            <>
              <UpdatedWorkoutSkeleton />
              <UpdatedWorkoutSkeleton />
            </>
          ) : updatedWorkouts.length > 0 ? (
            updatedWorkouts.map((workout) => (
              <UpdatedWorkoutPaper
                key={workout.workout.id}
                workoutId={workout.workout.id}
              />
            ))
          ) : (
            <p>No updates to show.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CoachHomePage);

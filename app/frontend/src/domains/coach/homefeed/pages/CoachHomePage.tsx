import { List, Collapse, ListItem } from '@mui/material';
import { getDaySuffix, getTimeOfDay } from '../../core/utils/dateUtils';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ProfilePictureBubble from '../../../shared/components/ProfilePictureBubble';
import { capitalize } from '../../core/utils/text';
import UpdatedWorkoutPaper from '../components/UpdatedWorkoutPaper';
import React from 'react';
import { useAuthenticatedUser } from '../../../shared/auth/hooks/useAuthenticatedUser';
import { useCoachWorkoutActions } from '../hooks/useCoachWorkoutActions';
import { useCoachWorkoutData } from '../hooks/useCoachWorkoutData';
import UpdatedWorkoutSkeleton from '../components/UpdatedWorkoutSkeleton';

const CoachHomePage = () => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

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

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (loading) {
      setShowSkeleton(true);
    } else {
      timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 300)
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    }
  }, [loading])

  return (
    <div
      id="coach-home-page-wrapper"
      className="flex min-h-screen text-[var(--color-text)]"
    >
      <div
        id="today-workouts-container"
        className="sticky top-0 max-h-screen px-5 py-10"
      >
        <p className="text-sm">{dayOfWeek}</p>
        <p className="mb-4 text-lg leading-[1.1] font-bold">
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
            <p className="mr-3 font-medium text-sm hover:underline">Today's Workouts</p>
          </div>
          <div className="rounded-lg bg-[var(--button-highlight)] px-2.5 py-0.5">
            <p className="text-sm font-medium">{todayWorkouts?.length ?? 0}</p>
          </div>
        </button>
        <Collapse in={collapseOpen}>
          <List sx={{ overflowY: 'auto', maxHeight: '80vh', pt: 0 }}>
            {/* TODO: Make the today workout a link to the client workout and make this scrollable */}
            {todayWorkouts.map((workoutItem, index) => (
              <ListItem
                key={index}
                sx={{ display: 'flex', alignItems: 'center', px: 1, width: '250px' }}
              >
                <div className="flex items-center">
                  <ProfilePictureBubble
                    userType="client"
                    height={35}
                    userId={workoutItem.client_id}
                    name={`${workoutItem.first_name} ${workoutItem.last_name}`}
                  />
                  <div className="ml-3 text-sm flex flex-col">
                    <p className="font-semibold">
                      {capitalize(workoutItem.first_name)}{' '}
                      {capitalize(workoutItem.last_name)}
                    </p>
                    <p >
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
        className="flex flex-grow items-start justify-start px-30 bg-[#F3F4F6]"
      >
        <div
          id="workouts"
          className="pt-[30px] pb-[40px]"
        >
          <p className="mt-5 mb-10 text-xl font-semibold self-start">
            Good {timeOfDay},{' '}
            {firstName.charAt(0).toUpperCase() + firstName.slice(1)}!
          </p>
          {showSkeleton ? (
            <>
              <UpdatedWorkoutSkeleton />
              <UpdatedWorkoutSkeleton />
             </>
          ) : updatedWorkouts.length > 0 ? (
            updatedWorkouts.map((workout) => (
              <UpdatedWorkoutPaper key={workout.workout.id} workout={workout} />
            ))
          ) : (
            <>
            <UpdatedWorkoutSkeleton />
            <UpdatedWorkoutSkeleton />
            <UpdatedWorkoutSkeleton />
            <UpdatedWorkoutSkeleton />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CoachHomePage);

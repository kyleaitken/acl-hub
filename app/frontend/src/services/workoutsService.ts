const fetchTodayWorkouts = async (token: string) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients/todayWorkouts`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch today workouts');

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching today workouts: ', error);
    throw error;
  }
};

const fetchUpdatedWorkouts = async (token: string) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients/updates`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch updated workouts');

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching updated workouts: ', error);
    throw error;
  }
};

const addCommentToWorkout = async (
  token: string,
  clientId: number,
  programId: number,
  workoutId: number,
  comment: string,
) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients/${clientId}/client_programs/${programId}/client_program_workouts/${workoutId}/workout_comments`;
  const timestamp = new Date().toISOString();
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: comment,
        timestamp,
        user_type: 'coach',
      }),
    });

    if (!response.ok) throw new Error('Failed to add comment to workout');

    const data = await response.json();
    console.log('data in workout service: ', data);
    return data;
  } catch (error) {
    console.error('Error adding comment to workout: ', error);
    throw error;
  }
};

const updateWorkoutComment = async (
  token: string,
  commentId: number,
  clientId: number,
  programId: number,
  workoutId: number,
  comment: string,
) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients/${clientId}/client_programs/${programId}/client_program_workouts/${workoutId}/workout_comments/${commentId}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: comment,
      }),
    });

    if (!response.ok) throw new Error('Failed to add comment to workout');

    const data = await response.json();
    console.log('data in update comment workout service: ', data);
    return data;
  } catch (error) {
    console.error('Error adding comment to workout: ', error);
    throw error;
  }
};

const deleteWorkoutComment = async (
  token: string,
  commentId: number,
  clientId: number,
  programId: number,
  workoutId: number,
) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/clients/${clientId}/client_programs/${programId}/client_program_workouts/${workoutId}/workout_comments/${commentId}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to delete workout comment');

    const data = await response.json();
    console.log('data in delete workout comment service: ', data);
    return data;
  } catch (error) {
    console.error('Error deleting workout comment: ', error);
    throw error;
  }
};

export default {
  fetchTodayWorkouts,
  fetchUpdatedWorkouts,
  addCommentToWorkout,
  updateWorkoutComment,
  deleteWorkoutComment,
};

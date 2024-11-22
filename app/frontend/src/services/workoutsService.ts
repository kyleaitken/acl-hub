const fetchTodayWorkouts = async (token: string) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/users/todayWorkouts`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) throw new Error('Failed to fetch today workouts');

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.log("Error fetching today workouts: ", error);
        throw error;
    }
}


const fetchUpdatedWorkouts = async (token: string) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/users/updates`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) throw new Error('Failed to fetch updated workouts');

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.log("Error fetching updated workouts: ", error);
        throw error;
    }
}


export default {
    fetchTodayWorkouts,
    fetchUpdatedWorkouts
};
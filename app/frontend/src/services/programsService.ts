export const fetchCoachPrograms = async (token: string) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/programs`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) throw new Error('Failed to fetch users');

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.log("Error fetching coach's programs: ", error);
        throw error;
    }
}
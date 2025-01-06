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

        if (!response.ok) throw new Error('Failed to fetch programs');

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.log("Error fetching coach's programs: ", error);
        throw error;
    }
}

export const addCoachProgram = async (token: string, programName: string, programDescription?: string, num_weeks?: number) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/programs`;

    const body = {
        num_weeks: num_weeks || 1,
        name: programName,
        description: programDescription || ""
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error('Failed to create new program');

        const data = await response.json();
        console.log("Return from add program: ", data)
        return data;
        
    } catch (error) {
        console.log("Error creating new program: ", error);
        throw error;
    }
}

export const deleteCoachProgram = async (token: string, programId: number) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/programs/${programId}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to delete program');
        console.log("Return from delete program: ", response)
        return response;
        
    } catch (error) {
        console.log("Error deleting program: ", error);
        throw error;
    }
}

export const updateCoachProgram = async (token: string, programId: number, programName?: string, programDescription?: string, num_weeks?: number) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/programs/${programId}`;

    const body: Record<string, string | number> = {};
    if (num_weeks) body.num_weeks = num_weeks;
    if (programName) body.name = programName;
    if (programDescription) body.description = programDescription;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error('Failed to update program');

        const data = await response.json();
        console.log("Return from update program: ", data)
        return data;
        
    } catch (error) {
        console.log("Error updating program: ", error);
        throw error;
    }
}
import { User } from "../types/types";

const fetchUsers = async (token: string) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/users`;

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
        console.log("Error fetching users: ", error);
        throw error;
    }
}

const fetchDetailedUserData = async (token: string) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/users/detailed`;

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
        console.log("Error fetching users: ", error);
        throw error;
    }
}

const addUser = async (token: string, userData: User) => {
    console.log("In add user");
    const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/users`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('Failed to add user');

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.log("Error adding user: ", error);
        throw error;
    }
}

const updateUser = async (token: string, userData: User) => {
    console.log("In update user");
    const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/users`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('Failed to update user');

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.log("Error updating user: ", error);
        throw error;
    }
}

const deleteUser = async (token: string, userId: number) => {
    console.log("In delete user");
    const url = `${import.meta.env.VITE_API_BASE_URL}/coaches/users/${userId}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to delete user');

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.log("Error deleting user: ", error);
        throw error;
    }
}

export default {
    fetchUsers,
    fetchDetailedUserData,
    addUser,
    updateUser,
    deleteUser
};
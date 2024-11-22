
const loginUser = async (email: string, password: string, role: string) => {
    console.log('in loginUser')
    try {
        const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/${role === 'coach' ? 'coaches' : 'users'}/sign_in`;

        const body = {
            [role]: { 
              email,
              password,
            },
            scope: role,
        };

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    
        if (!response.ok) throw new Error('Failed to login');
    
        const data = await response.json();
        console.log("LOGIN DATA: ", data)
        return data.token;  
    } catch (error) {
        throw error;  
    }
};
  
const logoutUser = async (role: string, token: string) => {
    console.log('in logoutUser')
    try {
        const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/${role === 'coach' ? 'coaches' : 'users'}/sign_out`;

        const response = await fetch(baseUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }       
        });
    
        if (!response.ok) throw new Error('Failed to logout');

        const data = await response.json();
        return data;  

    } catch (error) {
        console.error('Logout error:', error);
        throw error;  
    }
};

export default {
    loginUser, logoutUser
};
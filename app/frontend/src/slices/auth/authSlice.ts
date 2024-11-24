import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    role: 'coach' | 'user' | null;
    first_name: string | null;
    last_name: string | null;
    id: number | null;
}

const initialState: AuthState = {
    token: null,
    role: null,
    first_name: null,
    last_name: null,
    id: null,
};
  
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ 
            token: string; 
            role: 'coach' | 'user'; 
            first_name: string; 
            last_name: string; 
            id: number; 
        }>) => {
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.first_name = action.payload.first_name;
            state.last_name = action.payload.last_name;
            state.id = action.payload.id;
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
            state.first_name = null;
            state.last_name = null;
            state.id = null;
        },
    },
});
  
  export const { login, logout } = authSlice.actions;
  export default authSlice.reducer;
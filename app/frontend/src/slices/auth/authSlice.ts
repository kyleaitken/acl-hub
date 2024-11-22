import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    role: 'coach' | 'user' | null;
}

const initialState: AuthState = {
    token: null,
    role: null,
};
  
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ token: string; role: 'coach' | 'user' }>) => {
            state.token = action.payload.token;
            state.role = action.payload.role;
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
        },
    },
  });
  
  export const { login, logout } = authSlice.actions;
  export default authSlice.reducer;
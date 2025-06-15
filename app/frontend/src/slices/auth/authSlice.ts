import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string;
  role: 'coach' | 'client';
  first_name: string;
  last_name: string;
  id: number;
}

const initialState: AuthState = {
  token: '',
  role: 'coach',
  first_name: '',
  last_name: '',
  id: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;
        role: 'coach' | 'client';
        first_name: string;
        last_name: string;
        id: number;
      }>,
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.id = action.payload.id;
    },
    logout: () => initialState,
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

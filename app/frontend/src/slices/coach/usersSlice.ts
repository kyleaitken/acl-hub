import { createSlice, createSelector } from '@reduxjs/toolkit';
import { RootState, User } from '../../types/types';
import { fetchUsers, addUser, deleteUser, updateUser } from '../thunks/userThunks';


interface UserState {
    users: User[];
    loading: boolean;
    error?: string;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: undefined
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        resetError(state) {
            state.error = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
        
        builder
            .addCase(addUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
                state.loading = false;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    
        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.users = state.users.map(user =>
                user.id === action.payload.id ? action.payload : user
                );
                state.loading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    
        builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
        });
    },
});

export default userSlice.reducer;
export const { resetError } = userSlice.actions;

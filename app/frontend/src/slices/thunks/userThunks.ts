import { createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";
import { User } from "../../types/types";

// Define async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (token: string, thunkAPI) => {
    try {
      const response = await userService.fetchUsers(token);
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch users');
    }
  }
);

// Async thunk to add a user
export const addUser = createAsyncThunk(
  'users/addUser',
  async (payload: { token: string; userData: User }, thunkAPI) => {
    try {
      const { token, userData } = payload;
      const response = await userService.addUser(token, userData); // Make API call
      return response.data; // Return the added user
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to add user."); // Return error message
    }
  }
);

// Async thunk to update a user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (payload: { token: string; userData: User }, thunkAPI) => {
    try {
      const { token, userData } = payload;
      const response = await userService.updateUser(token, userData); // API call for updating user
      return response.data; // Return updated user data
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update user."); // Return error message
    }
  }
);

// Async thunk to delete a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (payload: { token: string; userId: number }, thunkAPI) => {
    try {
      const { token, userId } = payload;
      const response = await userService.deleteUser(token, userId); // API call to delete the user
      return userId; 
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to delete user."); // Return error message
    }
  }
);
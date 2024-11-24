import { createSelector } from "@reduxjs/toolkit";
import { RootState } from '../../store';

const selectUsers = (state: RootState) => state.users.users;

export const selectUserById = (userId: number) =>
    createSelector(
      [selectUsers],
      (users) => users.find((user) => user.id === userId)
    );

export const selectUserProfilePicture = (userId: number) =>
    createSelector(
        [selectUsers],
        (users) => {
            const user = users.find((user) => user.id == userId);
            return user ? user.profile_picture_url : null;
        }
    );
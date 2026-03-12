import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectUser = (state: RootState) => state.user;
export const userAddress = createSelector([selectUser], (user) => {
  return user.address;
});

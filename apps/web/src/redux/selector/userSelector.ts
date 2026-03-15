import { RootState } from '../store';

export const selectUser = (state: RootState) => state.user;
export const userAddress = (state: RootState) => state.user.address;

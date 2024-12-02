import { IUserState } from '@/type/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IUserState = {
  id: 0,
  name: '',
  email: '',
  role: '',
  avatarUrl: '',
  address: null,
  location: undefined,
  isLoggedIn: false,
  selectedAddress: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<IUserState>) => {
      const { id, name, email, role, avatarUrl, address } = action.payload;

      state.id = id;
      state.name = name;
      state.email = email;
      state.role = role;
      state.avatarUrl = avatarUrl;
      state.address = address;
      state.isLoggedIn = true;
      state.selectedAddress =
        address?.find((address) => address.isPrimary === true) || address?.[0];
    },
    logoutAction: (state) => {
      state.id = 0;
      state.name = '';
      state.email = '';
      state.role = '';
      state.avatarUrl = '';
      state.address = null;
      state.isLoggedIn = false;
      state.selectedAddress = undefined;
    },
    setLocation: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>,
    ) => {
      state.location = action.payload;
    },
    selectAddress: (
      state,
      action: PayloadAction<IUserState['selectedAddress']>,
    ) => {
      state.selectedAddress = action.payload;
    },
    updateAvatar: (state, action: PayloadAction<IUserState['avatarUrl']>) => {
      state.avatarUrl = action.payload;
    },
  },
});

export const {
  loginAction,
  logoutAction,
  setLocation,
  selectAddress,
  updateAvatar,
} = userSlice.actions;
export default userSlice.reducer;

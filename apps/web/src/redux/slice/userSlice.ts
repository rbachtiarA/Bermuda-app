import { IAddressList } from '@/type/address';
import { IUserState, LoginResponse } from '@/type/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IUserState = {
  id: 0,
  name: '',
  email: '',
  role: '',
  avatarUrl: '',
  address: {},
  location: undefined,
  isLoggedIn: false,
  selectedAddress: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<LoginResponse>) => {
      const { id, name, email, role, storeId, avatarUrl, address } =
        action.payload;

      state.id = id;
      state.name = name;
      state.email = email;
      state.role = role;
      state.storeId = storeId;
      state.avatarUrl = avatarUrl;
      state.isLoggedIn = true;
      state.selectedAddress =
        address.find((address) => address.isPrimary === true) || address?.[0];
      address.forEach((item) => (state.address[item.id] = item));
    },
    logoutAction: () => initialState,
    setLocation: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>,
    ) => {
      state.location = action.payload;
    },
    populatedUserAddress: (state, action: PayloadAction<IAddressList[]>) => {
      const addressList = action.payload;
      addressList.forEach((item) => (state.address[item.id] = item));
    },
    addAddress: (state, action: PayloadAction<IAddressList>) => {
      state.address[action.payload.id] = action.payload;
    },
    updateAddress: (state, action: PayloadAction<IAddressList>) => {
      state.address[action.payload.id] = action.payload;
    },
    selectAddress: (
      state,
      action: PayloadAction<IUserState['selectedAddress']>,
    ) => {
      state.selectedAddress = action.payload;
    },
    removeAddress: (state, action: PayloadAction<IAddressList>) => {
      delete state.address[action.payload.id];
    },
    updateAvatar: (state, action: PayloadAction<IUserState['avatarUrl']>) => {
      state.avatarUrl = action.payload;
    },
  },
});

export const {
  loginAction,
  logoutAction,
  populatedUserAddress,
  addAddress,
  updateAddress,
  removeAddress,
  setLocation,
  selectAddress,
  updateAvatar,
} = userSlice.actions;
export default userSlice.reducer;

import { IAddressList } from '@/type/address';
import { IUserState } from '@/type/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IUserState = {
  id: 0,
  name: '',
  email: '',
  role: '',
  avatarUrl: '',
  address: [],
  location: undefined,
  isLoggedIn: false,
  selectedAddress: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<IUserState>) => {
      const { id, name, email, role, storeId, avatarUrl, address } =
        action.payload;

      state.id = id;
      state.name = name;
      state.email = email;
      state.role = role;
      state.storeId = storeId;
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
      state.storeId = '';
      state.avatarUrl = '';
      state.address = [];
      state.isLoggedIn = false;
      state.selectedAddress = undefined;
    },
    setLocation: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>,
    ) => {
      state.location = action.payload;
    },
    populatedUserAddress: (state, action: PayloadAction<IAddressList[]>) => {
      state.address = action.payload;
    },
    selectAddress: (
      state,
      action: PayloadAction<IUserState['selectedAddress']>,
    ) => {
      state.selectedAddress = action.payload;
    },
    removeAddress: (state, action: PayloadAction<IAddressList>) => {
      const removedAddressList = state.address.filter(
        (address) => address.id !== action.payload.id,
      );
      state.address = removedAddressList;
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
  removeAddress,
  setLocation,
  selectAddress,
  updateAvatar,
} = userSlice.actions;
export default userSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { items: Record<string, boolean> } = { items: {} };

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    addSelectedCheckout: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!state.items[id]) {
        state.items[id] = true;
      }
    },
    selectedAllItems: (state, action: PayloadAction<number[]>) => {
      action.payload.forEach((item) => (state.items[item] = true));
    },
    removeSelectedCheckout: (state, action: PayloadAction<number[]>) => {
      action.payload.forEach((removedId) => {
        delete state.items[removedId];
      });
    },
    resetCheckout: () => initialState,
  },
});

export const {
  addSelectedCheckout,
  removeSelectedCheckout,
  selectedAllItems,
  resetCheckout,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;

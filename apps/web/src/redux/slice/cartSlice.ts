import { ICartItem, IUpdateQuantityCart } from '@/type/cart';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
  items: Record<string, { quantity: number }>;
  updatingItemIds: Record<string, boolean>;
} = {
  items: {},
  updatingItemIds: {},
};

export const cartSlice = createSlice({
  name: 'ItemCart',
  initialState,
  reducers: {
    populatedUserCart: (state, action: PayloadAction<ICartItem[]>) => {
      action.payload.forEach((item) => {
        state.items[item.productId] = {
          quantity: item.quantity,
        };
      });
    },
    addedToCart: (state, action: PayloadAction<ICartItem>) => {
      const item = action.payload;
      if (!state.items[item.productId]) {
        state.items[item.productId] = {
          quantity: item.quantity,
        };
      }
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      state.items[productId].quantity = quantity;
    },
    removedFromCart: (state, action: PayloadAction<number[]>) => {
      action.payload.forEach((removedId) => {
        delete state.items[removedId];
      });
    },
    cartStartUpdating: (state, action: PayloadAction<number>) => {
      state.updatingItemIds[action.payload] = true;
    },
    cartFinishUpdating: (state, action: PayloadAction<number>) => {
      delete state.updatingItemIds[action.payload];
    },
    resetCart: () => initialState,
  },
});

export const {
  populatedUserCart,
  updateCartQuantity,
  addedToCart,
  removedFromCart,
  resetCart,
  cartStartUpdating,
  cartFinishUpdating,
} = cartSlice.actions;
export default cartSlice.reducer;

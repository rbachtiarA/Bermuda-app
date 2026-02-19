import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectCart = (state: RootState) => state.cart;
export const selectCheckout = (state: RootState) => state.checkout;
export const selectedCartItem = createSelector(
  [selectCart, selectCheckout],
  (cart, checkout) => {
    const checkoutSet = new Set(checkout);
    return cart.filter((item) => checkoutSet.has(item.id));
  },
);

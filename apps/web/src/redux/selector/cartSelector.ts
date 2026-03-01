import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartUpdate = (state: RootState) =>
  state.cart.updatingItemIds;

export const cartArr = createSelector([selectCartItems], (cart) =>
  Object.keys(cart).map(Number),
);
export const isCheckoutUpdating = createSelector(
  [selectCartUpdate],
  (updateIds) => {
    return Object.keys(updateIds).length !== 0;
  },
);

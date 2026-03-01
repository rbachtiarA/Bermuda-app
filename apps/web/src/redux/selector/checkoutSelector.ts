import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectCheckout = (state: RootState) => state.checkout.items;

export const checkoutArr = createSelector([selectCheckout], (checkout) =>
  Object.keys(checkout).map(Number),
);

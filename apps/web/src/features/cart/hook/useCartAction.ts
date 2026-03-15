'use client';

import { updateCartItem } from '@/lib/cart';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { isCheckoutUpdating } from '@/redux/selector/cartSelector';
import {
  cartFinishUpdating,
  cartStartUpdating,
  updateCartQuantity,
} from '@/redux/slice/cartSlice';

export default function useCartAction() {
  const dispatch = useAppDispatch();
  const isUpdating = useAppSelector(isCheckoutUpdating);
  const onItemUpdate = async (
    cartItemId: number,
    productId: number,
    qty: number,
  ) => {
    dispatch(cartStartUpdating(cartItemId));

    try {
      const { data, ok } = await updateCartItem(productId, qty);
      console.log(data.data);
      dispatch(
        updateCartQuantity({
          productId: data.data.product.id,
          quantity: data.data.quantity,
        }),
      );
      if (!ok) throw 'something wrong';
    } catch {
      console.log('SOMETHING WRONG');
    } finally {
      dispatch(cartFinishUpdating(cartItemId));
    }
  };

  return {
    isUpdating,
    onItemUpdate,
  };
}

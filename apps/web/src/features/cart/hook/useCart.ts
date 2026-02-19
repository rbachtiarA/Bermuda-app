import { getAllCartItems } from '@/lib/cart';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { updatedCartFromDatabase } from '@/redux/slice/cartSlice';
import { resetCheckout } from '@/redux/slice/checkoutSlice';
import React, { useEffect, useState } from 'react';

export default function useCart() {
  const user = useAppSelector((state) => state.user);
  const cart = useAppSelector((state) => state.cart);
  const store = useAppSelector((state) => state.store);
  const checkout = useAppSelector((state) => state.checkout);
  const [isLoading, setIsLoading] = useState<'DATA' | 'CHECKOUT' | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getData = async () => {
      setIsLoading('DATA');
      const data = await getAllCartItems(user.id, store.id);
      dispatch(updatedCartFromDatabase(data));
      setIsLoading(null);
    };
    console.log('hello');

    dispatch(resetCheckout());
    getData();
  }, [store.id]);
  return {
    user,
    cart,
    store,
    checkout,
    isLoading,
    setIsLoading,
  };
}

import { deleteCartItem, getAllCartItems } from '@/lib/cart';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { populatedUserCart, removedFromCart } from '@/redux/slice/cartSlice';
import {
  removeSelectedCheckout,
  resetCheckout,
} from '@/redux/slice/checkoutSlice';
import { ICartItem } from '@/type/cart';
import { useEffect, useMemo, useState } from 'react';

export default function useCart() {
  const userId = useAppSelector((state) => state.user.id);
  const storeId = useAppSelector((state) => state.store.id);
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [isLoading, setIsLoading] = useState<'DATA' | 'CHECKOUT' | null>(
    'DATA',
  );
  const dispatch = useAppDispatch();
  const { itemOnStock, itemOutStock } = useMemo(() => {
    const itemOnStock = [];
    const itemOutStock = [];

    for (const item of cart) {
      const stock = item.product?.stock;

      if (stock && stock.length > 0 && stock[0].quantity > 0) {
        itemOnStock.push(item);
      } else {
        itemOutStock.push(item);
      }
    }

    return { itemOnStock, itemOutStock };
  }, [cart]);

  const onRemoveItem = async (productIds: number[]) => {
    const { data } = await deleteCartItem(productIds);
    dispatch(removedFromCart(data));
    dispatch(removeSelectedCheckout(data));
    setCart((prev) => {
      return prev.filter((item) => !productIds.includes(item.productId));
    });
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading('DATA');
      const data: ICartItem[] = await getAllCartItems(storeId);
      setCart(data);
      dispatch(populatedUserCart(data));
      setIsLoading(null);
    };

    if (isLoading !== 'DATA') dispatch(resetCheckout()); // first render page, dont reset
    getData();
  }, [storeId]);
  return {
    cart,
    isLoading,
    itemOnStock,
    itemOutStock,
    onRemoveItem,
    setIsLoading,
  };
}

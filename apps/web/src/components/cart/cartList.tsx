'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import CartCard from './cartCard';
import { useEffect, useState } from 'react';
import { getAllCartItems } from '@/lib/cart';
import {
  updatedCartFromDatabase,
} from '@/redux/slice/cartSlice';
import CartCheckout from './cartCheckout';
import {
  resetCheckout,
} from '@/redux/slice/checkoutSlice';
import {
  Card,
  CardBody,
} from '@nextui-org/react';
import SkeletonCartItemCard from '../skeleton/skeletonCartItemCard';
import CartCheckoutSelector from './cartCheckoutSelector';

export default function CartList() {
  const user = useAppSelector((state) => state.user);
  const cart = useAppSelector((state) => state.cart);
  const store = useAppSelector((state) => state.store);
  const checkout = useAppSelector((state) => state.checkout);
  const [isLoading, setIsLoading] = useState<"DATA" | "CHECKOUT" | null>(null)
  const dispatch = useAppDispatch();
  
  const itemOnStock = cart.filter((item) => {
    if (item.product?.stock![0] !== undefined) {
      return item.product?.stock![0].quantity! > 0;
    } else {
      return false;
    }
  });

  const itemSoldOut = cart.filter((item) => {
    return (
      item.product?.stock![0] === undefined ||
      item.product?.stock![0].quantity! === 0
    );
  });

  useEffect(() => {
    const getData = async () => {
      setIsLoading("DATA")
      const data = await getAllCartItems(user.id, store.id);
      dispatch(updatedCartFromDatabase(data));
      setIsLoading(null)
    };
    console.log('hello');
    
    dispatch(resetCheckout());
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.id]);

  return (
    // <section className="grid grid-cols-1 md:grid-cols-[4fr_2fr] lg:grid-cols-[4fr_2fr] w-full max-w-[1500px] mt-2 md:gap-2 md:px-2 mb-[66px] md:mb-0">
    <section className="grid md:grid-cols-[4fr_2fr] mb-[66px] h-full">
      <div>
        <CartCheckoutSelector itemOnStock={itemOnStock} checkout={checkout}/>
        {
          isLoading === 'DATA'? 
          <div className='p-2'>
            <SkeletonCartItemCard /> 
          </div>
          :
          <>
            {cart.length === 0 && (
              <div className="p-2">
                <Card>
                  <CardBody>
                    <p>Cart is Empty</p>
                    <p>Please choose product at product page</p>
                  </CardBody>
                </Card>
              </div>
            )}
            {itemOnStock.length !== 0 && (
              <ul className="grid grid-rows-[auto] gap-y-4 p-2">
                {itemOnStock.map((cartItem, idx) => (
                  <CartCard key={idx} cart={cartItem} checkout={checkout} isLoading={isLoading}/>
                ))}
              </ul>
            )}
            {itemSoldOut.length !== 0 && (
              <div>
                <h2 className="p-2 font-semibold">Product Sold Out</h2>
                <ul className="grid grid-rows-[auto] gap-y-4 p-2">
                  {itemSoldOut.map((cartItem, idx) => (
                    <CartCard
                      isLoading={null}
                      key={idx}
                      cart={cartItem}
                      checkout={checkout}
                      soldOut
                    />
                  ))}
                </ul>
              </div>
            )}
          </>  
        }
      </div>
      <div className="fixed md:sticky w-full bottom-[56px] md:bottom-[100vw]">
        <CartCheckout cart={cart} checkout={checkout} isLoading={isLoading} setIsLoading={setIsLoading}/>
      </div>
    </section>
  );
}

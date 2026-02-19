'use client';
import { ICartItem } from '@/type/cart';
import { Card, CardBody } from '@nextui-org/react';
import useCart from '../hook/useCart';
import CartCheckoutDetails from './checkoutDetails';
import SelectorController from './selectorController';
import SkeletonCard from './skeleton/skeletonCard';
import CartCard from './cartCard';

export default function CartList() {
  const { cart, checkout, isLoading, setIsLoading } = useCart();

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

  return (
    <section className="grid md:grid-cols-[4fr_2fr] mb-[66px] h-full">
      <div>
        <SelectorController itemOnStock={itemOnStock} checkout={checkout} />
        {isLoading === 'DATA' ? (
          <div className="p-2">
            <SkeletonCard />
          </div>
        ) : (
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
              <CardList
                checkout={checkout}
                item={itemOnStock}
                isLoading={isLoading}
              />
            )}
            {itemSoldOut.length !== 0 && (
              <div>
                <h2 className="p-2 font-semibold">Product Sold Out</h2>
                <CardList
                  checkout={checkout}
                  isLoading={null}
                  item={itemSoldOut}
                />
              </div>
            )}
          </>
        )}
      </div>
      <div className="fixed md:sticky w-full bottom-[56px] md:bottom-[100vw]">
        <CartCheckoutDetails
          cart={cart}
          checkout={checkout}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </section>
  );
}

function CardList({
  item,
  checkout,
  isLoading,
}: {
  item: ICartItem[];
  isLoading: 'DATA' | 'CHECKOUT' | null;
  checkout: number[];
}) {
  return (
    <ul className="grid grid-rows-[auto] gap-y-4 p-2">
      {item.map((cartItem, idx) => (
        <CartCard
          key={idx}
          cart={cartItem}
          checkout={checkout}
          isLoading={isLoading}
        />
      ))}
    </ul>
  );
}

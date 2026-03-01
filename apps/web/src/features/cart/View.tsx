'use client';
import { ICartItem } from '@/type/cart';
import { Card, CardBody } from '@nextui-org/react';
import SelectorController from './component/selectorController';
import SkeletonCard from './component/skeleton/skeletonCard';
import CartCheckoutDetails from './component/checkoutDetails';
import useCart from './hook/useCart';
import CartCard from './component/cartCard';
import useCartAction from './hook/useCartAction';

export default function ViewCart() {
  const { cart, isLoading, itemOnStock, itemOutStock, setIsLoading } =
    useCart();
  const { onItemUpdate } = useCartAction();
  return (
    <section className="grid md:grid-cols-[4fr_2fr] mb-[66px] h-full z-[4] gap-2">
      <div>
        {/* <SelectorController itemOnStock={itemOnStock} /> */}
        {isLoading === 'DATA' ? (
          <div className="p-2">
            <SkeletonCard />
          </div>
        ) : (
          <>
            {cart.length === 0 ? (
              <EmptyList />
            ) : (
              <ul className="grid grid-rows-[auto] p-2 rounded-lg border-slate-200 shadow border-1">
                <SelectorController itemOnStock={itemOnStock} />
                {itemOnStock.map((cartItem) => (
                  <CartCard
                    key={cartItem.id}
                    cart={cartItem}
                    soldOut={false}
                    onUpdate={onItemUpdate}
                  />
                ))}
                {itemOutStock.length > 0 && (
                  <h4 className="p-2 font-semibold">Produk Habis</h4>
                )}
                {itemOutStock.map((cartItem) => (
                  <CartCard key={cartItem.id} soldOut={true} cart={cartItem} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <div className="fixed md:sticky w-full bottom-[56px] md:bottom-[100vw]">
        <CartCheckoutDetails
          cart={cart}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </section>
  );
}

function CardList({
  item,
  isSoldOut,
  onUpdate,
}: {
  item: ICartItem[];
  isLoading: 'DATA' | 'CHECKOUT' | null;
  isSoldOut: boolean;
  onUpdate?: (
    cartItemId: number,
    productId: number,
    qty: number,
  ) => Promise<void>;
}) {
  return (
    <ul className="grid grid-rows-[auto] p-2 border-gray-300 border-1">
      {item.map((cartItem) => (
        <CartCard
          key={cartItem.id}
          cart={cartItem}
          soldOut={isSoldOut}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}

function EmptyList() {
  return (
    <div className="p-2">
      <Card>
        <CardBody>
          <p>Cart is Empty</p>
          <p>Please choose product at product page</p>
        </CardBody>
      </Card>
    </div>
  );
}

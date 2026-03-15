'use client';
import { ICartItem } from '@/type/cart';
import { Button, Card, CardBody } from '@nextui-org/react';
import SelectorController from './component/selectorController';
import SkeletonCard from './component/skeleton/skeletonCard';
import CartCheckoutDetails from './component/checkoutDetails';
import useCart from './hook/useCart';
import CartCard from './component/cartCard';
import useCartAction from './hook/useCartAction';

export default function ViewCart() {
  const {
    cart,
    isLoading,
    itemOnStock,
    itemOutStock,
    setIsLoading,
    onRemoveItem,
  } = useCart();
  const { onItemUpdate } = useCartAction();
  return (
    <section className="flex flex-col gap-2">
      <div>
        {isLoading === 'DATA' ? (
          <div className="p-2">
            <SkeletonCard />
          </div>
        ) : (
          <>
            {cart.length === 0 ? (
              <EmptyList />
            ) : (
              <ul className="grid grid-rows-[auto] rounded-lg border-slate-200 shadow border-1">
                <SelectorController
                  itemOnStock={itemOnStock}
                  onRemoveItem={onRemoveItem}
                />
                {itemOnStock.map((cartItem) => (
                  <CartCard
                    key={cartItem.id}
                    cart={cartItem}
                    soldOut={false}
                    onUpdate={onItemUpdate}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
                {itemOutStock.length > 0 && (
                  <h4 className="p-2 font-semibold">Produk Habis</h4>
                )}
                {itemOutStock.map((cartItem) => (
                  <CartCard
                    key={cartItem.id}
                    soldOut={true}
                    cart={cartItem}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <div>
        <CartCheckoutDetails
          cart={cart}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </section>
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

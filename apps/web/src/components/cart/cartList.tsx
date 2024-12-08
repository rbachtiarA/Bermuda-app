'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import CartCard from './cartCard';
import { useEffect, useMemo, useState } from 'react';
import { deleteCartItem, getAllCartItems, postCheckoutItems } from '@/lib/cart';
import {
  removedFromCart,
  updatedCartFromDatabase,
} from '@/redux/slice/cartSlice';
import CartCheckout from './cartCheckout';
import { useRouter } from 'next/navigation';
import {
  removeSelectedCheckout,
  resetCheckout,
  selectedAllItems,
} from '@/redux/slice/checkoutSlice';
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  useDisclosure,
} from '@nextui-org/react';
import ConfirmationModal from '../modal/confirmationModal';
import SkeletonCartItemCard from '../skeleton/skeletonCartItemCard';
export default function CartList() {
  const user = useAppSelector((state) => state.user);
  const cart = useAppSelector((state) => state.cart);
  const store = useAppSelector((state) => state.store);
  const checkout = useAppSelector((state) => state.checkout);
  const [isLoading, setIsLoading] = useState<"DATA" | "CHECKOUT" | null>(null)
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

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

  const onSelectAll = () => {
    const allItemsId = itemOnStock.map((item) => item.id);
    if (checkout.length === itemOnStock.length) {
      dispatch(resetCheckout());
    } else {
      dispatch(selectedAllItems(allItemsId));
    }
  };

  const onCheckout = async () => {
    setIsLoading("CHECKOUT")
    await postCheckoutItems(checkout);
    router.push('/cart/checkout');
    setIsLoading(null)
  };

  const deleteMultipleItemCart = async () => {
    const { data } = await deleteCartItem(checkout);
    dispatch(removedFromCart(data));
    dispatch(removeSelectedCheckout(data));
  };

  const totalSelectedItemsAmount = useMemo(() => {
    return cart
      .filter((item) => checkout.includes(item.id))
      .reduce((total, item) => total + item.quantity * item.product?.price!, 0);
  }, [checkout, cart]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading("DATA")
      const data = await getAllCartItems(user.id, store.id);
      dispatch(updatedCartFromDatabase(data));
      setIsLoading(null)
    };
    dispatch(resetCheckout());
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.id]);

  return (
    // <section className="grid grid-cols-1 md:grid-cols-[4fr_2fr] lg:grid-cols-[4fr_2fr] w-full max-w-[1500px] mt-2 md:gap-2 md:px-2 mb-[66px] md:mb-0">
    <section className="grid md:grid-cols-[4fr_2fr] mb-[66px] h-full">
      <div>
        <div className="sticky top-2 z-10 px-2">
          <Card>
            <CardBody>
              <div className="flex justify-between">
                <Checkbox
                  onValueChange={onSelectAll}
                  isIndeterminate={
                    checkout.length > 0 &&
                    checkout.length !== itemOnStock.length
                  }
                  isSelected={
                    itemOnStock.length !== 0 &&
                    itemOnStock.length === checkout.length
                  }
                >
                  Semua
                </Checkbox>
                {checkout.length !== 0 && (
                  <>
                    <Button
                      color="danger"
                      variant="light"
                      size="sm"
                      className="max-h-6"
                      onPress={onOpen}
                    >
                      Hapus
                    </Button>
                    <ConfirmationModal
                      isOpen={isOpen}
                      onOpenChange={onOpenChange}
                      onConfirm={deleteMultipleItemCart}
                      title="Remove selected item from cart"
                      content={`Are you sure want to remove selected item from your cart ?`}
                    />
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
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
        <CartCheckout
          totalPayment={totalSelectedItemsAmount}
          checkout={checkout}
          onCheckout={onCheckout}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}

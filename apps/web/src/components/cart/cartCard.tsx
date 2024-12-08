'use client';
import { ICartItem } from '@/type/cart';
import {
  Button,
  Checkbox,
  Image,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { useAppDispatch } from '@/redux/hook';
import { removedFromCart } from '@/redux/slice/cartSlice';
import { deleteCartItem } from '@/lib/cart';
import CartQuantityInput from './cartQuantityInput';
import currencyRupiah from '@/lib/rupiahCurrency';
import {
  addSelectedCheckout,
  removeSelectedCheckout,
} from '@/redux/slice/checkoutSlice';
import ConfirmationModal from '../modal/confirmationModal';

export default function CartCard({
  cart,
  checkout,
  soldOut,
  isLoading
}: {
  cart: ICartItem;
  checkout: number[];
  soldOut?: boolean;
  isLoading: "DATA" | "CHECKOUT" | null
}) {
  const dispatch = useAppDispatch();
  const checkRef = useRef<HTMLInputElement>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const product = cart.product;

  const onPressedCard = () => {
    if (!isChecked) {
      dispatch(addSelectedCheckout(cart.id));
    } else {
      dispatch(removeSelectedCheckout([cart.id]));
    }
  };

  const onRemovedItem = async (cartItemId: number) => {
    const checked = false;
    const { data } = await deleteCartItem([cartItemId]);
    dispatch(removedFromCart(data));
    dispatch(removeSelectedCheckout(data));
    setIsChecked(checked);
  };

  useEffect(() => {
    setIsChecked(checkout.includes(cart.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout]);

  const nextUICardV2: React.ReactNode = (
    <Card isHoverable className="w-full">
      <CardBody>
        <div className="flex gap-4">
          <Checkbox
            size="sm"
            ref={checkRef}
            value={`${cart.productId}`}
            isDisabled={soldOut}
            isSelected={isChecked}
            onClick={onPressedCard}
            className="md:hidden"
          />
          <Checkbox
            size="lg"
            ref={checkRef}
            value={`${cart.productId}`}
            isDisabled={soldOut}
            isSelected={isChecked}
            onClick={onPressedCard}
            className="hidden md:block"
          />
          <div className="flex w-full gap-x-2 justify-center items-center">
            <div className="">
              <Image
                src={product?.imageUrl || `/default-product-image.png`}
                alt={`${product?.name}`}
                // width={50}
                // height={50}
                // sizes="100vw"
                className="rounded-lg w-[50px] h-[50px] md:w-[150px] md:h-[150px]"
              />
            </div>
            <div className="flex flex-col w-full h-full justify-between">
              <div>
                <p className="text-balance max-w-[200px] md:max-w-none line-clamp-2 break-words">
                  {product?.name || 'Product Name Null'}
                </p>
                <p className="font-extrabold">
                  {currencyRupiah(product?.price!) || 'Product Price Null'}
                </p>
              </div>
              <div className="w-full grid grid-cols-2 items-end">
                <Tooltip content="Remove item" delay={0}>
                  <Button color="danger" onPress={onOpen} size="sm" isIconOnly isDisabled={isLoading === 'CHECKOUT'}>
                    <Image
                      src={'/icon-trashcan.svg'}
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  </Button>
                </Tooltip>
                <ConfirmationModal
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  onConfirm={() => onRemovedItem(cart.id)}
                  title="Remove item from cart"
                  content={`Are you sure want to remove ${cart.product?.name} from your cart ?`}
                />
                <CartQuantityInput cart={cart} isLoading={isLoading}/>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
  return <li className="flex flex-col gap-x-4">{nextUICardV2}</li>;
}

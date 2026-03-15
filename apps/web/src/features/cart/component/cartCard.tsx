'use client';
import ConfirmationModal from '@/features/shared/components/modal/confirmationModal';
import { deleteCartItem } from '@/lib/cart';
import currencyRupiah from '@/lib/rupiahCurrency';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { removedFromCart } from '@/redux/slice/cartSlice';
import {
  addSelectedCheckout,
  removeSelectedCheckout,
} from '@/redux/slice/checkoutSlice';
import { ICartItem } from '@/type/cart';
import { IProduct } from '@/type/product';
import { Checkbox, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

function CartCard({
  cart,
  soldOut,
  onUpdate,
  onRemoveItem,
}: {
  cart: ICartItem;
  soldOut?: boolean;
  onUpdate?: (cartItemId: number, productId: number, qty: number) => void;
  onRemoveItem: (productIds: number[]) => void;
}) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(cart.quantity);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const isChecked = useAppSelector(
    (state) => !!state.checkout.items[cart.productId],
  );
  const product = cart.product;

  const debounceUpdateQuantity = useDebouncedCallback((value: number) => {
    if (onUpdate && value > 0) {
      onUpdate(cart.id, cart.product!.id, value);
    }
  }, 1000);

  const handleOnQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);
    if (value >= 0) {
      setQuantity(value);
      debounceUpdateQuantity(value);
    }
  };

  const onPressedCheckboxElement = (checked: boolean) => {
    if (checked) {
      dispatch(addSelectedCheckout(cart.productId));
    } else {
      dispatch(removeSelectedCheckout([cart.productId]));
    }
  };

  return (
    <li className="flex flex-col size-full items-center">
      <div className="divider w-[99%] h-[1px] border-slate-200 border-t-1"></div>

      <div className="flex size-full">
        <div className="relative size-full py-2 flex gap-2 items-start md:grid md:grid-cols-[50px_2fr_100px_80px_120px_50px] md:items-center w-full">
          {soldOut && (
            <div className="absolute size-full bg-slate-300/30 left-0 top-0"></div>
          )}
          <div className="flex items-center justify-center w-[50px] h-full">
            <Checkbox
              type="checkbox"
              size="sm"
              value={`${cart.productId}`}
              isDisabled={soldOut}
              isSelected={isChecked}
              onValueChange={onPressedCheckboxElement}
            />
          </div>

          <div className="flex gap-2 flex-1">
            <ProductImage
              imageSrc={cart.product?.imageUrl!}
              imageAlt={cart.product?.name!}
            />
            <div className="flex flex-col flex-1 gap-2 pr-2">
              <StockDetails soldOut={soldOut} name={product!.name} />
              <div className="flex flex-col gap-1 items-start md:hidden">
                <ProductPrice product={product!} />
                <BuyoutQuantity
                  soldout={soldOut}
                  cart={cart}
                  qty={quantity}
                  onQuantityChange={handleOnQuantityChange}
                />
                <button
                  className="rounded-lg px-2 mt-2 border-danger-400 border-1 text-sm text-danger-400 ml-auto z-[2]"
                  onClick={onOpen}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <ProductPrice product={product!} />
          </div>

          <div className="hidden md:block">
            <BuyoutQuantity
              soldout={soldOut}
              cart={cart}
              qty={quantity}
              onQuantityChange={handleOnQuantityChange}
            />
          </div>

          <div className="hidden md:block">
            <TotalPrice product={product!} quantity={quantity} />
          </div>

          <div className="hidden md:flex items-center z-[2]">
            <button
              className="size-full rounded-lg p-1 w-[30px] bg-danger-400 items-center justify-center hover:bg-danger-400/90 hidden md:flex"
              onClick={onOpen}
            >
              <Image
                src={'/icon-trashcan.svg'}
                alt="delete"
                className="z-1"
                width={50}
                height={50}
              />
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={() => onRemoveItem([cart.productId])}
        title="Remove item from cart"
        content={`Are you sure want to remove ${cart.product?.name} from your cart ?`}
      />
    </li>
  );
}

function ProductImage({
  imageSrc,
  imageAlt,
}: {
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <Image
      src={imageSrc || `/default-product-image.png`}
      alt={`${imageAlt}`}
      className="rounded-lg max-w-[100px] max-h-[100px]"
      width={100}
      height={100}
    />
  );
}

function StockDetails({ name, soldOut }: { name: string; soldOut?: boolean }) {
  return (
    <div className="flex flex-col md:size-full justify-between py-1">
      <span className="line-clamp-2 font-semibold">{name}</span>
      <span className="text-xs hidden xl:inline">
        {!soldOut ? 'In stock' : 'Sold out'}
      </span>
    </div>
  );
}

function ProductPrice({ product }: { product: IProduct }) {
  const priceInRupiah = currencyRupiah(product.price);
  return <span>{priceInRupiah}</span>;
}

function BuyoutQuantity({
  soldout,
  qty,
  onQuantityChange,
}: {
  soldout?: boolean;
  cart: ICartItem;
  qty: number;
  onQuantityChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col max-w-[50px]">
      <input
        type="number"
        onChange={onQuantityChange}
        min={1}
        value={qty}
        className={`bg-gray-100 px-1 focus:border-0 rounded-sm focus:outline-none ${soldout ? 'text-gray-400' : `ring-1 ring-black/70`}`}
        disabled={soldout}
      />
    </div>
  );
}

function TotalPrice({
  product,
  quantity,
}: {
  product: IProduct;
  quantity: number;
}) {
  const priceInRupiah = currencyRupiah(product.price * quantity);
  return <span className="font-semibold">{priceInRupiah}</span>;
}

function Grid() {
  return (
    <div className="grid md:grid-flow-col md:grid-cols-[50px_2fr_100px_80px_120px] w-full items-center gap-2">
      {/* <div className="flex items-center justify-center w-[50px]">
        <input
          type="checkbox"
          value={`${cart.productId}`}
          disabled={soldOut}
          checked={isChecked ?? false}
          onChange={onPressedCheckboxElement}
        />
      </div>
      <div className="flex gap-2 max-h-[100px] h-full">
        <ProductImage
          imageSrc={cart.product?.imageUrl!}
          imageAlt={cart.product?.name!}
        />
        <StockDetails soldOut={soldOut} name={product!.name} />
      </div>

      <ProductPrice product={product!} />
      <BuyoutQuantity
        soldout={soldOut}
        cart={cart}
        qty={quantity}
        onQuantityChange={handleOnQuantityChange}
      />
      <TotalPrice product={product!} quantity={quantity} /> */}
    </div>
  );
}
export default CartCard;

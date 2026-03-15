'use client';
import { postCartItems } from '@/lib/cart';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { selectCartItems } from '@/redux/selector/cartSelector';
import { addedToCart } from '@/redux/slice/cartSlice';
import { IStocks } from '@/type/product';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function useProductHandler({ stock }: { stock: IStocks }) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCartItems);
  const user = useAppSelector((state) => state.user);
  const product = stock.product;
  const router = useRouter();

  const onProductClick = () => {
    router.push(`/product/${product.slug}`);
  };

  const onClickedAddToCart = async (quantity: number) => {
    const existProduct = cart[product.id];
    if (existProduct) {
      if (existProduct.quantity >= stock.quantity) {
        toast.error(
          `Stok barang ini ${stock.quantity}, dalam keranjang mu sudah ada ${existProduct.quantity}`,
        );
        return;
      }
    }
    const res = await postCartItems(user.id, product.id, quantity);
    if (res.status === 200) {
      res.cartItem.quantity = quantity;
      dispatch(addedToCart(res.cartItem));
      toast.success(`Berhasil memasukkan ke keranjang`);
    } else if (res.status === 404) {
      router.push('/login');
    } else {
      toast.error(`Something is error`);
    }
  };

  const discountType = () => {
    const flatDiscount = product.discounts?.find(
      (discount) => discount.discountType === 'FLAT',
    );

    const percentageDiscount = product.discounts?.find(
      (discount) => discount.discountType === 'PERCENTAGE',
    );

    if (flatDiscount) {
      return flatDiscount.value;
    }
  };

  return {
    onProductClick,
    onClickedAddToCart,
    discountType,
  };
}

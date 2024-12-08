'use client';
import { postCartItems } from '@/lib/cart';
import currencyRupiah from '@/lib/rupiahCurrency';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { addedToCart } from '@/redux/slice/cartSlice';
import { IStocks } from '@/type/product';
import { Button, Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function ProductCard({ stock }: { stock: IStocks }) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.user);
  const product = stock.product;
  const router = useRouter();

  const onProductClick = () => {
    router.push(`/product/${product.id}`);
  };

  const onClickedAddToCart = async (quantity: number) => {
    const existProduct = cart.find((item) => item.productId === product.id);
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

  return (
    <div>
      <Card
        isPressable
        shadow="sm"
        className="border-none w-full rounded-b-none"
        onClick={onProductClick}
      >
        <CardHeader className="justify-center w-full">
          <Image
            isZoomed
            src={product.imageUrl || `/default-product-image.png`}
          />
        </CardHeader>
        <CardBody>
          <div className="flex flex-col w-full justify-between h-full">
            <h2 className='line-clamp-2'>{product.name}</h2>

            {product.discounts?.some(
              (discount) => discount.discountType === 'FLAT',
            ) ? (
              <>
                <h3 className="text-gray-400 font-bold">
                  <del>{currencyRupiah(product.price)}</del>
                </h3>
                <h3 className="text-primary font-bold">
                  {currencyRupiah(product.price - discountType())}
                </h3>
              </>
            ) : (
              <h3 className="text-primary font-bold">
                {currencyRupiah(product.price)}
              </h3>
            )}
            <div className="w-full font-semibold text-[12px ]">
              <p>Stock: {stock.quantity} item</p>
            </div>

            {/* Logika untuk Buy One Get One */}
            {product.discounts?.some(
              (discount) => discount.discountType === 'BUY_ONE_GET_ONE',
            ) && (
              <div className="text-green-500 font-bold text-sm mt-2">
                🎉 Buy One Get One Free!
              </div>
            )}
          </div>
        </CardBody>
      </Card>
      <Card shadow="sm" className="rounded-t-none">
        <CardBody>
          <Button
            fullWidth
            color="primary"
            variant="bordered"
            onPress={() => onClickedAddToCart(1)}
            isDisabled={stock.quantity === 0}
          >
            {stock.quantity !== 0 ? `+ Add to Cart` : 'Sold Out'}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

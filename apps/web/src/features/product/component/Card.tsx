'use client';
import currencyRupiah from '@/lib/rupiahCurrency';
import { IStocks } from '@/type/product';
import { Button, Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import useProductHandler from '../hooks/useProduct';

export default function ProductCard({ stock }: { stock: IStocks }) {
  const { onProductClick, onClickedAddToCart, discountType } =
    useProductHandler({ stock });
  const product = stock.product;
  return (
    <div className="flex flex-col h-full">
      <Card
        isPressable
        shadow="sm"
        className="border-none rounded-b-none flex-1"
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
            <h2 className="line-clamp-2">{product.name}</h2>

            <div>
              <div className="flex flex-row gap-2">
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
              </div>
              <div className="w-full font-semibold text-[12px ]">
                <p>Stock: {stock.quantity} item</p>
              </div>
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
      <Card shadow="sm" className="rounded-t-none shrink-0">
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

'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IProduct } from '@/type/product';
import { getProductById } from '@/lib/product.handler';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { Button } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { postCartItems } from '@/lib/cart';
import { addedToCart } from '@/redux/slice/cartSlice';
import currencyRupiah from '@/lib/rupiahCurrency';
import TitleBreadcrumbs from '../breadcrumbs/breadcrumbs';

export default function ProductDetail({ productId }: { productId: number }) {
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [showFullDescription, setShowFullDescription] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const cart = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.user);
  const store = useAppSelector((state) => state.store);

  const [quantity, setQuantity] = useState<number>(1);

  const hasDiscountType = (type: string) =>
    product?.discounts?.some((discount) => discount.discountType === type) ||
    false;

  const discountType = () => {
    const flatDiscount = product?.discounts?.find(
      (discount) => discount.discountType === 'FLAT',
    );

    const percentageDiscount = product?.discounts?.find(
      (discount) => discount.discountType === 'PERCENTAGE',
    );

    if (flatDiscount) {
      return flatDiscount.value;
    }

    if (percentageDiscount) {
      return (product?.price || 0) * (percentageDiscount.value / 100);
    }

    return 0;
  };

  const handleAdd = () => {
    if (hasDiscountType('BUY_ONE_GET_ONE')) {
      toast.error(`Maksimal Pembelian 1 Pcs`);
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleSubtract = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (isNaN(value) || value <= 0) {
      toast.error('Jumlah harus lebih dari 0');
      return;
    }

    if (hasDiscountType('BUY_ONE_GET_ONE') && value > 1) {
      toast.error(`Maksimal Pembelian 1 Pcs`);
      return;
    }

    setQuantity(value);
  };

  const loadProduct = async () => {
    try {
      const fetchedProduct = await getProductById(productId);
      setProduct(fetchedProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const onClickedAddToCart = async () => {
    try {
      const res = await postCartItems(user.id, productId, quantity);
      if (res.status === 200) {
        dispatch(addedToCart({ ...res.cartItem, quantity }));
        toast.success(`Berhasil memasukkan ke keranjang`);
      } else {
        toast.error(`Terjadi kesalahan`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Server Error');
    }
  };

  const getAvailableStock = (): number => {
    if (Array.isArray(product?.stock)) {
      return product.stock.reduce((total, stockItem) => {
        const quantity =
          stockItem.quantity && stockItem.storeId == store.id
            ? stockItem.quantity
            : 0;
        return total + quantity;
      }, 0);
    }
    return typeof product?.stock === 'number' ? product.stock : 0;
  };

  useEffect(() => {
    loadProduct();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const availableStock = getAvailableStock();

  return (
    <div className="container mx-auto px-4">
      <div className="md:col-start-2 my-4">
        <TitleBreadcrumbs title="PRODUCT" />
      </div>
      <div className="flex flex-col lg:flex-row gap-10 my-10 py-4">
        <div className="flex-1">
          <div className="p-4 border rounded-lg shadow-lg">
            <Image
              src={product?.imageUrl || '/images/product.png'}
              alt={product?.name || 'Product Image'}
              width={400}
              height={400}
              className="mx-auto rounded-lg"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="mx-10">
            <div className="py-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                {product?.name || 'Product Name'}
              </h1>
              <h2 className="text-lg text-gray-500 py-2">{product?.slug}</h2>
            </div>
            <div className="py-2">
              {product?.discounts?.some(
                (discount) => discount.discountType === 'FLAT',
              ) ? (
                <div className="py-2">
                  <h2 className="text-primary text-2xl font-bold">
                    {currencyRupiah(product?.price - discountType())}
                  </h2>
                  <h2 className="text-gray-400 text-sm font-bold">
                    <del>{currencyRupiah(product?.price)}</del>
                  </h2>
                </div>
              ) : (
                <h2 className="text-primary text-2xl font-bold">
                  {currencyRupiah(product?.price || 0)}
                </h2>
              )}

              {product?.discounts?.some(
                (discount) => discount.discountType === 'BUY_ONE_GET_ONE',
              ) && (
                <div className="text-red-500 font-bold text-sm">
                  🎉 Buy One Get One Free!
                </div>
              )}
            </div>

            <div className="py-4">
              <h2 className="font-bold text-lg">Deskripsi</h2>
              <p className="text-gray-700">
                {product?.description
                  ? showFullDescription
                    ? product.description
                    : `${product.description.slice(0, 100)}... `
                  : 'Deskripsi tidak tersedia.'}
                {product?.description && product.description.length > 100 && (
                  <span
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-primary font-bold cursor-pointer"
                  >
                    {showFullDescription ? 'Tutup' : 'Selengkapnya'}
                  </span>
                )}
              </p>
            </div>

            <div className="py-4">
              <label className="block font-bold text-gray-800 mb-2 text-lg">
                Jumlah Pembelian
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Stok Tersedia:{' '}
                <span className="font-bold text-green-600">
                  {availableStock}
                </span>
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSubtract}
                  className="w-10 h-10 flex justify-center items-center bg-gray-200 text-gray-700 rounded-full shadow hover:bg-gray-300 transition-all duration-200"
                  disabled={quantity <= 1}
                >
                  <span className="text-lg font-bold">-</span>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleInputChange}
                  className="w-16 h-10 text-center border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  min={1}
                  max={availableStock}
                />
                <button
                  onClick={handleAdd}
                  className="w-10 h-10 flex justify-center items-center bg-gray-200 text-gray-700 rounded-full shadow hover:bg-gray-300 transition-all duration-200"
                  disabled={quantity >= availableStock}
                >
                  <span className="text-lg font-bold">+</span>
                </button>
              </div>
              <div className="my-6">
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={() => onClickedAddToCart()}
                  isDisabled={quantity === 0 || availableStock === 0}
                  className="px-6 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

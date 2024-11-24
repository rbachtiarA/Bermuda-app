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

export default function ProductDetail({ productId }: { productId: number }) {
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [discounts, setDiscounts] = useState<any[] | any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const cart = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.user);
  const [quantity, setQuantity] = useState<number>(1);

  const handleAdd = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleSubtract = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  const loadProduct = async () => {
    try {
      const fetchedProduct = await getProductById(productId);
      setProduct(fetchedProduct);
      setDiscounts(fetchedProduct?.discounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Server error');
    } finally {
      setLoading(false);
    }
  };
  console.log(discounts, 'DISCOUNt');

  useEffect(() => {
    loadProduct();
  }, []);

  const onClickedAddToCart = async () => {
    const existProduct = cart.find((item) => item.productId === product?.id);
    if (existProduct) {
    }
    const res = await postCartItems(user.id, productId, quantity);
    if (res.status === 200) {
      res.cartItem.quantity = quantity;
      dispatch(addedToCart(res.cartItem));
      toast.success(`Berhasil memasukkan ke keranjang`);
    } else {
      toast.error(`Something is error`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="border p-4 rounded-lg bg-white">
            <Image
              src={product?.imageUrl || '/images/product.png'}
              alt={product?.name || 'Product Image'}
              width={300}
              height={300}
              className="mx-auto"
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {product?.name || 'Product Name'}
          </h1>
          <p className="text-sm text-gray-600">
            Brand:{' '}
            <span className="font-bold text-blue-600">
              {product?.categories.join(', ') || 'Unknown Brand'}
            </span>
          </p>
          <p className="mt-2 text-red-600 text-xl font-bold">
            Rp {product?.price.toLocaleString() || '0'}
          </p>

          <div className="mt-4">
            <h2 className="font-bold text-lg">Deskripsi</h2>
            <p className="text-gray-700">
              {product?.description || 'No description available.'}
            </p>
            <a href="#" className="text-blue-600 mt-2 inline-block">
              Lihat Selengkapnya
            </a>
          </div>

          {/* Discounts Section */}
          <div className="mt-6">
            <h2 className="font-bold text-lg">Diskon</h2>
            {product?.discounts && product.discounts.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 mt-2">
                {product.discounts.map((discount) => (
                  <li key={discount.id}>{discount.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                Tidak ada diskon untuk produk ini.
              </p>
            )}
          </div>

          <div className="mt-6">
            <label className="block font-bold text-gray-700 mb-2">
              Jumlah Pembelian
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSubtract}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleInputChange}
                className="w-16 text-center border rounded"
                min={1}
              />
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                +
              </button>
            </div>
            <Button
              fullWidth
              color="primary"
              variant="bordered"
              onPress={() => onClickedAddToCart()}
              isDisabled={quantity === 0}
            >
              Add to Cart
            </Button>
          </div>
          {/*   */}
        </div>

        <div className="flex-1 bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg mb-4">Pengiriman</h3>
          <p className="text-sm text-gray-700">
            Dikirim oleh{' '}
            <span className="font-bold">SAPA Instant Delivery</span>
          </p>
          <p className="mt-2 text-sm text-gray-700">
            Biaya Pengiriman <span className="font-bold">Gratis</span>
          </p>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="mt-4 grid grid-cols-5 gap-2"> */
}
{
  /* Thumbnail */
}
{
  /* {Array(5)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="border rounded-lg p-2">
                  <Image
                    src={`/images/thumb-${index + 1}.png`} // Ganti URL thumbnail
                    alt={`Thumbnail ${index + 1}`}
                    width={50}
                    height={50}
                  />
                </div>
              ))} */
}
{
  /* </div> */
}

'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IProduct } from '@/type/product';
import { getProductById } from '@/lib/product.handler';
import { useAppSelector } from '@/redux/hook';

export default function ProductDetail({ productId }: { productId: number }) {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const cart = useAppSelector((state) => state.cart);

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

  useEffect(() => {
    loadProduct();
  }, []);

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

          <div className="mt-6">
            <label className="block font-bold text-gray-700 mb-2">
              Jumlah Pembelian
            </label>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded">
                -
              </button>
              <input
                type="number"
                defaultValue={1}
                className="w-16 text-center border rounded"
              />
              <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded">
                +
              </button>
            </div>
          </div>
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

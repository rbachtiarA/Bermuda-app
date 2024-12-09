'use client';
import { getToken } from '@/lib/server';
import { getStoreProducts } from '@/lib/store.handler';
import { IProduct } from '@/type/product';
import { useEffect, useState } from 'react';

const ProductExam = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getProducts = async () => {
      try {
        const token = await getToken();
        const fetchedProducts = await getStoreProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {products.map((product) => (
        <div
          className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all"
          key={product.id}
        >
          <div className="p-4">
            <h5 className="text-lg font-semibold text-gray-900">
              {product.name}
            </h5>
            <p className="text-sm text-gray-700">{product.description}</p>
            <p className="text-primary text-xl font-bold">${product.price}</p>
          </div>
          <div className="p-4">
            <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition-all">
              Buy Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductExam;

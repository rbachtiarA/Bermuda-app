'use client';
import ProductDetail from '@/components/product/detailProduct';
import { useParams } from 'next/navigation'; // Gunakan useParams dari next/navigation

export default function ProductPage() {
  const { productId } = useParams(); // Mengambil productId dari URL

  if (!productId) return <div>Loading...</div>;

  return <ProductDetail productId={parseInt(productId as string, 10)} />;
}

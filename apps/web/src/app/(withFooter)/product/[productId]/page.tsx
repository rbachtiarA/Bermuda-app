'use client';
import ProductDetail from '@/components/product/detailProduct';
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const { productId } = useParams();

  if (!productId) return <div>Loading...</div>;

  return <ProductDetail productId={parseInt(productId as string, 10)} />;
}

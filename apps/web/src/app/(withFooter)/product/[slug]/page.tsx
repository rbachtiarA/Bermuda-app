'use client';
import ProductView from '@/features/product/component/View';
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const { slug } = useParams();

  return <ProductView slug={slug as string} />;
}

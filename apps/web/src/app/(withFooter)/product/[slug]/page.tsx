'use client';
import ProductView from '@/features/product/component/View';
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const { slug } = useParams();

  return <ProductView slug={slug as string} />;
}
// export default function ProductPage() {
//   const { productId } = useParams();

//   if (!productId) return <div>Loading...</div>;

//   return <ProductDetail productId={parseInt(productId as string, 10)} />;
// }

'use client';
import useProductList from '../hooks/useProductList';
import ProductCard from './Card';
import GridCarousel from './GridCarousel';
import { SkeletonProductListCarousel } from './skeleton/skeletonProductList';

export default function ProductListCarousel() {
  const { data, store, isLoading } = useProductList();
  return (
    <>
      {store.id === 0 && (
        <p>
          Please Login & create address / Allow our site to access your location
        </p>
      )}
      {isLoading ? (
        <SkeletonProductListCarousel />
      ) : (
        <GridCarousel>
          {data.map((stock) => (
            <ProductCard key={stock.id} stock={stock} />
          ))}
        </GridCarousel>
      )}
    </>
  );
}

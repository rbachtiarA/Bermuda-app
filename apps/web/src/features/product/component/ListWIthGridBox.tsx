'use client';
import useProductList from '../hooks/useProductList';
import ProductCard from './Card';
import GridBox from './GridBox';
import { SkeletonProductListGridBox } from './skeleton/skeletonProductList';

export default function ProductListGridBox() {
  const { data, store, isLoading } = useProductList();
  return (
    <>
      {store.id === 0 && (
        <p>
          Please Login & create address / Allow our site to access your location
        </p>
      )}
      {isLoading ? (
        <SkeletonProductListGridBox />
      ) : (
        <GridBox>
          {data.map((stock) => (
            <ProductCard key={stock.id} stock={stock} />
          ))}
        </GridBox>
      )}
    </>
  );
}

import GridBox from '../GridBox';
import GridCarousel from '../GridCarousel';
import SkeletonProductCard from './SkeletonCard';

export function SkeletonProductListCarousel() {
  return (
    <GridCarousel>
      <SkeletonProductCard />
      <SkeletonProductCard />
      <SkeletonProductCard />
      <SkeletonProductCard />
      <SkeletonProductCard />
    </GridCarousel>
  );
}

export function SkeletonProductListGridBox() {
  return (
    <GridBox>
      <SkeletonProductCard />
      <SkeletonProductCard />
      <SkeletonProductCard />
      <SkeletonProductCard />
      <SkeletonProductCard />
    </GridBox>
  );
}

import PromoCarousel from '@/components/carousel/promo';
import CategoryList from '@/components/category/landingpage/categoryList';
import ProductList from '@/components/product/productListCarousel';
import Wrapper from '@/components/wrapper';
import { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <Wrapper>
      <div className="container mx-auto mt-8">
        <div className="w-full h-full px-[15px]">
          <PromoCarousel />
        </div>
        <div className=''>
          <h2 className='text-2xl font-bold pt-8 px-4'>Products Categories</h2>
          <CategoryList />
        </div>
        <h1 className="text-2xl font-bold pt-8 px-4">
          Selamat Datang di Bermuda Store
        </h1>
        <div className="py-10">
          <ProductList />
        </div>
      </div>
    </Wrapper>
  );
};

export default HomePage;

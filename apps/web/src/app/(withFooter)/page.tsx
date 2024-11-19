import PromoCarousel from '@/components/carousel/promo';
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
        <h1 className="text-2xl font-bold pt-8 px-4">
          Selamat Datang di Toko Grosir Online
        </h1>
        <div className="py-10">
          <ProductList />
        </div>
      </div>
    </Wrapper>
  );
};

export default HomePage;

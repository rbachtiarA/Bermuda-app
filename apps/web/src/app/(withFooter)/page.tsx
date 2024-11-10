import PromoCarousel from '@/components/carousel/promo';
import Wrapper from '@/components/wrapper';
import { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <Wrapper>
      <div className="container mx-auto mt-8">
        <div className="w-full h-full p-4">
          <PromoCarousel />
        </div>
        <h1 className="text-2xl font-bold pt-8 px-4">
          Selamat Datang di Toko Grosir Online
        </h1>
      </div>
    </Wrapper>
  );
};

export default HomePage;

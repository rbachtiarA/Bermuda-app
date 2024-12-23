import TitleBreadcrumbs from '@/components/breadcrumbs/breadcrumbs';
import CardList from '@/components/cart/cartList'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'User Cart | Bermuda Store',
    description:
      'Belanja barang-barang kebutuhan rumah hanya di Bermuda store | Banyak Promo spesial bikin belanja makin hemat | User Cart',
  };
export default function page() {
    return (
        <section className='grid md:grid-cols-[1fr_8fr_1fr] w-full h-full'>
            <div className='md:col-start-2 p-2'>
                <TitleBreadcrumbs title='CART' />
            </div>
            <div className='md:grid md:row-start-2 md:col-start-2'>
                <CardList />
            </div>
        </section>
    )
}
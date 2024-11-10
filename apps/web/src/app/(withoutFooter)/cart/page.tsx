import CartCheckout from '@/components/cart/cartCheckout'
import CardList from '@/components/cart/cartList'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'User Cart | Bermuda Store',
    description:
      'Belanja barang-barang kebutuhan rumah hanya di NextGrocery | Banyak Promo spesial bikin belanja makin hemat',
  };
export default function page() {
    return (
        <section className='flex flex-col justify-center items-center w-full'>
            <h2 className='w-full text-xl font-bold text-center'>CART</h2>
            <CardList />
        </section>
    )
}
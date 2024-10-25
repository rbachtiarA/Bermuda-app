import CartCheckout from '@/components/cart/cartCheckout'
import CardList from '@/components/cart/cartList'
export default function page() {

    return (
        <section className='flex flex-col justify-center items-center w-full'>
            <h2 className='w-full text-xl font-bold text-center'>CART</h2>
            <CardList />
        </section>
    )
}
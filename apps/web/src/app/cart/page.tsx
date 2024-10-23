import CardList from '@/components/cart/cartList'
export default function page() {

    return (
        <section>
            <div className='grid md:grid-cols-[1fr_3fr_1fr]'>
                <div className='md:col-start-2'>
                    <CardList />
                </div>
            </div>
        </section>
    )
}
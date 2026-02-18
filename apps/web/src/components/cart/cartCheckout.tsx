import currencyRupiah from '@/lib/rupiahCurrency'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Spinner } from '@nextui-org/react'
import CartCheckoutItem from './cartCheckoutItem'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { postCheckoutItems } from '@/lib/cart'
import { useRouter } from 'next/navigation'
import { ICartItem } from '@/type/cart'
export default function CartCheckout({isLoading, setIsLoading, checkout, cart}: 
    {isLoading: 'CHECKOUT' | 'DATA' | null, checkout:number[], cart:ICartItem[],  setIsLoading: Dispatch<SetStateAction<'CHECKOUT' | 'DATA' | null>>}) {
    const router = useRouter();

    const totalSelectedItemsAmount = useMemo(() => {
        return cart
          .filter((item) => checkout.includes(item.id))
          .reduce((total, item) => total + item.quantity * item.product?.price!, 0);
    }, [checkout, cart]);
    
    const onCheckout = async () => {
        setIsLoading("CHECKOUT")
        const res = await postCheckoutItems(checkout);
        if(!res.ok) {
            setIsLoading(null)
        } else {
            router.push('/cart/checkout');
        }
    };
    
    function CardDesktopComponents() {
        return (
            <div className='sticky top-2 hidden md:block'>
                <Card className='w-full rounded-none md:rounded-md' >
                    <CardHeader>
                        <h2 className='font-bold text-lg'>Checkout Details</h2>
                    </CardHeader>
                    <CardBody>
                        <CartCheckoutItem />
                        <Divider className='my-1'/>
                        <div className='flex font-semibold justify-between'>
                            <p>Total : </p>
                            <p>{currencyRupiah(totalSelectedItemsAmount)}</p>
                        </div>
                    </CardBody>
                    <CardFooter className='flex w-full justify-end'>
                            <Button color='primary' size='md' isDisabled={checkout.length === 0 || !!isLoading} spinner={<Spinner color='default'/>} isLoading={isLoading === 'CHECKOUT'} onPress={onCheckout}>
                                Checkout
                            </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    } 
    
    function CardMobileComponets() {
        return (
            <div className='fixed w-full bottom-0 block md:hidden'>
                <Card className='w-full rounded-none md:rounded-md' >
                    <CardBody>
                        <div className='grid grid-cols-2'>
                            <div className='flex flex-col justify-between'>
                                <p>Total : </p>
                                <p>{currencyRupiah(totalSelectedItemsAmount)}</p>
                            </div>
                            <Button color='primary' size='md' isDisabled={checkout.length === 0 || !!isLoading} spinner={<Spinner color='default'/>} isLoading={isLoading === 'CHECKOUT'} onPress={onCheckout}>
                                Checkout
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        )
    }

    return (
        <>
            <CardDesktopComponents />
            <CardMobileComponets />
        </>
    )
}
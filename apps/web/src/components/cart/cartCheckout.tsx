import currencyRupiah from '@/lib/rupiahCurrency'
import { Button, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react'
export default function CartCheckout({ totalPayment, checkout }: { totalPayment: number, checkout: number[] }) {

    const nextCardDesktop = 
    <div className='sticky top-0 hidden md:block'>
        <Card className='w-full rounded-none md:rounded-md' >
            <CardHeader>
                <h2 className='font-bold text-lg'>Checkout Details</h2>
            </CardHeader>
            <CardBody>
                <div className='flex flex-col justify-between'>
                    <p>Total : </p>
                    <p>{currencyRupiah(totalPayment)}</p>
                </div>
            </CardBody>
            <CardFooter className='flex w-full justify-end'>
                <Button color='primary' size='md' isDisabled={checkout.length === 0}>Checkout</Button>
            </CardFooter>
        </Card>
    </div>

    const nextCardMobile = 
    <div className='sticky bottom-0 block md:hidden'>
        <Card className='w-full rounded-none md:rounded-md' >
            <CardBody>
                <div className='grid grid-cols-2'>
                    <div className='flex flex-col justify-between'>
                        <p>Total : </p>
                        <p>{currencyRupiah(totalPayment)}</p>
                    </div>
                    <Button color='primary' size='md' isDisabled={checkout.length === 0}>Checkout</Button>
                </div>
            </CardBody>
        </Card>
    </div>

    const simpleCard = 
    <div className={`
        sticky bottom-[56px] md:top-[12px] md:max-h-[200px] bg-default 
        flex md:flex-col justify-between items-center px-4 md:py-2 mt-4 w-full`}>
        <div className='w-full'>
            <h2 className='font-bold text-lg'>Checkout Details</h2>

            <div className='flex justify-between'>
                <p>Total : </p>
                <p>{currencyRupiah(totalPayment)}</p>
            </div>
        </div>
        <div className='flex justify-end w-full'>
            <Button color='primary' size='md' isDisabled={checkout.length === 0}>Checkout</Button>
        </div>
    </div>
    return (
        <>
            {nextCardDesktop}
            {nextCardMobile}
        </>
    )
}
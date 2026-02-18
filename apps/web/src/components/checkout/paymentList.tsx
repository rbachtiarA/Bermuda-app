'use client'
import currencyRupiah from "@/lib/rupiahCurrency";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Spinner } from "@nextui-org/react";
import DiscountButton from "./discountButton";
import { IDiscount } from "@/type/discount";
export default function PaymentTotalList(
    {
        discount, discountCut, itemTotalPayment, travelPayment, isPaymentInvalid, isLoading, isError, 
        updateMethodPayment, onBuy, onDiscount} 
    : 
    { 
        discount: IDiscount | null, discountCut: number, itemTotalPayment:number, travelPayment: number | null, isLoading: boolean, methodPayment: 'Transfer' | 'Gateway' | null, isPaymentInvalid: boolean,
        isError:string | null,updateMethodPayment: (paymentMethod:string) => void, onBuy: () => void, onDiscount: (discount: IDiscount| null) => void
    }) {
    const totalTransaction = (itemTotalPayment? itemTotalPayment : 0) + (travelPayment? travelPayment : 0) - (discountCut? discountCut : 0)
    const paymentMethodOptions = () => {
        return (
            <select className={`p-2 w-full bg-slate-100 rounded-sm`} onChange={(e) => updateMethodPayment(e.currentTarget.value)}>
                <option value={''}>- Choose payment method -</option>
                <option value={'Transfer'}>Manual</option>
                <option value={'Gateway'}>Payment Gateway</option>
            </select>
        )
    }

    function ItemDetails({label, price, className, ...props}: {label: string, price: number | null, className?: string}) {
        return (
            <div className={`flex gap-4 justify-between ${className}`} {...props}>
                <p>{label}</p>
                <p>{price? currencyRupiah(price): '-'}</p>
            </div>
        )
    } 

    return (
        <Card className="md:sticky top-2">
            <CardHeader>
                <h2 className="font-semibold">Total Payment Details</h2>
            </CardHeader>

            <CardBody>
                <ItemDetails label="Total items price" price={itemTotalPayment} />
                <ItemDetails label="Discount Cut" price={-discountCut} />
                <ItemDetails label="Shipping Cost" price={travelPayment} />
                <Divider />
                <ItemDetails label="Total Transaction" price={totalTransaction} className="font-bold my-2"/>
                <Divider />
            </CardBody>
            <CardFooter className="flex flex-col gap-1">
                    <div className="w-full mb-2">
                        <DiscountButton itemTotalPayment={itemTotalPayment} discount={discount} onSelectDiscount={onDiscount}/> 
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <h2 className="font-semibold">Payment Method</h2>
                        {paymentMethodOptions()}
                        <Divider />    
                    </div>
                        {isError !== null && <p className="text-danger text-wrap md:max-w-[270px]">{isError}</p>}
                        <Button color="primary" className="my-2" onPress={onBuy} spinner={<Spinner color="default" />} fullWidth isDisabled={isPaymentInvalid} isLoading={isLoading}>{isLoading? 'Creating...' :'Buy now' }</Button>
            </CardFooter>
        </Card>
    )
}
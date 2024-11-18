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
    
    const paymentMethodOptions = () => {
        return (
            <select className={`p-2 w-full bg-slate-100 rounded-sm`} onChange={(e) => updateMethodPayment(e.currentTarget.value)}>
                <option value={''}>- Choose payment method -</option>
                <option value={'Transfer'}>Transfer</option>
                <option value={'Gateway'}>Payment Gateway</option>
            </select>
        )
    }

    return (
        <Card className="md:sticky top-2">
            <CardHeader>
                <h2 className="font-semibold">Total Payment Details</h2>
            </CardHeader>

            <CardBody>
                <div className="flex gap-4 justify-between">
                    <p>Total items price</p>
                    <p>{itemTotalPayment? currencyRupiah(itemTotalPayment): '-'}</p>
                </div>
                <div className="flex justify-between gap-4">
                    <p>Discount cut</p>
                    <p>{discountCut? `- ${currencyRupiah(discountCut)}` : '-'}</p>
                </div>
                <div className="flex justify-between gap-4">
                    <p>Shipping Cost</p>
                    <p>{travelPayment? currencyRupiah(travelPayment) : '-'}</p>
                </div>
                <Divider />
                <div className="flex gap-4 justify-between font-bold my-2">
                    <p>Total Transaction</p>
                    <p>{currencyRupiah((itemTotalPayment? itemTotalPayment : 0) + (travelPayment? travelPayment : 0) - (discountCut? discountCut : 0))}</p>
                </div>
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
                        <Button color="primary" className="my-2" onPress={onBuy} fullWidth isDisabled={isPaymentInvalid || isLoading}>{isLoading? <Spinner color="default"/> :'Buy now' }</Button>
                        {isError !== null && <p className="text-sm text-warning-500 text-wrap md:max-w-[270px]">{isError}</p>}
            </CardFooter>
        </Card>
    )
}
import currencyRupiah from "@/lib/rupiahCurrency";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Select, SelectItem } from "@nextui-org/react";

export default function PaymentTotalList(
    {
        itemTotalPayment, travelPayment, methodPayment, isPaymentValid, 
        updateMethodPayment, updateGatewayService} 
    : 
    { 
        itemTotalPayment:number | null, travelPayment: number | null, methodPayment: 'TRANSFER' | 'PAYMENT_GATEWAY' | null, isPaymentValid: boolean
        updateMethodPayment: (paymentMethod:string) => void, updateGatewayService: (paymentGatewayService: string) => void 
    }) {

    const paymentMethodOptions = () => {
        return (
            <select className="w-full my-2" onChange={(e) => updateMethodPayment(e.currentTarget.value)}>
                <option value={''}>- pilih metode pembayaran -</option>
                <option value={'TRANSFER'}>Transfer</option>
                <option value={'PAYMENT_GATEWAY'}>Payment Gateway</option>
            </select>
        )
    }

    const paymentGatewayOptions = () => {
        return (
            <select className="w-full my-2" onChange={(e) => updateGatewayService(e.currentTarget.value)}>
                <option value={''}>- pilih jasa pembayaran -</option>
                <option value={'MOBILE_BANKING'}>Mobile Banking</option>
                <option value={'CREDIT_CARD'}>Credit Card</option>
            </select>
        )
    }

    return (
        <Card className="md:sticky top-2">
            <CardHeader>
                <h2 className="font-semibold">Ringkasan Total Pembayaran</h2>
            </CardHeader>

            <CardBody>
                <div className="flex gap-4 justify-between">
                    <p>Total Harga Barang</p>
                    <p>{itemTotalPayment? currencyRupiah(itemTotalPayment): '-'}</p>
                </div>
                <div className="flex justify-between gap-4">
                    <p>Harga Jasa Pengiriman</p>
                    <p>{travelPayment? currencyRupiah(travelPayment) : '-'}</p>
                </div>
                <Divider />
                <div className="flex gap-4 justify-between font-bold my-2">
                    <p>Total Transaksi Pembayaran</p>
                    <p>{currencyRupiah((itemTotalPayment? itemTotalPayment : 0) + (travelPayment? travelPayment : 0))}</p>
                </div>
                <Divider />
            </CardBody>
            <CardFooter className="flex flex-col">
                    <div className="w-full flex flex-col">
                        <h2 className="font-semibold">Metode Pembayaran</h2>
                        {paymentMethodOptions()}
                        {methodPayment === 'PAYMENT_GATEWAY' && paymentGatewayOptions()}
                        <Divider />    
                    </div>
                        <Button color="primary" className="my-2" fullWidth isDisabled={isPaymentValid}>Bayar Sekarang</Button>
            </CardFooter>
        </Card>
    )
}
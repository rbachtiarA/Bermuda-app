import currencyRupiah from "@/lib/rupiahCurrency";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from "@nextui-org/react";

export default function PaymentTotalList(
    {
        itemTotalPayment, travelPayment, methodPayment, paymentGatewayService, isPaymentInvalid, handphone, creditCard,
        updateMethodPayment, updateGatewayService, updateHandphone, updateCreditCard} 
    : 
    { 
        itemTotalPayment:number | null, travelPayment: number | null, methodPayment: 'TRANSFER' | 'PAYMENT_GATEWAY' | null, paymentGatewayService: 'MOBILE_BANKING' | 'CREDIT_CARD' | null, 
        handphone: string, creditCard: string, isPaymentInvalid: boolean,
        updateMethodPayment: (paymentMethod:string) => void, updateGatewayService: (paymentGatewayService: string) => void, 
        updateHandphone: (value: string) => void, updateCreditCard: (value: string) => void 
    }) {

    const paymentMethodOptions = () => {
        return (
            <select className={`p-2 w-full bg-slate-100 rounded-sm`} onChange={(e) => updateMethodPayment(e.currentTarget.value)}>
                <option value={''}>- pilih metode pembayaran -</option>
                <option value={'TRANSFER'}>Transfer</option>
                <option value={'PAYMENT_GATEWAY'}>Payment Gateway</option>
            </select>
        )
    }

    const paymentGatewayOptions = () => {
        return (
            <select className="p-2 w-full bg-slate-100 rounded-sm" onChange={(e) => updateGatewayService(e.currentTarget.value)}>
                <option value={''}>- pilih jasa pembayaran -</option>
                <option value={'MOBILE_BANKING'}>Mobile Banking</option>
                <option value={'CREDIT_CARD'}>Credit Card</option>
            </select>
        )
    }

    const paymentGatewayInput = (paymentGateway: 'MOBILE_BANKING' | 'CREDIT_CARD' | null) => { 
        switch (paymentGateway) {
            case "MOBILE_BANKING":
                return (
                    <div>
                        <Input type="number" label={'Masukkan no. Handphone'} name='MOBILE_BANKING' value={handphone} onChange={(e) => updateHandphone(e.currentTarget.value)}/>
                    </div>
                )
    
            case "CREDIT_CARD":
                return (
                    <div>
                        <Input type="number" label={'Masukkan no. Kartu Kredit'} name='CREDIT_CARD' value={creditCard} onChange={(e) => updateCreditCard(e.currentTarget.value)}/>
                    </div>
                )
                    
            default:
                break;
        }
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
                    <div className="w-full flex flex-col gap-2">
                        <h2 className="font-semibold">Metode Pembayaran</h2>
                        {paymentMethodOptions()}
                        {methodPayment === 'PAYMENT_GATEWAY' && paymentGatewayOptions()}
                        {paymentGatewayInput(paymentGatewayService)}
                        <Divider />    
                    </div>
                        <Button color="primary" className="my-2" fullWidth isDisabled={isPaymentInvalid}>Bayar Sekarang</Button>
            </CardFooter>
        </Card>
    )
}
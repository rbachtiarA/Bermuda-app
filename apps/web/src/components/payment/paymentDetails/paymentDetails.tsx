import PaymentList from "./paymentList"
import currencyRupiah from "@/lib/rupiahCurrency"

export default function PaymentDetails({orderId, status, totalAmount, paymentMethod}: {orderId: number, status: string | undefined, totalAmount: number, paymentMethod: string}) {

    return (
        <ul>
            <PaymentList label={'Order Id'} value={`${orderId}`} />
            <PaymentList label={'Payment Method'} value={`${paymentMethod}`} />
            <PaymentList label={'Status Payment'} value={`${status}`} />
            <PaymentList label={'Total Amount'} value={currencyRupiah(totalAmount!)} />
        </ul>            
    )
}
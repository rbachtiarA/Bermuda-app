import { IOrder, IOrderItem } from "@/type/order"
import PaymentList from "./paymentList"
import currencyRupiah from "@/lib/rupiahCurrency"
import PaymentItems from "./paymentItems"
import { Divider } from "@nextui-org/react"
import StatusCell from "@/components/order/tableCell/statusCell"

export default function PaymentDetails({orderId, status, totalAmount, paymentMethod, items, DiscountAmount,shippingCost}: {
    shippingCost: number, DiscountAmount:number, items:IOrderItem[],orderId: number, status: string | undefined, totalAmount: number, paymentMethod: string}) {
        const totalItemsPrice = items.reduce((prev, item) => prev + item.price*item.quantity , 0)
    return (
        <ul className="flex flex-col gap-1">
            <PaymentList label={'Order Id'} value={`${orderId}`} />
            <PaymentList label={'Payment Method'} value={`${paymentMethod}`} />
            {/* <PaymentList label={'Status Payment'} value={`${status === 'PendingPayment'?'Pending':status}`} /> */}
            <div className="flex justify-between">
                <p>Status Payment :</p>
                <StatusCell status={status as IOrder['status']}/>
            </div>
            <PaymentItems items={items}/>
            <PaymentList label={'Total Item price'} value={currencyRupiah(totalItemsPrice)} />
            <PaymentList label={'Shipping Cost'} value={currencyRupiah(shippingCost)} />
            <PaymentList label={'Discount Amount'} value={`-${currencyRupiah(DiscountAmount)}`} />
            <Divider />
            <PaymentList label={'Total Amount'} value={currencyRupiah(totalAmount!)} className="font-bold"/>
        </ul>            
    )
}
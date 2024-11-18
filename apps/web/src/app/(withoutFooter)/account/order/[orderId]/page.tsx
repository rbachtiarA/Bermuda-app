import OrderCard from "@/components/order/orderCard"
import { getOrderById } from "@/lib/order.handler"
import { IOrder } from "@/type/order"

export default async function page({params}: { params: { orderId: string } }) {
    const data = await getOrderById(Number(params.orderId))
    const order = data.msg as IOrder
    
    return (
        <div className="grid md:grid-cols-[1fr_3fr_1fr]">
            <OrderCard order={order} className="md:col-start-2 flex flex-col gap-2 my-2"/>
        </div>
    )
}
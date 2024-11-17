import TitleBreadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import OrderCard from "@/components/order/orderCard"
import { getOrderById } from "@/lib/order.handler"
import { IOrder } from "@/type/order"

export default async function page({params}: { params: { orderId: string } }) {
    const data = await getOrderById(Number(params.orderId))
    const order = data.msg as IOrder
    console.log(order);
    
    return (
        <div className="grid md:grid-cols-3 my-2">
            <OrderCard order={order} className="md:col-start-2 flex flex-col gap-2"/>
        </div>
    )
}
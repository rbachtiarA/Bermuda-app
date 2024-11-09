import OrderList from "@/components/order/user/orderUserList";

export default function page() {
  return (
    <div className="">
        <h2>ALL USER ORDER</h2>
        <div className="">
          <div className="grid md:grid-cols-[1fr_760px_1fr]">
            <OrderList />
          </div>
        </div>
    </div>
  )
}

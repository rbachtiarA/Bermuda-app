import OrderList from "@/components/order/user/orderUserList";

export default function page() {
  return (
    <div className="mt-2">
        <h2 className="text-center font-bold text-xl">USER ORDER</h2>
        <div className="">
          <div className="grid md:grid-cols-[1fr_760px_1fr]">
            <OrderList />
          </div>
        </div>
    </div>
  )
}

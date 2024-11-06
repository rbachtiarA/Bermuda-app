import OrderStoreList from "@/components/order/admin/orderStoreList";
export default function page() {
  return (
    <div className="">
        <h2>ALL STORE ORDER</h2>
        <div className="grid md:grid-cols-[1fr_2fr_1fr]">
          <OrderStoreList />
        </div>
    </div>
  )
}

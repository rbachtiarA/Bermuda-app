import AdminOrderList from "@/components/order/admin/orderStoreList";
export default function page() {
  return (
    <div className="">
        <h2>ALL STORE ORDER</h2>
        <div>
          <div className="grid md:grid-cols-[1fr_5fr_1fr]">
            <AdminOrderList />
          </div>
        </div>
    </div>
  )
}

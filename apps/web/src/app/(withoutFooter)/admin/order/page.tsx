import AdminOrderList from "@/components/order/admin/orderStoreList";
export default function page() {
  return (
    <div className="mt-2 w-full">
        <h2 className="text-center font-bold text-lg">STORE ORDER MANAGEMENT</h2>
        <div>
          <div className="grid md:grid-cols-[1fr_5fr_1fr]">
            <AdminOrderList />
          </div>
        </div>
    </div>
  )
}

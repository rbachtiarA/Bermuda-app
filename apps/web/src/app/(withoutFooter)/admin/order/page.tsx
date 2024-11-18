import AdminOrderList from "@/components/order/admin/orderStoreList";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: 'Order Management | Dashboard | Bermuda Store',
  description:
    'Belanja barang-barang kebutuhan rumah hanya di Bermuda store | Banyak Promo spesial bikin belanja makin hemat | Admin Management',
};
export default function page() {
  return (
    <div className="mt-2 w-full">
          <div className="grid md:grid-cols-[1fr_6fr_1fr]">
            <AdminOrderList />
          </div>
    </div>
  )
}

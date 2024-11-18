import OrderList from "@/components/order/user/orderUserList";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: 'My Order | Bermuda Store',
  description:
    'Belanja barang-barang kebutuhan rumah hanya di Bermuda store | Banyak Promo spesial bikin belanja makin hemat | My Order',
};
export default function page() {
  return (
    <div className="">
        <h2 className="text-center font-bold text-xl hidden md:block">USER ORDER</h2>
        <div className="">
          <div className="grid md:grid-cols-[1fr_760px_1fr]">
            <OrderList />
          </div>
        </div>
    </div>
  )
}

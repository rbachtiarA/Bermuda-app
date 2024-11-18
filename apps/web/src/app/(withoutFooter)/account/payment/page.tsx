import PaymentCard from "@/components/payment/paymentCard";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: 'My Active Payment | Bermuda Store',
    description:
      'Belanja barang-barang kebutuhan rumah hanya di Bermuda store | Banyak Promo spesial bikin belanja makin hemat | Active Payment',
  };
export default function page() {
    
    return (
        <div className="grid md:grid-cols-[1fr_2fr_1fr]">
            <div className="mt-2 md:col-start-2 md:row-start-2 ">
                <PaymentCard />
            </div>
        </div>
    )
}
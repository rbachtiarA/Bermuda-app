import UserDetails from "@/components/userProfile/userDetails";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'My Account | Bermuda Store',
  description:
    'Belanja barang-barang kebutuhan rumah hanya di Bermuda store | Banyak Promo spesial bikin belanja makin hemat | My Account',
};
export default function page() {
  return (
    <div  className="flex flex-col max-w-[600px] mx-auto">
      <UserDetails />
    </div>
  )
}

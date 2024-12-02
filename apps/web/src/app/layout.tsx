import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from './AppProvider';
import AddressBar from '@/components/address/addressBar';
import SiteNavbar from '@/components/navbar/siteNavbar';
import { ToastContainer } from 'react-toastify';
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'Website Belanja Kebutuhan Rumah Tangga',
  description:
    'Belanja barang-barang kebutuhan rumah hanya di NextGrocery | Banyak Promo spesial bikin belanja makin hemat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} relative`}>
          <AppProvider>
              <div className='sticky top-0 z-[14]'>
                <AddressBar />
                <SiteNavbar />
              </div>
              
              {children}
              {/* <BottomNavbar /> */}
              <ToastContainer theme="colored" toastStyle={{fontSize: '12px'}} position="top-center" autoClose={2000}/>
          </AppProvider>            
      </body>
    </html>
  );
}

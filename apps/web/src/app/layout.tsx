import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import "react-toastify/dist/ReactToastify.css";

import { AppProvider } from './AppProvider';
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
              {/* <AddressBar />
              <SiteNavbar /> */}
              {/* <main className='flex-1'> */}
                {children}
              {/* </main> */}
              {/* <Footer />
              <BottomNavbar /> */}
          </AppProvider>            
      </body>
    </html>
  );
}

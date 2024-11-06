import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/components/reduxStore/storeProvider';
import { NextProviders } from './nextuiProvider';

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
        <NextProviders>
          <StoreProvider>{children}</StoreProvider>
        </NextProviders>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';

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
    <main className="flex flex-col min-h-[100vh-97px]">
      <section className="flex-1">
        {children}
      </section>
    </main>
  );
}

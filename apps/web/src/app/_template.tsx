import AddressBar from '@/components/address/addressBar';
import BottomNavbar from '@/components/bottomNavbar/bottomNavbar';
import Footer from '@/components/footer/footer';
import SiteNavbar from '@/components/navbar/siteNavbar';
import React from 'react';

export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='flex flex-col min-h-screen w-full'>
      <AddressBar />
      <SiteNavbar />
      <main className='flex-1'>
        {children}
      </main>
      <Footer />
      <BottomNavbar />
    </div>
  );
}

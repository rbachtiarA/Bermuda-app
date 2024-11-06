import AddressBar from '@/components/address/addressBar';
import BottomNavbar from '@/components/bottomNavbar/bottomNavbar';
import Footer from '@/components/footer/footer';
import SiteNavbar from '@/components/navbar/siteNavbar';
import React from 'react';

export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <AddressBar />
      <SiteNavbar />
      {children}
      <Footer />
      <BottomNavbar />
    </div>
  );
}

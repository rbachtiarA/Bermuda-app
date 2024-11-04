'use client'

import AddressBar from './addressBar';
import SiteLogo from './logo';
import Navbar from './navbar';
import CategoryDropdown from './category';
import AvatarMenu from './avatar';

export const Header = () => {  
  return (
    <div className="shadow-lg w-full pb-3">
      <div className="container">
        <AddressBar />
      </div>
      <div className="flex container mx-auto items-center">
        <SiteLogo />
        <CategoryDropdown />
        <Navbar />
        <AvatarMenu />
      </div>
    </div>
  );
};

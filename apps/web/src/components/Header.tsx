'use client';

import AddressBar from './address/addressBar';
import SiteLogo from './logo';
import CategoryDropdown from './category';
import AvatarMenu from './avatar';
import SiteNavbar from './Navbar';

export const Header = () => {
  return (
    <div className="shadow-lg w-full pb-3">
      <div className="container">
        <AddressBar />
      </div>
      <div className="flex container mx-auto items-center">
        <SiteLogo />
        <CategoryDropdown />
        <SiteNavbar />
        <AvatarMenu />
      </div>
    </div>
  );
};

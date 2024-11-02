import { getToken } from '@/lib/server';
import AddressBar from './addressBar';
import SiteLogo from './logo';
import Navbar from './navbar';
import Link from 'next/link';
import AvatarMenu from './avatar';
import CategoryDropdown from './category';

export const Header = async () => {
  const token = await getToken();
  return (
    <div className="shadow-lg w-full pb-3">
      <div className="container">
        <AddressBar />
      </div>
      <div className="flex container mx-auto items-center">
        <SiteLogo />
        <CategoryDropdown />
        <Navbar />
        {token ? (
          <Link href="#">Keluar</Link>
        ) : (
          <div className="gap-1">
            <Link href="/register">Daftar</Link>
            <Link href="/login">Masuk</Link>
          </div>
        )}
      </div>
    </div>
  );
};

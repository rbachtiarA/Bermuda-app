'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from '@nextui-org/react';
import SiteLogo from './../logo';
import Category from './../category';
import { getToken } from '@/lib/server';
import DropdownNav from './dropdown';
import { useEffect, useState } from 'react';
import SearchNav from './searchNav';

export default function SiteNavbar() {
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getToken();
      setToken(fetchedToken ?? null);
    };

    fetchToken();
  }, []);

  return (
    <Navbar isBordered className="shadow-lg px-4">
      <NavbarContent className="justify-between w-full ">
        <NavbarContent justify="start" className="w-auto">
          <Link color="foreground" href="/">
            <NavbarBrand className="flex items-center gap-2">
              <SiteLogo />
              <p className="hidden sm:block font-bold text-inherit">
                Bermuda Store
              </p>
            </NavbarBrand>
          </Link>
          <Category />
        </NavbarContent>

        <NavbarContent justify="center" className="flex-1 mx-4">
          <SearchNav />
        </NavbarContent>

        <NavbarContent justify="end" className="w-auto">
          {token ? (
            <DropdownNav />
          ) : (
            <NavbarItem className="flex gap-3">
              <Link color="foreground" href="/register" className="text-gray-500"
              >
                Daftar
              </Link>
              <Link color="foreground" href="/login" className="text-gray-500">
                Masuk
              </Link>
            </NavbarItem>
          )}
        </NavbarContent>
      </NavbarContent>
    </Navbar>
  );
}

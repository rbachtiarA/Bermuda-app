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
    <Navbar isBordered className="shadow-lg">
      <NavbarContent justify="start">
        <Link color="foreground" href="/">
          <NavbarBrand className="mr-4">
            <SiteLogo />
            <p className="hidden sm:block font-bold text-inherit">
              Bermuda Store
            </p>
          </NavbarBrand>
        </Link>
      </NavbarContent>
      <NavbarContent justify="center" className="">
        <SearchNav />
      </NavbarContent>
      <NavbarContent justify="end" className="items-center">
        <Category />
        {!token && (
          <NavbarItem>
            <Link color="foreground" href="/register">
              Register
            </Link>
          </NavbarItem>
        )}
        {token ? (
          <DropdownNav />
        ) : (
          <NavbarItem>
            <Link color="foreground" href="/login">
              Log In
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}

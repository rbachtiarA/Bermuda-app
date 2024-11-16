'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Spinner,
  Button,
  Divider,
} from '@nextui-org/react';
import SiteLogo from './../logo';
import Category from './../category';
import { deleteToken, getToken } from '@/lib/server';
import DropdownNav from './dropdown';
import { useEffect, useState } from 'react';
import SearchNav from './searchNav';
import CartNavbar from './cartNavbar';
import { useDebounce } from 'use-debounce';
import HamburgerNavbar from './hamburgerNavbar';
import { IProduct } from '@/type/product';
import { getProducts } from '@/lib/product.handler';
import { useAppDispatch } from '@/redux/hook';
import { resetCart } from '@/redux/slice/cartSlice';
import { resetCheckout } from '@/redux/slice/checkoutSlice';
import { logoutAction } from '@/redux/slice/userSlice';
import { getClientLocation } from '@/lib/address';
import NavbarMobileHamburger from './navbarMobile/navbarMobileHamburger';

export default function SiteNavbar() {
  const dispatch = useAppDispatch()
  const [token, setToken] = useState<string | null>(null);
  const [searchData, setSearchData] = useState<IProduct[]>([])
  const [search, setSearch] = useState('')
  const [debounceSearch] = useDebounce(search, 2000)
  const [dropdownSearch, setDropdownSearch] = useState(false)
  const [dropdownHamburger, setDropdownHamburger] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const onLogout = async () => {
    await deleteToken();
    dispatch(resetCart())
    dispatch(resetCheckout())
    dispatch(logoutAction())
    setToken('')
  }
  
  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getToken();
      setToken(fetchedToken ?? null);
    };
    getClientLocation()
    fetchToken();
  }, []);
  
  useEffect(() => {
    if(search.length >= 3)
    setIsLoading(true)
  }, [search])

  useEffect(() => {
    const getProductsSearch = async () => {
        const { products } = await getProducts(debounceSearch)
        setSearchData([...products])
    }
    if(debounceSearch.length >= 3) { 
      getProductsSearch() 
    } else if(debounceSearch.length === 0) {
      setSearchData([])
    }
    setIsLoading(false)
  },[debounceSearch])

  return (
    <>
      <Navbar isBordered className="shadow-lg px-4 hidden md:flex">
          <NavbarContent>
            <Link color="foreground" href="/">
              <NavbarBrand className="flex items-center gap-2">
                <SiteLogo />
                <p className="hidden sm:block font-bold text-inherit">
                  Bermuda Store
                </p>
              </NavbarBrand>
            </Link>
          </NavbarContent>
          <NavbarContent>
            <Category />
          </NavbarContent>
          <NavbarContent justify="center" className="flex-1 mx-4">
            <SearchNav search={search} setSearch={setSearch} setDropdown={setDropdownSearch}/>
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
      </Navbar>
      {/* Mobile Nav */}
      <Navbar isBordered shouldHideOnScroll={!dropdownSearch} className='md:hidden z-[13]'>
        <NavbarContent className='grid grid-cols-[8fr_1fr_1fr] w-full'>
          <SearchNav search={search} setSearch={setSearch} setDropdown={setDropdownSearch}/>
          <CartNavbar />
          <HamburgerNavbar setDropdownHamburger={setDropdownHamburger} />
        </NavbarContent>
      </Navbar>
      
      <NavbarMobileHamburger 
        dropdownHamburger={dropdownHamburger}
        dropdownSearch={dropdownSearch}
        isLoading={isLoading}
        onLogout={onLogout}
        searchData={searchData}
        setDropdownHamburger={setDropdownHamburger}
        setDropdownSearch={setDropdownSearch}
        token={token}
      />      
    </>
  );
}

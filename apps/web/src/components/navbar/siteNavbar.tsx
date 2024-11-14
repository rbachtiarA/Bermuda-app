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
import ProductNavCard from '../product/productNavCard';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { resetCart } from '@/redux/slice/cartSlice';
import { resetCheckout } from '@/redux/slice/checkoutSlice';
import NavbarMobileMenu from './navbarMobile/navbarMobileMenu';
import { logoutAction } from '@/redux/slice/userSlice';

export default function SiteNavbar() {
  const dispatch = useAppDispatch()
  const [token, setToken] = useState<string | null>(null);
  const [searchData, setSearchData] = useState<IProduct[]>([])
  const [search, setSearch] = useState('')
  const [debounceSearch] = useDebounce(search, 2000)
  const [dropdownSearch, setDropdownSearch] = useState(false)
  const [dropdownHamburger, setDropdownHamburger] = useState(false)
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

    fetchToken();
  }, []);

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
      <Navbar isBordered shouldHideOnScroll={!dropdownSearch} className='md:hidden z-[13]'>
        <NavbarContent className='grid grid-cols-[8fr_1fr_1fr] w-full'>
          <SearchNav search={search} setSearch={setSearch} setDropdown={setDropdownSearch}/>
          <CartNavbar />
          <HamburgerNavbar setDropdownHamburger={setDropdownHamburger} />
        </NavbarContent>
      </Navbar>
      
      <div className={`fixed top-[64px] md:top-[97px] z-[12] bg-foreground-500/50 h-screen w-full ${dropdownSearch? 'max-h-screen': 'max-h-0'}`}>
        <div className={`flex flex-col bg-foreground-100 w-full ${dropdownSearch? 'max-h-[400px]': 'max-h-0'} overflow-auto transition-all ease-in-out px-2`}>
          <div className='flex w-full justify-end p-2'>
            <span onClick={() => setDropdownSearch(false)} className='hover:cursor-pointer'>X</span>
          </div>
          <div className='flex flex-col md:flex-row gap-2 pb-2'>
            {searchData.map((product) => (
                <ProductNavCard key={product.id} product={product} />
            ))}
          </div>
        </div>  
      </div>
      <div className={`fixed top-[64px] md:top-[95px] z-[11] bg-foreground-500/50 w-full h-screen ${dropdownHamburger? 'max-h-screen': 'max-h-0'}`}>
        <div className={`bg-foreground-100 h-screen w-full ${dropdownHamburger? 'max-h-screen': 'max-h-0'} overflow-auto transition-all ease-in-out`}>
            <div className='w-full flex justify-between my-2 px-4 text-xl'>
              <h2 className='font-bold'>Menu</h2>
              <span onClick={() => setDropdownHamburger(false)} className='hover:cursor-pointer'>X</span>
            </div>
            <Divider />
            <NavbarMobileMenu onLogout={onLogout} token={token}/>
        </div>  
      </div>
      
    </>
  );
}

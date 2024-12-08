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
  Badge,
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
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { resetCart } from '@/redux/slice/cartSlice';
import { resetCheckout } from '@/redux/slice/checkoutSlice';
import { logoutAction } from '@/redux/slice/userSlice';
import NavbarMobileHamburger from './navbarMobile/navbarMobileHamburger';
import LinkButtonBottomNavbar from '../bottomNavbar/LinkButton.BottomNavbar';
import { useRouter } from 'next/navigation';
import ProductIcon from '../icon/productIcon';

export default function SiteNavbar() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const [token, setToken] = useState<string | null>(null);
  const [searchData, setSearchData] = useState<IProduct[]>([]);
  const [search, setSearch] = useState('');
  const [debounceSearch] = useDebounce(search, 2000);
  const [dropdownSearch, setDropdownSearch] = useState(false);
  const [dropdownHamburger, setDropdownHamburger] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onLogout = async () => {
    await deleteToken();
    dispatch(resetCart());
    dispatch(resetCheckout());
    dispatch(logoutAction());
    setToken('');
  };

  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getToken();
      setToken(fetchedToken ?? null);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (search.length >= 3) setIsLoading(true);
  }, [search]);

  useEffect(() => {
    const getProductsSearch = async () => {
      const { products } = await getProducts(debounceSearch);
      setSearchData([...products]);
      setIsLoading(false);
    };
    if (debounceSearch.length >= 3) {
      getProductsSearch();
    } else if (debounceSearch.length === 0) {
      setSearchData([]);
    }
    
  }, [debounceSearch]);

  return (
    <>
      <Navbar isBordered maxWidth="full" className="shadow-sm hidden md:flex">
        <NavbarBrand className="w-full justify-start">
          <Link color="foreground" href="/">
            <SiteLogo />
          </Link>
        </NavbarBrand>

        <NavbarContent justify="center" className="ml-2">
          <NavbarItem>
            <Button
              color="default"
              variant="light"
              onPress={() => router.push('/product')}
            >
              <ProductIcon size={20} />
              Product
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Category />
          </NavbarItem>

          <NavbarItem className="lg:w-full lg:min-w-[400px]">
            <SearchNav
              search={search}
              setSearch={setSearch}
              setDropdown={setDropdownSearch}
            />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="flex-shrink-0 md:hidden lg:flex">
            <Badge content={cart.length} color="primary">
              <LinkButtonBottomNavbar
                label=""
                href="/cart"
                imgsrc="/icon-shopping-cart.svg"
                imgalt="cart"
                component={<></>}
              />
            </Badge>
          </NavbarItem>

          <NavbarItem>
            {token ? (
              <DropdownNav />
            ) : (
              <div className="flex gap-2">
                <Button
                  onPress={() => router.push('/register')}
                  color="primary"
                  variant="ghost"
                >
                  Register
                </Button>
                <Button onPress={() => router.push('/login')} color="primary">
                  Login
                </Button>
              </div>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Mobile Nav */}
      <Navbar
        isBordered
        shouldHideOnScroll={!dropdownSearch && !dropdownHamburger}
        className="md:hidden z-[13]"
      >
        <NavbarContent className="grid grid-cols-[8fr_1fr_1fr] w-full">
          <SearchNav
            search={search}
            setSearch={setSearch}
            setDropdown={setDropdownSearch}
          />
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

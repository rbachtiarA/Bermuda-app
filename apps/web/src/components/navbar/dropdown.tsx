'use client';
import { useEffect, useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Avatar,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { deleteToken, getToken } from '@/lib/server';
import Link from 'next/link';
import { resetCart } from '@/redux/slice/cartSlice';
import { resetCheckout } from '@/redux/slice/checkoutSlice';
import { capitalizeWord } from '@/lib/user.handler';
import CartNavbar from './cartNavbar';

export default function DropdownNav() {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user);
  const [token, setToken] = useState<string | null>(null);
  const role = user.role;
  const name = capitalizeWord(user.name);


  const fetchToken = async () => {
    const res = await getToken();
    setToken(res || null);
  };

  const onLogout = async () => {
    await deleteToken();
    dispatch(resetCart())
    dispatch(resetCheckout())
    window.location.href = "/"
  };
  
  useEffect(() => {
    fetchToken();
  }, []);
  
  return (
    <Dropdown placement="bottom-end" isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Avatar
          isBordered
          showFallback
          radius='full'
          src={user.avatarUrl}
          alt="User Avatar"
          size="md"
          color='primary'
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        variant="flat"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <DropdownItem
          key="profile"
          className="h-14 gap-2 border-b"
          textValue={`Signed in as ${user.email || 'no-email@example.com'}`}
        >
          <p className="font-semibold bg-blue">
            {name || 'Akun Belum Masuk'}
          </p>
        </DropdownItem>
        <DropdownItem 
          key="cart"
          className="hidden md:block gap-2 border-b"
          textValue={`User Cart`}
        >
          <CartNavbar />
        </DropdownItem>
        <DropdownItem
          key="Account"
          className="p-2"
          textValue={role === 'SUPER_ADMIN' ? 'Super Admin Account' : 'Akun Saya'}
        >
          <Link
            href={role === 'SUPER_ADMIN' ? '/super-admin-account' : '/account-dashboard'}
          >
            {role === 'SUPER_ADMIN' ? 'Super Admin Account' : 'Akun Saya'}
          </Link>
        </DropdownItem>

        <DropdownItem
          key="logout"
          color="danger"
          textValue="Log Out"
          onClick={onLogout}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

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

export default function DropdownNav() {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user);
  const [token, setToken] = useState<string | null>(null);
  const role = user.role;

  const fetchToken = async () => {
    const res = await getToken();
    setToken(res || null);
  };

  const onLogout = async () => {
    await deleteToken();
    dispatch(resetCart())
    dispatch(resetCheckout())
    router.push('/');
    router.refresh();
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
          radius="full"
          src={user.avatar || '/logo2.png'}
          alt="User Avatar"
          size="md"
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
          <p className="font-semibold">
            {user.email || 'no-email@example.com'}
          </p>
        </DropdownItem>
        <DropdownItem
          key="Account"
          className="p-2"
          textValue={role === 'Super_Admin' ? 'Super Admin Account' : 'Account'}
        >
          <Link
            href={role === 'Super_Admin' ? '/super-admin-account' : '/account'}
          >
            {role === 'Super_Admin' ? 'Super Admin Account' : 'Account'}
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

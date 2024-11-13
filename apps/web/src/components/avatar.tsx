'use client';
import { deleteToken, getToken } from '@/lib/server';
import { useAppDispatch } from '@/redux/hook';
import { resetCart } from '@/redux/slice/cartSlice';
import { resetCheckout } from '@/redux/slice/checkoutSlice';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AvatarMenu() {
  const dispatch = useAppDispatch()
  const [token, setToken] = useState('');
  const fetchToken = async () => {
    const res = await getToken();
    setToken(res || '');
  };

  const onLogout = async () => {
    await deleteToken();
    dispatch(resetCart())
    dispatch(resetCheckout())
    setToken('')
  }
  useEffect(() => {
    fetchToken();
  }, []);
  return (
    <div>
      {token ? (
        <div className="flex gap-2">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings" className="text-red-600">
                My Settings
              </DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={onLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      ) : (
        <div className=" flex gap-2">
          <Link href="/register">Daftar</Link>
          <Link href="/login">Masuk</Link>
        </div>
      )}
    </div>
  );
}

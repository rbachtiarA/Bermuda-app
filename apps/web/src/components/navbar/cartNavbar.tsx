'use client';

import { useAppSelector } from '@/redux/hook';
import { Chip } from '@nextui-org/react';
import LinkButtonBottomNavbar from '../bottomNavbar/LinkButton.BottomNavbar';
import NotificationBottomNavbar from '../bottomNavbar/notificationCart.BottomNavbar';
import { cartArr } from '@/redux/selector/cartSelector';

export default function CartNavbar() {
  const cart = useAppSelector(cartArr);
  return (
    <div>
      <div className="hidden md:flex justify-between items-center">
        <p>Cart </p>
        <Chip color="primary" size="sm">
          <p>{cart.length}</p>
        </Chip>
      </div>
      <div className="md:hidden">
        <LinkButtonBottomNavbar
          label=""
          href="/cart"
          imgsrc="/icon-shopping-cart.svg"
          imgalt="cart"
          component={<NotificationBottomNavbar value={cart.length} />}
        />
      </div>
    </div>
  );
}

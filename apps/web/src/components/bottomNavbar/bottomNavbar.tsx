'use client';
import { useAppSelector } from '@/redux/hook';
import { cartArr } from '@/redux/selector/cartSelector';
import { Roboto } from 'next/font/google';
import LinkButtonBottomNavbar from './LinkButton.BottomNavbar';
import NotificationBottomNavbar from './notificationCart.BottomNavbar';

const roboto = Roboto({
  weight: ['400'],
  subsets: ['latin'],
});

export default function BottomNavbar() {
  const cart = useAppSelector(cartArr);
  return (
    <div className="sticky bottom-0 z-[100] block" style={roboto.style}>
      <ul className="grid grid-cols-4 divide-x divide-white text-center py-1 bg-slate-200 justify-center items-center">
        <li className="w-full">
          <LinkButtonBottomNavbar
            label="Profile"
            href="/user"
            imgsrc="/icon-user-profile.svg"
            imgalt="user"
          />
        </li>
        <li className="w-full">
          <LinkButtonBottomNavbar
            label="Order"
            href="/userorder"
            imgsrc="/icon-order.svg"
            imgalt="order"
          />
        </li>
        <li className="w-full">
          <LinkButtonBottomNavbar
            label="Cart"
            href="/cart"
            imgsrc="/icon-shopping-cart.svg"
            imgalt="cart"
            component={<NotificationBottomNavbar value={cart.length} />}
          />
        </li>
        <li className="w-full">
          <LinkButtonBottomNavbar
            label="product"
            href="/product"
            imgsrc="/icon-shopping-cart.svg"
            imgalt="product"
          />
        </li>
      </ul>
    </div>
  );
}

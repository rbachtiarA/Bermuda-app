'use client'
import { useAppSelector } from '@/redux/hook';
import Link from 'next/link';
import { useState } from 'react';

export default function SideBar() {
  const [isDashboardOpen, setDashboardOpen] = useState(true);
  const [isAccountOpen, setAccountOpen] = useState(true);
  const user = useAppSelector((state) => state.user);

  const toggleDashboard = () => {
    setDashboardOpen(!isDashboardOpen);
  };

  const toggleAccount = () => {
    setAccountOpen(!isAccountOpen);
  };
  return (
    <aside className="hidden lg:flex h-full">
      <div className="bg-foreground-100 shadow-md p-4 h-full">
        <div className="p-3 border-b border-gray-300">
          <div className="flex justify-between">
            <p className="text-sm font-semibold py-2">Dashboard</p>
          </div>

          <div className="pl-2">
            <ul className="list-none text-sm">
              <li className="py-4">
                <Link
                  href="/super-admin-account/store-admin"
                  className="no-underline text-gray-700 relative"
                >
                  Store Admin Management
                </Link>
              </li>
              <li className="py-4">
                <Link
                  href="/super-admin-account/user-management"
                  className="no-underline text-gray-700 relative"
                >
                  User Management
                </Link>
              </li>
              <li className="py-4">
                <Link
                  href="/super-admin-account/store-management"
                  className="no-underline text-gray-700 relative"
                >
                  Store Management
                </Link>
              </li>
              <li className="py-4">
                <Link
                  href="/super-admin-account/product-management"
                  className="no-underline text-gray-700 relative"
                >
                  Product Management
                </Link>
              </li>
              <li className="py-4">
                <Link
                  href="/super-admin-account/stock-management"
                  className="no-underline text-gray-700 relative"
                >
                  Stock Management
                </Link>
              </li>
              <li className="py-4">
                <Link
                  href="/super-admin-account/discount-management"
                  className="no-underline text-gray-700 relative"
                >
                  Discount Management
                </Link>
              </li>
              <li className="py-4">
                <Link
                  href="/admin/order"
                  className="no-underline text-gray-700 relative"
                >
                  Order Management
                </Link>
              </li>
              <li className="py-4">
                <Link
                  href="/super-admin-account/report-analysis"
                  className="no-underline text-gray-700 relative"
                >
                  Report & Analysis
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-3">
          <div className="flex justify-between">
            <p className="text-sm font-semibold py-2">Akun Saya</p>
          </div>
          <div className="pl-2">
            <ul className="list-none text-sm">
              <li className="py-4">
                <Link
                  href="/super-admin-account"
                  aria-current="page"
                  className="no-underline text-gray-700 relative"
                >
                  Pengaturan Akun
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}

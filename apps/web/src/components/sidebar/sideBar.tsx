'use client';
import { usePathname } from 'next/navigation';
import SidebarItem from './sideBarItem';
import { useState, useEffect } from 'react';
import { getRole } from '@/lib/server';

export default function SideBar() {
  const path = usePathname();
  const [role, setRole] = useState<string>('');
  const ADMIN_DASHBOARD: { link: string; label: string }[] = [
    { link: '/admin', label: 'My Profile' },
    { link: '/admin/user-management', label: 'User Management' },
    { link: '/admin/store-admin-management', label: 'Store Admin Management' },
    { link: '/admin/store-management', label: 'Store Management' },
    {
      link: '/admin/product-category-management',
      label: 'Product Category Management',
    },
    { link: '/admin/product-management', label: 'Product Management' },
    { link: '/admin/stock-management', label: 'Stock Management' },
    { link: '/admin/order-management', label: 'Order Management' },
    { link: '/admin/report-analysis', label: 'Report & Analyst' },
  ];

  const STORE_ADMIN: { link: string; label: string }[] = [
    {
      link: '/admin/product-category-management',
      label: 'Product Category Management',
    },
    { link: '/admin/product-management', label: 'Product Management' },
    { link: '/admin/discount-management', label: 'Discount Management' },
    { link: '/admin/order-management', label: 'Order Management' },
    { link: '/admin/report-analysis', label: 'Report & Analyst' },
  ];

  const USER_DASHBOARD: { link: string; label: string }[] = [
    { link: '/account', label: 'My Profile' },
    { link: '/account/order', label: 'My Orders' },
    { link: '/account/payment', label: 'Active Payment' },
  ];

  const UTILS_DASHBOARD: { link: string; label: string }[] = [
    { link: `/${path.split('/')[1]}`, label: 'Account Settings' },
  ];

  const fetchRole = async () => {
    const res = await getRole();
    setRole(res as string);
  };

  useEffect(() => {
    fetchRole();
  }, []);

  console.log(role, 'ROLEE');

  return (
    <aside className="fixed left-0 h-screen w-[260px]">
      <div className="bg-foreground-100 shadow-md p-4 h-full">
        <div className="p-3 border-b border-gray-300">
          <div className="flex justify-between">
            <p className="text-sm font-semibold py-2">Dashboard</p>
          </div>
          {role && role === 'SUPER_ADMIN' && (
            <div className="pl-2">
              <ul className="list-none text-sm">
                {ADMIN_DASHBOARD.map((item) => (
                  <SidebarItem
                    key={item.label}
                    link={item.link}
                    label={item.label}
                    isActive={path === item.link}
                  />
                ))}
              </ul>
            </div>
          )}
          {role && role === 'STORE_ADMIN' && (
            <div className="pl-2">
              <ul className="list-none text-sm">
                {STORE_ADMIN.map((item) => (
                  <SidebarItem
                    key={item.label}
                    link={item.link}
                    label={item.label}
                    isActive={path === item.link}
                  />
                ))}
              </ul>
            </div>
          )}
          {role && role === 'USER' && (
            <div className="pl-2">
              <ul className="list-none text-sm">
                {USER_DASHBOARD.map((item) => (
                  <SidebarItem
                    key={item.label}
                    link={item.link}
                    label={item.label}
                    isActive={path === item.link}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="flex justify-between">
            <p className="text-sm font-semibold py-2">Akun Saya</p>
          </div>
          <div className="pl-2">
            <ul className="list-none text-sm">
              {UTILS_DASHBOARD.map((item) => (
                <SidebarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  isActive={false}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}

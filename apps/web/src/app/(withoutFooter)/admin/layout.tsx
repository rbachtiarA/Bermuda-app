import BreadcrumbsDashboard from '@/components/breadcrumbs/breadcrumbsDashboard';
import AdminProtection from '@/components/routerProtection/adminProtection';
import SideBar from '@/components/sidebar/sideBar';
import { Divider } from '@nextui-org/react';
import React, { Suspense } from 'react';
import LoadingAdminDashboard from './loading';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtection>
      <div className="grid md:grid-cols-[260px_1fr] w-full h-full">
        <div className="md:block hidden">
          <SideBar />
        </div>
        <div className="md:hidden w-full px-4 flex flex-col gap-1">
          <BreadcrumbsDashboard title="Dashboard" />
          <Divider />
        </div>
        <div className='w-full'>
          <Suspense fallback={<LoadingAdminDashboard />}>
            {children}
          </Suspense>
        </div>
        
      </div>
    </AdminProtection>
  );
}

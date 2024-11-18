import BreadcrumbsDashboard from '@/components/breadcrumbs/breadcrumbsDashboard';
import AdminProtection from '@/components/routerProtection/adminProtection';
import SideBar from '@/components/sideBar';
import { Divider } from '@nextui-org/react';
import React, { Suspense } from 'react';
import LoadingAdminDashboard from './loading';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtection>
      <div className="flex flex-col md:flex-row w-full h-full">
        <div className="mr-[227px] md:block hidden">
          <SideBar />
        </div>
        <div className="md:hidden w-full px-4 flex flex-col gap-1">
          <BreadcrumbsDashboard title="Dashboard" />
          <Divider />
        </div>
        <Suspense fallback={<LoadingAdminDashboard />}>{children}</Suspense>
      </div>
    </AdminProtection>
  );
}

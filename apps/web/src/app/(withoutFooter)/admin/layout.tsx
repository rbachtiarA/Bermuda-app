import TitleBreadcrumbs from '@/components/breadcrumbs/breadcrumbs'
import BreadcrumbsDashboard from '@/components/breadcrumbs/breadcrumbsDashboard'
import AdminProtection from '@/components/routerProtection/adminProtection'
import SideBar from '@/components/sideBar'
import SideBarHamburger from '@/components/sideBarHamburger'
import { Divider } from '@nextui-org/react'
import React from 'react'

export default function layout({children}:{children: React.ReactNode}) {
  return (
    <AdminProtection>
      <div className='flex flex-col md:flex-row w-full h-full'>
          
          <div className='mr-[227px] md:block hidden'>
            <SideBar />
          </div>
          <div className='md:hidden w-full p-1 flex flex-col gap-1'>
            <SideBarHamburger />
            <BreadcrumbsDashboard title='Dashboard'/>
            <Divider />
          </div>
            {children}
      </div>
    </AdminProtection>
  )
}

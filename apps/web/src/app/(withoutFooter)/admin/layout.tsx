import AdminProtection from '@/components/routerProtection/adminProtection'
import SideBar from '@/components/sideBar'
import React from 'react'

export default function layout({children}:{children: React.ReactNode}) {
  return (
    <AdminProtection>
      <div className='flex w-full h-full'>
          
          <div className='mr-[227px] md:block hidden'>
            <SideBar />
          </div>
          {children}
      </div>
    </AdminProtection>
  )
}

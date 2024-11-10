import SideBar from '@/components/sideBar'
import React from 'react'

export default function layout({children}:{children: React.ReactNode}) {
  return (
    <div className='flex w-full h-full'>
        <div className='mr-[227px] md:block hidden'>
          <SideBar />
        </div>
        {children}
    </div>
  )
}

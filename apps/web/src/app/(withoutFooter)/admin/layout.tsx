import SideBar from '@/components/sideBar'
import React from 'react'

export default function layout({children}:{children: React.ReactNode}) {
  return (
    <div className='grid md:grid-cols-[25%_75%]'>
      <div className=''>
        <SideBar />
      </div>
        {children}
    </div>
  )
}

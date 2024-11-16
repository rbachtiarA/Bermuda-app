'use client'
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export default function BreadcrumbsDashboard({ title }: {title:string}) {
    const pathName = usePathname()
    const router = useRouter()
    const splitPath = pathName.split('/')
    console.log(splitPath.join('/'));
    
  return (
    <div className=''>
        <Breadcrumbs size='lg'>
            {pathName.split('/').map((val, idx) => (
                <BreadcrumbItem 
                  className='font-bold' size='lg' key={`${val}${idx}`} 
                  onPress={() => router.push(splitPath.slice(0, idx+1).length !== 0? splitPath.slice(0, idx+1).join('/') :'/')}>
                    {idx === 0? 'Home ' : `${splitPath[idx].slice(0,1).toUpperCase()+splitPath[idx].slice(1)} `}
                  </BreadcrumbItem>
            ))}
        </Breadcrumbs>
    </div>
  )
}

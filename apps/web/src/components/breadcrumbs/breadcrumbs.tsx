'use client'
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export default function TitleBreadcrumbs({ title }: {title:string}) {
    const pathName = usePathname()
    const router = useRouter()
    
  return (
    <div className=''>
        <Breadcrumbs size='md'>
            {pathName.split('/').map((val, idx) => (
                <BreadcrumbItem key={`${val}${idx}`} onPress={() => router.push(pathName.split('/').slice(0, idx+1).join('/')??'/')} >{idx === 0? 'Home ' : `${pathName.split('/')[idx].slice(0,1).toUpperCase()+pathName.split('/')[idx].slice(1)} `}</BreadcrumbItem>
            ))}
        </Breadcrumbs>
    </div>
  )
}

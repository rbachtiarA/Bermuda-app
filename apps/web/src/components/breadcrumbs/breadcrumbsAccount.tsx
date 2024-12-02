'use client'
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation'
import NavbarMobileUserDropdown from '../navbar/navbarMobile/navbarMobileUserDropdown';

export default function BreadcrumbsAccount({ title, ...props }: {title:string, className?: string}) {
    const pathName = usePathname()
    const router = useRouter()
    const splitPath = pathName.split('/')
    
  return (
    <div {...props}>
        <Breadcrumbs size='md'>
            {splitPath.map((val, idx) =>  {
              if(idx !== splitPath.length - 1) {
                return (
                    <BreadcrumbItem 
                      className='font-bold' size='md' key={`${val}${idx}`} 
                      onPress={() => router.push(splitPath.slice(0, idx+1).length !== 0? splitPath.slice(0, idx+1).join('/') :'/')}>
                        {idx === 0? 'Home ' : `${splitPath[idx].slice(0,1).toUpperCase()+splitPath[idx].slice(1)} `}
                      </BreadcrumbItem>
                )
              } else {
                return (
                    <BreadcrumbItem key={`${val}${idx}`} className='font-bold' classNames={{item: 'px-0'}}>
                      <NavbarMobileUserDropdown title={splitPath[idx]}/>
                    </BreadcrumbItem>
                )
              }
            })}
        </Breadcrumbs>
    </div>
  )
}

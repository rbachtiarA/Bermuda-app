'use client';
import {
  Navbar,
  NavbarContent,
  Input
} from '@nextui-org/react';
import { SearchIcon } from './searchIcon';

 export default function SiteNavbar() {
  return (
    <Navbar isBordered>
      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          classNames={{
            base: 'max-w-full max-w-[10rem] lg:max-w-[555px] h-10',
            mainWrapper: 'h-full',
            input: 'text-small',
            inputWrapper:
              'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
          }}
          placeholder="Temukan produk faforitmu"
          size="sm"
          endContent={<SearchIcon size={18}/>}
          type="search"
        />
        
      </NavbarContent>
      
    </Navbar>
  );
}

'use client';
import { Navbar, NavbarContent, Input } from '@nextui-org/react';
import { SearchIcon } from './searchIcon';
import { Dispatch, SetStateAction } from 'react';

export default function SearchNav({search, setSearch, setDropdown}: {setDropdown: Dispatch<SetStateAction<boolean>>,search:string, setSearch: Dispatch<SetStateAction<string>>}) {
  return (
      // <NavbarContent as="div" className="items-center" justify="end">
        <Input
          onClick={() => setDropdown(true)}
          onBlur={() => setDropdown(false)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          classNames={{
            base: 'w-full h-10',       //'max-w-full max-w-[10rem] lg:max-w-[555px] h-10',
            mainWrapper: 'h-full',
            input: 'text-small',
            inputWrapper:
              'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
          }}
          placeholder="Temukan produk favoritmu disini"
          size="sm"
          endContent={<SearchIcon size={18} />}
          type="search"
        />
      // </NavbarContent>
  );
}

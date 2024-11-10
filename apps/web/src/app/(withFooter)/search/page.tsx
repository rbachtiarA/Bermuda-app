'use client';

import { SearchIcon } from '@/components/navbar/searchIcon';
import Wrapper from '@/components/wrapper';
import { Input } from '@nextui-org/react';
import { useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function searchProducts() {
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState<string>('');
  const [value] = useDebounce(search, 1000);
  const handleChange = () => {
    if (searchRef.current) {
      setSearch(searchRef.current.value);
    }
  };
  return (
    <div className="flex w-full flex-col container">
      <Input
        classNames={{
          base: 'max-w-full max-w-[10rem] lg:max-w-[555px] h-10 pt-2',
          mainWrapper: 'h-full',
          input: 'text-small',
          inputWrapper:
            'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
        }}
        placeholder="Temukan produk faforitmu"
        size="sm"
        endContent={<SearchIcon size={18} />}
        type="search"
        ref={searchRef}
        onChange={handleChange}
      />

      <div>State: {search}</div>
      <div>State Debounce: {value}</div>
      {/* Add your search logic here */}
      {/* Display search results */}
      {/* Implement pagination */}
      {/* Use the 'useQuery' hook to fetch the search results */}
      {/* Use the 'useInfiniteQuery' hook to fetch more search results as the user scrolls */}
      {/* Use the 'useDebounce' hook to debounce the search input */}
      {/* Use the 'useForm' hook to handle the search form */}
      {/* Display a loading indicator or error message if the search results are not fetched */}
      {/* Implement sorting and filtering options */}
      {/* Use the 'useSortBy' hook to handle sorting */}
      {/* Use the 'useFilterBy' hook to handle filtering */}
      {/* Use the 'useToggle' hook to handle toggling the sorting and filtering options */}
      {/* Display the search results */}
      {/* Implement pagination */}
      {/* Use the 'usePagination' hook to handle pagination */}
      {/* Display the pagination controls */}
    </div>
  );
}

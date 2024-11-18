import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Input,
  Dropdown,
  Spinner,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { CitySearchInputProps, IFetchCity } from '@/type/address';
import { useDebounce } from 'use-debounce';

export const CitySearchInput: React.FC<CitySearchInputProps> = ({
  handleSelect,
  resetTrigger,
}) => {
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce(search, 1000); 
  const [options, setOptions] = useState<IFetchCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchCities = async (query: string) => {
      if (!query) return;
      setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}address/cities?search=${query}`,
      );
      const cities = await response.json();
      setOptions(cities);
      setIsDropdownOpen(cities.length > 0);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    if (debouncedSearch) {
      fetchCities(debouncedSearch);
    } else {
      setOptions([]);
      setIsDropdownOpen(false);
    }
  }, [debouncedSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCitySelect = (cityId: number, cityName: string) => {
    setSearch(cityName);
    setIsDropdownOpen(false);
    handleSelect(cityId, cityName);
  };

  const clearInput = () => {
    setSearch('');
    setOptions([]);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (resetTrigger) {
      clearInput();
    }
  }, [resetTrigger]);

  return (
    <div className="relative">
      <Input
        placeholder="Search city..."
        value={search}
        onChange={handleChange}
        isClearable
        onClear={clearInput}
      />
      {isDropdownOpen && (
        <Dropdown
          placement="bottom-start"
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
        >
          <DropdownTrigger>
            <div />
          </DropdownTrigger>
          <DropdownMenu aria-label="Select city">
            {loading ? (
              <DropdownItem key="loading">
                <Spinner size="sm" color="default" className="mx-auto" />
              </DropdownItem>
            ) : options.length === 0 ? (
              <DropdownItem key="empty" className="text-gray-500">
                No cities found
              </DropdownItem>
            ) : (
              options.map((city) => (
                <DropdownItem
                  key={city.id}
                  onClick={() => handleCitySelect(city.id, city.name)}
                >
                  {city.name}
                </DropdownItem>
              ))
            )}
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};

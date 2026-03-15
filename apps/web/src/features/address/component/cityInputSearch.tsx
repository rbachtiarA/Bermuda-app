import { CitySearchInputProps, IFetchCity } from '@/type/address';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Spinner,
} from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

const fetchCities = async (query: string): Promise<IFetchCity[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}address/cities?search=${query}`,
  );
  if (!response.ok)
    throw new Error(`Failed to fetch cities: ${response.status}`);
  return response.json();
};

const useCitySearch = (initialValue: string) => {
  const [search, setSearch] = useState(initialValue);
  const [options, setOptions] = useState<IFetchCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 1000);

  const clearInput = useCallback(() => {
    setSearch('');
    setOptions([]);
    setIsDropdownOpen(false);
  }, []);

  useEffect(() => {
    if (!debouncedSearch) {
      setOptions([]);
      setIsDropdownOpen(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const cities = await fetchCities(debouncedSearch);
        setOptions(cities);
        setIsDropdownOpen(cities.length > 0);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [debouncedSearch]);

  return {
    search,
    setSearch,
    options,
    loading,
    isDropdownOpen,
    setIsDropdownOpen,
    clearInput,
  };
};

export const CitySearchInput: React.FC<CitySearchInputProps> = ({
  value,
  handleSelect,
}) => {
  const {
    search,
    setSearch,
    options,
    loading,
    isDropdownOpen,
    setIsDropdownOpen,
    clearInput,
  } = useCitySearch(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCitySelect = (city: IFetchCity) => {
    setSearch(city.name);
    setIsDropdownOpen(false);
    handleSelect(city.id, city.Province.name);
  };

  return (
    <div className="relative w-full">
      <Input
        label="Kabupaten/Kota"
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
                  onPress={() => handleCitySelect(city)}
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

import React from 'react';
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { SearchIcon } from '@/components/icons/searchIcon';
import { ChevronDownIcon } from '@/components/icons/chevronDownIcon';
import { capitalize } from '@/components/utils';
import { Selection } from '@nextui-org/react';
import ModalCreateStoreAdmin from './modalCreateStoreAdmin';
import { columns } from './columnStoreAdmin';

interface TopContentProps {
  filterValue: string;
  visibleColumns: Selection;
  onSearchChange: (value?: string) => void;
  setVisibleColumns: (newVisibleColumns: Selection) => void;
  usersLength: number;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  rowsPerPage: number;
  hasSearchFilter: boolean;
}

const TopStoreAdmin: React.FC<TopContentProps> = ({
  filterValue,
  visibleColumns,
  onSearchChange,
  setVisibleColumns,
  usersLength,
  onRowsPerPageChange,
  rowsPerPage,
  hasSearchFilter,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          classNames={{
            base: 'w-full sm:max-w-[44%]',
            inputWrapper: 'border-1',
          }}
          placeholder="Search by name..."
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => onSearchChange('')}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                size="sm"
                variant="flat"
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {columns.map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {capitalize(column.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <ModalCreateStoreAdmin />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {usersLength} stores
        </span>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default TopStoreAdmin;

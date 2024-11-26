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
import { columns } from './columnDiscount';
import { useAppSelector } from '@/redux/hook';
import CreateManualDiscount from './discountManual';
import CreateBuyOneGetOneDiscount from './discountBogo';
import CreateDiscountMinPurchase from './discountMinPurchase';

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

const TopDiscounts: React.FC<TopContentProps> = ({
  filterValue,
  visibleColumns,
  onSearchChange,
  setVisibleColumns,
  usersLength,
  onRowsPerPageChange,
}) => {
  const user = useAppSelector((state) => state.user);
  const role = user?.role;

  const filteredColumns = React.useMemo(() => {
    return role === 'STORE_ADMIN'
      ? columns
      : columns.filter((column) => column.uid !== 'actions');
  }, [role]);

  const [showDiscountForm, setShowDiscountForm] = React.useState<
    'manual' | 'bogo' | 'minPurchase' | null
  >(null);

  const handleDiscountFormChange = (
    type: 'manual' | 'bogo' | 'minPurchase',
  ) => {
    setShowDiscountForm(type);
  };

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
        {role === 'STORE_ADMIN' && (
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
                {filteredColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* New Dropdown for Discount Creation */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Create Discount
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Discount Types">
                <DropdownItem
                  onClick={() => handleDiscountFormChange('manual')}
                >
                  Create Manual Discount
                </DropdownItem>
                <DropdownItem onClick={() => handleDiscountFormChange('bogo')}>
                  Create Buy-One-Get-One Discount
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleDiscountFormChange('minPurchase')}
                >
                  Create Min Purchase Discount
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* Display the corresponding discount form */}
            {showDiscountForm === 'manual' && <CreateManualDiscount />}
            {showDiscountForm === 'bogo' && <CreateBuyOneGetOneDiscount />}
            {showDiscountForm === 'minPurchase' && (
              <CreateDiscountMinPurchase />
            )}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {usersLength} discounts
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

export default TopDiscounts;

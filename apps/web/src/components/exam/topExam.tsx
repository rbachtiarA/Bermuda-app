// import React from 'react';
// import {
//   Input,
//   Button,
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownItem,
// } from '@nextui-org/react';
// import { SearchIcon } from '@/components/icons/searchIcon';
// import { ChevronDownIcon } from '@/components/icons/chevronDownIcon';
// import { capitalize } from '@/components/utils';
// import { Selection } from '@nextui-org/react';
// // import ModalCreateCategory from './modalCreateStock';
// import { columns } from './columnExam';
// import { useAppSelector } from '@/redux/hook';
// import CreateDiscountMInPurchase from '../discount/discountMinPurchase';
// import CreateBuyOneGetOneDiscount from '../discount/discountBogo';
// import CreateManualDiscount from '../discount/discountManual';

// interface TopContentProps {
//   filterValue: string;
//   visibleColumns: Selection;
//   onSearchChange: (value?: string) => void;
//   setVisibleColumns: (newVisibleColumns: Selection) => void;
//   usersLength: number;
//   onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   rowsPerPage: number;
//   hasSearchFilter: boolean;
// }

// const TopExam: React.FC<TopContentProps> = ({
//   filterValue,
//   visibleColumns,
//   onSearchChange,
//   setVisibleColumns,
//   usersLength,
//   onRowsPerPageChange,
// }) => {
//   const user = useAppSelector((state) => state.user);
//   const role = user?.role;

//   const filteredColumns = React.useMemo(() => {
//     return role === 'STORE_ADMIN'
//       ? columns
//       : columns.filter((column) => column.uid !== 'actions');
//   }, [role]);
//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex justify-between gap-3 items-end">
//         <Input
//           isClearable
//           classNames={{
//             base: 'w-full sm:max-w-[44%]',
//             inputWrapper: 'border-1',
//           }}
//           placeholder="Search by name..."
//           size="sm"
//           startContent={<SearchIcon className="text-default-300" />}
//           value={filterValue}
//           variant="bordered"
//           onClear={() => onSearchChange('')}
//           onValueChange={onSearchChange}
//         />
//         {role === 'STORE_ADMIN' && (
//           <div className="flex gap-3">
//             <Dropdown>
//               <DropdownTrigger className="hidden sm:flex">
//                 <Button
//                   endContent={<ChevronDownIcon className="text-small" />}
//                   size="sm"
//                   variant="flat"
//                 >
//                   Columns
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 disallowEmptySelection
//                 aria-label="Table Columns"
//                 closeOnSelect={false}
//                 selectedKeys={visibleColumns}
//                 selectionMode="multiple"
//                 onSelectionChange={setVisibleColumns}
//               >
//                 {columns.map((column) => (
//                   <DropdownItem key={column.uid} className="capitalize">
//                     {capitalize(column.name)}
//                   </DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </Dropdown>
//             <CreateDiscountMInPurchase />
//             <CreateBuyOneGetOneDiscount />
//             <CreateManualDiscount />
//           </div>
//         )}
//       </div>
//       <div className="flex justify-between items-center">
//         <span className="text-default-400 text-small">
//           Total {usersLength} stores
//         </span>
//         <label className="flex items-center text-default-400 text-small">
//           Rows per page:
//           <select
//             className="bg-transparent outline-none text-default-400 text-small"
//             onChange={onRowsPerPageChange}
//           >
//             <option value="5">5</option>
//             <option value="10">10</option>
//             <option value="15">15</option>
//           </select>
//         </label>
//       </div>
//     </div>
//   );
// };

// export default TopExam;

// import React, { useState } from 'react';
// import {
//   Input,
//   Button,
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownItem,
// } from '@nextui-org/react';
// import { SearchIcon } from '@/components/icons/searchIcon';
// import { ChevronDownIcon } from '@/components/icons/chevronDownIcon';
// import { capitalize } from '@/components/utils';
// import { Selection } from '@nextui-org/react';
// import { columns } from './columnExam';
// import { useAppSelector } from '@/redux/hook';
// import CreateDiscountMInPurchase from '../discount/discountMinPurchase';
// import CreateBuyOneGetOneDiscount from '../discount/discountBogo';
// import CreateManualDiscount from '../discount/discountManual';

// interface TopContentProps {
//   filterValue: string;
//   visibleColumns: Selection;
//   onSearchChange: (value?: string) => void;
//   setVisibleColumns: (newVisibleColumns: Selection) => void;
//   usersLength: number;
//   onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   rowsPerPage: number;
//   hasSearchFilter: boolean;
// }

// const TopExam: React.FC<TopContentProps> = ({
//   filterValue,
//   visibleColumns,
//   onSearchChange,
//   setVisibleColumns,
//   usersLength,
//   onRowsPerPageChange,
// }) => {
//   const user = useAppSelector((state) => state.user);
//   const role = user?.role;

//   const filteredColumns = React.useMemo(() => {
//     return role === 'STORE_ADMIN'
//       ? columns
//       : columns.filter((column) => column.uid !== 'actions');
//   }, [role]);

//   const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null);

//   const renderDiscountModal = () => {
//     switch (selectedDiscount) {
//       case 'min-purchase':
//         return <CreateDiscountMInPurchase />;
//       case 'bogo':
//         return <CreateBuyOneGetOneDiscount />;
//       case 'manual':
//         return <CreateManualDiscount />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex justify-between gap-3 items-end">
//         <Input
//           isClearable
//           classNames={{
//             base: 'w-full sm:max-w-[44%]',
//             inputWrapper: 'border-1',
//           }}
//           placeholder="Search by name..."
//           size="sm"
//           startContent={<SearchIcon className="text-default-300" />}
//           value={filterValue}
//           variant="bordered"
//           onClear={() => onSearchChange('')}
//           onValueChange={onSearchChange}
//         />
//         {role === 'STORE_ADMIN' && (
//           <div className="flex gap-3">
//             <Dropdown>
//               <DropdownTrigger className="hidden sm:flex">
//                 <Button
//                   endContent={<ChevronDownIcon className="text-small" />}
//                   size="sm"
//                   variant="flat"
//                 >
//                   Columns
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 disallowEmptySelection
//                 aria-label="Table Columns"
//                 closeOnSelect={false}
//                 selectedKeys={visibleColumns}
//                 selectionMode="multiple"
//                 onSelectionChange={setVisibleColumns}
//               >
//                 {columns.map((column) => (
//                   <DropdownItem key={column.uid} className="capitalize">
//                     {capitalize(column.name)}
//                   </DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </Dropdown>
//             <select
//               className="bg-transparent outline-none border px-3 py-2 rounded text-small"
//               onChange={(e) => setSelectedDiscount(e.target.value)}
//               defaultValue=""
//             >
//               <option value="" disabled>
//                 Select Discount Type
//               </option>
//               <option value="min-purchase">Min Purchase Discount</option>
//               <option value="bogo">Buy One Get One</option>
//               <option value="manual">Manual Discount</option>
//             </select>
//           </div>
//         )}
//       </div>
//       {renderDiscountModal()}
//       <div className="flex justify-between items-center">
//         <span className="text-default-400 text-small">
//           Total {usersLength} stores
//         </span>
//         <label className="flex items-center text-default-400 text-small">
//           Rows per page:
//           <select
//             className="bg-transparent outline-none text-default-400 text-small"
//             onChange={onRowsPerPageChange}
//           >
//             <option value="5">5</option>
//             <option value="10">10</option>
//             <option value="15">15</option>
//           </select>
//         </label>
//       </div>
//     </div>
//   );
// };

// export default TopExam;

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
// import ModalCreateCategory from './modalCreateStock';
import { columns } from './columnExam';
import { useAppSelector } from '@/redux/hook';
import CreateManualDiscount from '../discount/discountManual';
import CreateDiscountMinPurchase from '../discount/discountMinPurchase';
import CreateBuyOneGetOneDiscount from '../discount/discountBogo';

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

const TopExam: React.FC<TopContentProps> = ({
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
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Discounts
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Discount Actions" closeOnSelect={true}>
                <DropdownItem key="manual">
                  <CreateBuyOneGetOneDiscount />
                </DropdownItem>
                <DropdownItem key="bogo">
                  <CreateDiscountMinPurchase />
                </DropdownItem>
                <DropdownItem key="min-purchase">
                  <CreateManualDiscount />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
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

export default TopExam;

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Selection,
  SortDescriptor,
} from '@nextui-org/react';
import { IDiscountAll } from '@/type/discount';
import { columns, INITIAL } from '@/components/discount/columnDiscount';
import BottomContent from '@/components/bottomContent';
import { classNames } from '@/components/classNames';
import { getStoreDiscounts } from '@/lib/store.handler';
import { useAppSelector } from '@/redux/hook';
import RenderDiscount from '@/components/discount/renderDiscount';
import TopDiscounts from '@/components/discount/topDiscount';

export default function DiscountManagement() {
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL),
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });
  const [page, setPage] = useState(1);
  const [discounts, setDiscounts] = useState<IDiscountAll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const user = useAppSelector((state) => state.user);
  const storeId = user?.storeId;

  const fetchDiscounts = useCallback(async () => {
    if (!storeId) {
      setError('Store ID not found.');
      setLoading(false);
      return;
    }

    try {
      const discountsData = await getStoreDiscounts();

      if (Array.isArray(discountsData)) {
        setDiscounts(discountsData);
      } else {
        setError('Failed to fetch discounts');
      }
    } catch (err) {
      setError('An error occurred while fetching discounts');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const pages = Math.ceil(discounts.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    return visibleColumns === 'all'
      ? columns
      : columns.filter((column) =>
          Array.from(visibleColumns).includes(column.uid),
        );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredDiscounts = [...discounts];
    if (hasSearchFilter) {
      filteredDiscounts = filteredDiscounts.filter((discount) =>
        discount.discountType.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    return filteredDiscounts;
  }, [discounts, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: IDiscountAll, b: IDiscountAll) => {
      const first = a[sortDescriptor.column as keyof IDiscountAll] as number;
      const second = b[sortDescriptor.column as keyof IDiscountAll] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <main className="flex flex-col">
        <div className="bg-white p-8">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-gray-800">
              Discount Management
            </h1>
          </header>
          <Table
            isCompact
            removeWrapper
            aria-label="Discount Table"
            className="min-w-full"
            bottomContent={
              <BottomContent
                selectedKeys={selectedKeys}
                itemsLength={filteredItems.length}
                page={page}
                pages={pages}
                hasSearchFilter={hasSearchFilter}
                onPageChange={setPage}
              />
            }
            checkboxesProps={{
              classNames: {
                wrapper:
                  'after:bg-foreground after:text-background text-background',
              },
            }}
            classNames={classNames}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={
              <TopDiscounts
                filterValue={filterValue}
                visibleColumns={visibleColumns}
                onSearchChange={onSearchChange}
                setVisibleColumns={setVisibleColumns}
                usersLength={discounts.length}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPage={rowsPerPage}
                hasSearchFilter={hasSearchFilter}
              />
            }
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === 'actions' ? 'center' : 'start'}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={'No discounts found'} items={sortedItems}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      <RenderDiscount
                        discount={item}
                        columnKey={columnKey}
                        onDeleted={fetchDiscounts}
                      />
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

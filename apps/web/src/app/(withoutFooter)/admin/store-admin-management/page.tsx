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
import { getToken } from '@/lib/server';
import { IUserState } from '@/type/user';
import { columns, INITIAL } from '@/components/store-admin/columnStoreAdmin';
import TopStoreAdmin from '@/components/store-admin/topStoreAdmin';
import RenderCellStoreAdmin from '@/components/store-admin/renderCellStoreAdmin';
import { getAllStoreAdmin } from '@/lib/storeAdmin';
import BottomContent from '@/components/bottomContent';
import { classNames } from '@/components/classNames';

export default function StoreAdminManagement() {
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
  const [users, setUsers] = useState<IUserState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchUsers = useCallback(async () => {
    try {
      const token = await getToken();
      const { result, ok } = await getAllStoreAdmin(token);

      if (ok && result && Array.isArray(result.users)) {
        setUsers(result.users);
      } else {
        setError('Gagal mengambil data pengguna');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data pengguna');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const pages = Math.ceil(users.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    return filteredUsers;
  }, [users, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: IUserState, b: IUserState) => {
      const first = a[sortDescriptor.column as keyof IUserState] as number;
      const second = b[sortDescriptor.column as keyof IUserState] as number;
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
        <div className="bg-white p-6">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-gray-800">
              Store Admin Management
            </h1>
          </header>
          <Table
            isCompact
            removeWrapper
            aria-label="Store Admin Table"
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
              <TopStoreAdmin
                filterValue={filterValue}
                visibleColumns={visibleColumns}
                onSearchChange={onSearchChange}
                setVisibleColumns={setVisibleColumns}
                usersLength={users.length}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPage={rowsPerPage}
                hasSearchFilter={hasSearchFilter}
              />
            }
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
            <TableBody emptyContent="No users found" items={sortedItems}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      <RenderCellStoreAdmin
                        user={item}
                        columnKey={columnKey}
                        onDeleted={fetchUsers}
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

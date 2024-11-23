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
import BottomContent from '@/components/bottomContent';
import { classNames } from '@/components/classNames';
import { getProducts } from '@/lib/product.handler';
import { IProduct } from '@/type/product';
import RenderProduct from '@/components/product/renderProduct';
import { columns, INITIAL } from '@/components/product/columnProduct';
import TopProduct from '@/components/product/topProduct';
import { useAppSelector } from '@/redux/hook';

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
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [totalPages, setTotalPages] = useState(0);

  const user = useAppSelector((state) => state.user);
  const role = user?.role;

  const fetcProducts = useCallback(async () => {
    setLoading(true);
    try {
      const {
        products: fetchedProducts,
        pagination,
        ok,
      } = await getProducts(filterValue, page, rowsPerPage, categories);

      if (ok && fetchedProducts) {
        setProducts(fetchedProducts);
        setTotalPages(pagination.totalPages || 1);
      } else {
        setError('Gagal mengambil data produk');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data produk');
    } finally {
      setLoading(false);
    }
  }, [filterValue, page, rowsPerPage, categories]);

  useEffect(() => {
    fetcProducts();
  }, [fetcProducts]);

  const headerColumns = React.useMemo(() => {
    return role === 'SUPER_ADMIN'
      ? columns
      : columns.filter((column) => column.uid !== 'actions');
  }, [role]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    setFilterValue(value || '');
    setPage(1);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <main className="flex flex-col">
        <div className="bg-white p-8">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-gray-800">
              Product Management
            </h1>
          </header>
          <Table
            isCompact
            removeWrapper
            aria-label="Product Table"
            className="min-w-full"
            bottomContent={
              <BottomContent
                selectedKeys={selectedKeys}
                itemsLength={products.length}
                page={page}
                pages={totalPages}
                hasSearchFilter={Boolean(filterValue)}
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
              <TopProduct
                filterValue={filterValue}
                visibleColumns={visibleColumns}
                onSearchChange={onSearchChange}
                setVisibleColumns={setVisibleColumns}
                usersLength={products.length}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPage={rowsPerPage}
                hasSearchFilter={Boolean(filterValue)}
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
            <TableBody
              emptyContent={loading ? 'Loading...' : 'No products found'}
              items={products}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      <RenderProduct
                        product={item}
                        columnKey={columnKey}
                        onDeleted={fetcProducts}
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

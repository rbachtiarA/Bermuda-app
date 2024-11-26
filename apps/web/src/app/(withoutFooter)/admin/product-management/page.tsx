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
import { IProduct } from '@/type/product';
import { columns, INITIAL } from '@/components/product/columnProduct';
import BottomContent from '@/components/bottomContent';
import { classNames } from '@/components/classNames';
import { useAppSelector } from '@/redux/hook';
import { getStoreProducts } from '@/lib/store.handler';
import TopProduct from '@/components/product/topProduct';
import RenderProduct from '@/components/product/renderProduct';

export default function ProductManagement() {
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const user = useAppSelector((state) => state.user);
  const role = user?.role;

  const fetchProducts = useCallback(async () => {
    try {
      const products = await getStoreProducts();
      if (products && Array.isArray(products)) {
        setProducts(products);
      } else {
        setError('Gagal mengambil data produk');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data produk');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const pages = Math.ceil(products.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    return role === 'SUPER_ADMIN'
      ? columns
      : columns.filter((column) => column.uid !== 'actions');
  }, [role]);

  const filteredItems = React.useMemo(() => {
    let filteredProducts = [...products];
    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    return filteredProducts;
  }, [products, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: IProduct, b: IProduct) => {
      const first = a[sortDescriptor.column as keyof IProduct] as number;
      const second = b[sortDescriptor.column as keyof IProduct] as number;
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
              Product Management
            </h1>
          </header>
          <Table
            isCompact
            removeWrapper
            aria-label="Product Management Table"
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
            bottomContentPlacement="outside"
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
            <TableBody emptyContent={'No products found'} items={sortedItems}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      <RenderProduct
                        product={item}
                        columnKey={columnKey}
                        onDeleted={fetchProducts}
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

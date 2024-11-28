'use client';
import React, { useEffect, useState } from 'react';
import {
  Input,
  Card,
  Table,
  Spacer,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from '@nextui-org/react';
import { getToken } from '@/lib/server';
import { getOrderSales } from '@/lib/order.handler';
import { getCategories } from '@/lib/category.handler';

const SalesHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stockHistory, setStockHistory] = useState<any[] | null>(null);
  const [filteredHistory, setFilteredHistory] = useState<any[] | null>(null);
  const [filterType, setFilterType] = useState<string>('monthly'); // Default filter
  const [selectedMonth, setSelectedMonth] = useState<string>(''); // Default bulan
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [productNameFilter, setProductNameFilter] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isDiscountModalOpen, setIsDiscountModalOpen] =
    useState<boolean>(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any | null>(null);

  // Mengambil data laporan penjualan
  const fetchOrderHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Unauthorized: Token is missing');
      }

      const { order, status, msg } = await getOrderSales();

      if (status !== 'ok') {
        throw new Error(msg || 'Failed to fetch sales history');
      } else {
        let newHistory: any[] = [];
        order.forEach((item: any) => {
          newHistory = [...newHistory, ...item.orderItems];
        });
        setStockHistory(newHistory);
        setFilteredHistory(newHistory); // Default: tampilkan semua data
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  // Fetch data kategori saat komponen dimuat
  const fetchCategories = async () => {
    try {
      const { result } = await getCategories(); // Ganti URL sesuai endpoint API Anda
      const data = result.allCategory;
      setCategories(data); // Simpan data kategori ke state
    } catch (error) {
      console.error('Gagal mengambil data kategori:', error);
    }
  };

  console.log(isDiscountModalOpen, 'isDiscountModalOpen');

  // Filter berdasarkan tipe laporan
  const filterHistory = () => {
    if (!stockHistory) return;

    const filtered = stockHistory.filter((item: any) => {
      const orderDate = new Date(item?.order?.createdAt);
      const categoryName = item?.product?.categories
        ?.map((x: { name: any }) => x.name)
        .join(', ');
      const selectedYearMonth = selectedMonth.split('-'); // Format: 'YYYY-MM'

      // Filter per bulan
      if (filterType === 'monthly') {
        return (
          orderDate.getFullYear() === parseInt(selectedYearMonth[0]) &&
          orderDate.getMonth() + 1 === parseInt(selectedYearMonth[1])
        );
      }

      // Filter per kategori produk
      if (filterType === 'category') {
        return (
          categoryName ==
            categories.find((cat) => String(cat.id) === selectedCategory)
              ?.name && // Pastikan kategori ada
          orderDate.getFullYear() === parseInt(selectedYearMonth[0]) &&
          orderDate.getMonth() + 1 === parseInt(selectedYearMonth[1])
        );
      }

      // Filter per produk
      if (filterType === 'product') {
        return (
          item?.product?.name
            ?.toLowerCase()
            .includes(productNameFilter.toLowerCase()) && // Cocokkan dengan teks input produk
          orderDate.getFullYear() === parseInt(selectedYearMonth[0]) &&
          orderDate.getMonth() + 1 === parseInt(selectedYearMonth[1])
        );
      }

      return true; // Default: tampilkan semua data
    });

    setFilteredHistory(filtered);
  };

  useEffect(() => {
    fetchOrderHistory();
    fetchCategories();
  }, []);

  const openDiscountModal = (discount: any) => {
    setSelectedDiscount(discount);
    setIsDiscountModalOpen(true);
  };

  const closeDiscountModal = () => {
    setIsDiscountModalOpen(false);
    setSelectedDiscount(null);
  };

  console.log(selectedDiscount, 'selectedDiscount');

  // Refilter data ketika filterType atau selectedMonth berubah
  useEffect(() => {
    filterHistory();
  }, [filterType, selectedMonth, selectedCategory, productNameFilter]);

  return (
    <div className="flex flex-col justify-center px-4 py-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Sales History</h2>

      {/* Dropdown Filter */}
      <div className="mb-4 flex gap-4 items-center">
        <Dropdown>
          <DropdownTrigger>
            <button className="px-4 py-2 bg-gray-200 rounded">
              Filter:{' '}
              {filterType === 'monthly'
                ? 'Per Bulan'
                : filterType === 'category'
                  ? 'Kategori'
                  : 'Produk'}
            </button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) => setFilterType(key as string)} // Pastikan tipe key sesuai
            aria-label="Filter Options"
          >
            <DropdownItem key="monthly">Laporan Per Bulan</DropdownItem>
            <DropdownItem key="category">Laporan Per Kategori</DropdownItem>
            <DropdownItem key="product">Laporan Per Produk</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Input Bulan */}
        <Input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          placeholder="Pilih Bulan"
          className="max-w-xs"
        />

        {/* Dropdown Kategori */}
        {filterType === 'category' && (
          <div className="flex items-center gap-4">
            <Dropdown>
              <DropdownTrigger>
                <button className="px-4 py-2 bg-gray-200 rounded">
                  Pilih Kategori:{' '}
                  {selectedCategory
                    ? categories.find(
                        (cat) => String(cat.id) === selectedCategory,
                      )?.name
                    : 'Belum Dipilih'}
                </button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => setSelectedCategory(key as string)} // Mengatur kategori yang dipilih
                aria-label="Category Options"
              >
                {categories.map((category) => (
                  <DropdownItem key={category.id}>{category.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
        {filterType === 'product' && (
          /* Input Filter Nama Produk */
          <div className="mt-4">
            <Input
              type="text"
              value={productNameFilter}
              onChange={(e) => setProductNameFilter(e.target.value)}
              placeholder="Cari Nama Produk"
              className="max-w-xs"
            />
          </div>
        )}
      </div>

      {/* Tabel */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredHistory ? (
        <div className="w-full max-w-4xl">
          <Card style={{ padding: '20px' }}>
            <Table
              aria-label="Stock History Table"
              style={{ marginTop: '20px' }}
              shadow="none"
            >
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Store Name</TableColumn>
                <TableColumn>Product Name</TableColumn>
                <TableColumn>Category</TableColumn>
                <TableColumn>Price</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Discount</TableColumn>
                <TableColumn>Date</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>{history.id}</TableCell>
                    <TableCell>{history?.order?.Store?.name}</TableCell>
                    <TableCell>
                      {history.product?.name ?? 'No product name'}
                    </TableCell>
                    <TableCell>
                      {history?.product?.categories
                        ?.map((category: any) => category.name)
                        .join(', ') ?? 'No category'}
                    </TableCell>
                    <TableCell>{history?.price}</TableCell>
                    <TableCell>{history?.quantity}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          openDiscountModal(history.order?.discount)
                        }
                        disabled={!history.order?.discount}
                        size="sm"
                      >
                        {history.order?.discount ? 'View' : 'No Discount'}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {new Date(history?.order?.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <Modal
            isOpen={isDiscountModalOpen}
            onClose={closeDiscountModal}
            aria-labelledby="discount-modal"
          >
            <ModalContent>
              <ModalHeader>
                <h3>Informasi Diskon</h3>
              </ModalHeader>
              <ModalBody>
                {selectedDiscount ? (
                  <div>
                    <p>
                      <strong> Discount Type:</strong>{' '}
                      {selectedDiscount.discountType}
                    </p>
                    {selectedDiscount?.discountType === 'FLAT' && (
                      <p>
                        <strong>Value:</strong>{' '}
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        }).format(selectedDiscount.value || 0)}
                      </p>
                    )}
                    {selectedDiscount?.minPurchase && (
                      <p>
                        <strong>Min Purchase:</strong>{' '}
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        }).format(selectedDiscount.minPurchase || 0)}
                      </p>
                    )}
                    {selectedDiscount?.discountType === 'PERCENTAGE' && (
                      <p>
                        <strong>Value:</strong> {`${selectedDiscount.value}%`}
                      </p>
                    )}
                    {selectedDiscount?.discountType === 'BY_ONE_GET_ONE' && (
                      <p>
                        <strong>Value:</strong> {`${selectedDiscount.value}`}
                      </p>
                    )}
                  </div>
                ) : (
                  <p>Data diskon tidak ditemukan.</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onClick={closeDiscountModal} color="primary">
                  Tutup
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          No Order History Found
        </div>
      )}
      {/* Modal Informasi Diskon */}
    </div>
  );
};

export default SalesHistoryPage;

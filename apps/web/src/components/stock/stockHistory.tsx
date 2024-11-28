'use client';
import React, { useEffect, useState } from 'react';
import { StockHistory } from '@/type/stock';
import { getStockHistory } from '@/lib/stock.handler';
import { getToken, getUserId } from '@/lib/server';
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
} from '@nextui-org/react';
import { getStoresList } from '@/lib/store.handler';
import { useAppSelector } from '@/redux/hook';

const StockHistoryPage: React.FC = () => {
  const [stockId, setStockId] = useState<string>('1');
  const [stockHistory, setStockHistory] = useState<StockHistory[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [stores, setStores] = useState<any[]>([]); // Untuk daftar toko
  const [filteredStockHistory, setFilteredStockHistory] = useState<any[]>([]);
  const user = useAppSelector((state) => state.user);
  const role = user?.role;

  const fetchStores = async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Unauthorized: Token is missing');
      }

      const { msg, status } = await getStoresList();

      if (status == 'ok') {
        setStores(msg);
      } else {
        throw new Error('Failed to fetch stores');
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  console.log(selectedStore, 'select');

  const fetchStockHistory = async () => {
    setLoading(true);
    setError(null);
    setStockHistory(null);

    try {
      const token = await getToken();
      const userId = await getUserId();
      if (!token) {
        throw new Error('Unauthorized: Token is missing');
      }

      const { result, ok } = await getStockHistory(
        Number(stockId),
        Number(userId),
        token,
      );

      if (!ok) {
        throw new Error(result.msg || 'Failed to fetch stock history');
      }

      setStockHistory(result.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockHistory();
    fetchStores();
  }, []);

  const filterHistory = () => {
    if (!stockHistory) return;

    const filtered = stockHistory.filter((history) => {
      if (
        selectedStore &&
        history.stock?.product?.store?.id.toString() !== selectedStore
      ) {
        return false;
      }

      return true;
    });

    setFilteredStockHistory(filtered);
  };

  console.log(selectedStore, 'selectedStore');

  useEffect(() => {
    filterHistory();
  }, [selectedStore, stockHistory]);

  return (
    <div className="flex flex-col justify-center px-4 py-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Stock History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : stockHistory ? (
        <div className="w-full max-w-4xl">
          {role == 'SUPER_ADMIN' && (
            <div className="mb-4 flex gap-4 items-center">
              <select
                className="px-4 py-2 border rounded"
                value={selectedStore || ''}
                onChange={(e) => {
                  setSelectedStore(e.target.value || null);
                  fetchStockHistory(); // Refresh data berdasarkan filter toko
                }}
              >
                <option value="">Semua Toko</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Card style={{ padding: '20px' }}>
            <Table
              aria-label="Stock History Table"
              style={{ marginTop: '20px' }}
              shadow="none"
            >
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Store Name</TableColumn>
                <TableColumn>Change Type</TableColumn>
                <TableColumn>Product Name</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Date</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredStockHistory.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>{history.id}</TableCell>
                    <TableCell>{history.stock?.store?.name}</TableCell>
                    <TableCell>{history.changeType}</TableCell>
                    <TableCell>
                      {history.stock?.product?.name ?? 'No product name'}
                    </TableCell>

                    {/* <TableCell>{history.stock?.product.name}</TableCell> */}
                    <TableCell>{history.quantity}</TableCell>
                    <TableCell>
                      {new Date(history.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          No Order History Found
        </div>
      )}
    </div>
  );
};

export default StockHistoryPage;

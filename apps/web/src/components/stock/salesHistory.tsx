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
import { getOrderSales, getUserOrders } from '@/lib/order.handler';
import { Quicksand } from 'next/font/google';

const SalesHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      const userId = await getUserId();
      if (!token) {
        throw new Error('Unauthorized: Token is missing');
      }

      const { order, status, msg } = await getOrderSales();

      if (status != 'ok') {
        throw new Error(msg || 'Failed to fetch sales history');
      } else {
        setStockHistory(order);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  return (
    <div className="flex flex-col justify-center px-4 py-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Sales History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : stockHistory ? (
        <div className="w-full max-w-4xl">
          <Card style={{ padding: '20px' }}>
            <Table
              aria-label="Stock History Table"
              style={{ marginTop: '20px' }}
              shadow="none"
            >
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Date</TableColumn>
              </TableHeader>
              <TableBody>
                {stockHistory.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>{history.id}</TableCell>
                    <TableCell>
                      {history?.orderItems.reduce(
                        (e: any, c: any) => e + c.quantity,
                        0,
                      )}
                    </TableCell>
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

export default SalesHistoryPage;

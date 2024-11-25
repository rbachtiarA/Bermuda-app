// // 'use client';
// // import React, { useState } from 'react';
// // import { StockHistory } from '@/type/stock';
// // import { getStockHistory } from '@/lib/stock.handler';
// // import { getToken } from '@/lib/server';

// // const StockHistoryPage: React.FC = () => {
// //   const [stockId, setStockId] = useState<string>('');
// //   const [stockHistory, setStockHistory] = useState<StockHistory[] | null>(null);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [error, setError] = useState<string | null>(null);

// //   const fetchStockHistory = async () => {
// //     setLoading(true);
// //     setError(null);
// //     setStockHistory(null);

// //     try {
// //       const token = await getToken();
// //       if (!token) {
// //         throw new Error('Unauthorized: Token is missing');
// //       }

// //       const { result, ok } = await getStockHistory(Number(stockId), token);

// //       if (!ok) {
// //         throw new Error(result.msg || 'Failed to fetch stock history');
// //       }

// //       setStockHistory(result.data);
// //     } catch (err: any) {
// //       setError(err.message || 'An error occurred');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="container mx-auto px-4 py-6">
// //       <main className="flex flex-col">
// //         <div className="bg-white p-8">
// //           <header className="flex items-center justify-between mb-6">
// //             <h1 className="text-lg font-semibold text-gray-800">
// //               Report & Analysis
// //             </h1>
// //           </header>
// //           <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-5">
// //             <h1 className="text-2xl font-bold mb-5">Stock History</h1>
// //             <div className="w-full max-w-md bg-white p-6 shadow-md rounded-md">
// //               <label
// //                 htmlFor="stockId"
// //                 className="block text-sm font-medium text-gray-700"
// //               >
// //                 Enter Stock ID
// //               </label>
// //               <input
// //                 type="text"
// //                 id="stockId"
// //                 value={stockId}
// //                 onChange={(e) => setStockId(e.target.value)}
// //                 placeholder="e.g., 123"
// //                 className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //               <button
// //                 onClick={fetchStockHistory}
// //                 disabled={loading || !stockId.trim()}
// //                 className={`mt-4 w-full bg-blue-500 text-white p-2 rounded-md ${
// //                   loading || !stockId.trim()
// //                     ? 'opacity-50 cursor-not-allowed'
// //                     : 'hover:bg-blue-600'
// //                 }`}
// //               >
// //                 {loading ? 'Loading...' : 'Fetch History'}
// //               </button>
// //               {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
// //             </div>

// //             {stockHistory && (
// //               <div className="mt-8 w-full max-w-4xl">
// //                 <h2 className="text-lg font-semibold mb-4">
// //                   Stock History for ID: {stockId}
// //                 </h2>
// //                 <table className="w-full border-collapse bg-white shadow-md rounded-md">
// //                   <thead>
// //                     <tr>
// //                       <th className="border p-2 text-left">ID</th>
// //                       <th className="border p-2 text-left">Quantity</th>
// //                       <th className="border p-2 text-left">Date</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {stockHistory.map((history) => (
// //                       <tr key={history.id}>
// //                         <td className="border p-2">{history.id}</td>
// //                         <td className="border p-2">{history.quantity}</td>
// //                         <td className="border p-2">
// //                           {new Date(history.createdAt).toLocaleString()}
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default StockHistoryPage;

// 'use client';
// import React, { useState } from 'react';
// import { StockHistory } from '@/type/stock';
// import { getStockHistory } from '@/lib/stock.handler';
// import { getToken } from '@/lib/server';
// import {
//   Input,
//   Button,
//   Card,
//   Table,
//   Spacer,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
// } from '@nextui-org/react';

// const StockHistoryPage: React.FC = () => {
//   const [stockId, setStockId] = useState<string>('');
//   const [stockHistory, setStockHistory] = useState<StockHistory[] | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchStockHistory = async () => {
//     setLoading(true);
//     setError(null);
//     setStockHistory(null);

//     try {
//       const token = await getToken();
//       if (!token) {
//         throw new Error('Unauthorized: Token is missing');
//       }

//       const { result, ok } = await getStockHistory(Number(stockId), token);

//       if (!ok) {
//         throw new Error(result.msg || 'Failed to fetch stock history');
//       }

//       setStockHistory(result.data);
//     } catch (err: any) {
//       setError(err.message || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-gray-100">
//       <Card
//         style={{ maxWidth: '500px', width: '100%', padding: '20px' }}
//         isHoverable
//         isPressable
//       >
//         <h2 style={{ textAlign: 'center' }}>Stock History</h2>
//         <Spacer y={1} />
//         <Input
//           label="Stock ID"
//           placeholder="Enter Stock ID"
//           value={stockId}
//           onChange={(e) => setStockId(e.target.value)}
//           fullWidth
//           isClearable
//           size="lg"
//           variant="bordered"
//         />

//         <Spacer y={0.5} />
//         <Button
//           onClick={fetchStockHistory}
//           disabled={loading || !stockId.trim()}
//           variant={loading || !stockId.trim() ? 'ghost' : 'solid'}
//           size="lg"
//           style={{ width: '100%' }}
//         >
//           {loading ? 'Loading...' : 'Fetch History'}
//         </Button>

//         {/* Error message using <p> instead of <Text> */}
//         {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
//       </Card>
//       <Spacer y={2} />
//       {stockHistory && (
//         <div className="w-full max-w-4xl">
//           <Card style={{ padding: '20px' }}>
//             <h3>Stock History for ID: {stockId}</h3>
//             <Table
//               aria-label="Stock History Table"
//               style={{ marginTop: '20px' }}
//               shadow="none"
//             >
//               <TableHeader>
//                 <TableColumn>ID</TableColumn>
//                 <TableColumn>Quantity</TableColumn>
//                 <TableColumn>Date</TableColumn>
//               </TableHeader>
//               <TableBody>
//                 {stockHistory.map((history) => (
//                   <TableRow key={history.id}>
//                     <TableCell>{history.id}</TableCell>
//                     <TableCell>{history.quantity}</TableCell>
//                     <TableCell>
//                       {new Date(history.createdAt).toLocaleString()}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StockHistoryPage;

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

const SalesHistoryPage: React.FC = () => {
  const [stockId, setStockId] = useState<string>('1'); // Default stockId untuk di-fetch
  const [stockHistory, setStockHistory] = useState<StockHistory[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function untuk fetch stock history
  const fetchStockHistory = async (id: string) => {
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
        Number(id),
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

  // useEffect untuk otomatis fetch data saat komponen dirender
  useEffect(() => {
    if (stockId.trim()) {
      fetchStockHistory(stockId);
    }
  }, [stockId]);

  return (
    <div className="flex flex-col justify-center px-4 py-6 bg-gray-100">
      {/* <Card
        style={{ maxWidth: '500px', width: '100%', padding: '20px' }}
        isHoverable
        isPressable
      >
        <h2 style={{ textAlign: 'center' }}>Stock History</h2>
        <Spacer y={1} />
        <Input
          label="Stock ID"
          placeholder="Enter Stock ID"
          value={stockId}
          onChange={(e) => setStockId(e.target.value)}
          fullWidth
          isClearable
          size="lg"
          variant="bordered"
        />

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </Card>
      <Spacer y={2} /> */}
      <h2 className="text-2xl font-bold mb-4">Sales History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : stockHistory ? (
        <div className="w-full max-w-4xl">
          <Card style={{ padding: '20px' }}>
            <h3>Stock History for ID: {stockId}</h3>
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

export default SalesHistoryPage;

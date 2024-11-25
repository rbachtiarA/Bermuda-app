import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableRow,
} from '@nextui-org/react';
import { getToken } from '@/lib/server';
import { getDiscounts } from '@/lib/discount.handler';

interface Discount {
  id: number | null;
  discountType: string | null;
  value: number | null;
}

const DiscountList: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use effect hook to fetch discounts data on component mount
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true); // Set loading to true while data is being fetched
        const token = await getToken();
        const { result } = await getDiscounts(token);

        // Log the response to understand its structure
        console.log('API Response:', result);

        if (result && Array.isArray(result.discount)) {
          // Filter and validate data here
          const validDiscounts = result.discount.filter((discount: any) => {
            return (
              discount &&
              discount.id !== null &&
              discount.discountType !== null &&
              discount.value !== null
            );
          });

          setDiscounts(validDiscounts); // Update state with valid discounts
        } else {
          setError('Invalid discount data structure');
        }
      } catch (error) {
        setError('Failed to fetch discounts');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchDiscounts(); // Trigger the fetch function on mount
  }, []); // Empty dependency array ensures this runs once when component mounts

  // Show loading state or error message if any
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Render table if there are discounts
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Active Discounts
      </h2>
      {discounts.length > 0 ? (
        <Table aria-label="Discounts Table">
          {/* <TableHeader>
            <TableRow>
              <TableCell>Discount Type</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Discount Type</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableBody> */}
          {/* <TableBody>
            {discounts.map((discount) => {
              // Safely check if discountType and value exist
              const discountType = discount.discountType || 'N/A'; // Fallback to 'N/A' if missing
              const value =
                discount.value !== null && discount.value !== undefined
                  ? discount.value
                  : 'N/A'; // Fallback to 'N/A' if missing or invalid

              return (
                <TableRow key={discount.id}>
                  <TableCell>{discountType}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              );
            })}
          </TableBody> */}
        </Table>
      ) : (
        <p>No active discounts available</p>
      )}
    </div>
  );
};

export default DiscountList;

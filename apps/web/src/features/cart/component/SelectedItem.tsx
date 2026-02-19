'use client';

import currencyRupiah from '@/lib/rupiahCurrency';
import { useAppSelector } from '@/redux/hook';
import { selectedCartItem } from '@/redux/selector/cartSelector';
import { useMemo } from 'react';

export default function SelectedItem() {
  const selectedItem = useAppSelector(selectedCartItem);
  return (
    <div>
      {selectedItem.map((item) => (
        <div key={item.id} className="flex justify-between">
          <p className="max-w-[200px] line-clamp-1">{item.product?.name}</p>
          <p>
            {item.quantity} x {currencyRupiah(item.product?.price!)}
          </p>
        </div>
      ))}
    </div>
  );
}

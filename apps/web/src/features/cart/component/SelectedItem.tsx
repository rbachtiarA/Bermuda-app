'use client';

import currencyRupiah from '@/lib/rupiahCurrency';

export default function SelectedItem() {
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

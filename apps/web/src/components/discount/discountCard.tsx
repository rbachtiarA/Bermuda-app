import currencyRupiah from '@/lib/rupiahCurrency';
import { IDiscount } from '@/type/discount';
import { Card, CardBody } from '@nextui-org/react';

export default function DiscountCard({
  discount,
  itemTotalPayment,
  onSelect,
  onClose,
}: {
  itemTotalPayment: number;
  discount: IDiscount;
  onClose: () => void;
  onSelect: (discount: IDiscount) => void;
}) {
  return (
    <Card
      isHoverable
      isPressable={itemTotalPayment > (discount.minPurchase ?? 0)}
      isDisabled={itemTotalPayment < (discount.minPurchase ?? 0)}
      onPress={() => {
        onSelect(discount);
        onClose();
      }}
    >
      <CardBody>
        <div>
          <p>{discount.discountType}</p>
          <p>
            Discount cut :{' '}
            {discount.discountType !== 'PERCENTAGE' &&
            discount.discountType !== 'BUY_ONE_GET_ONE'
              ? currencyRupiah(discount.value)
              : discount.discountType !== 'BUY_ONE_GET_ONE'
                ? `${discount.value}%`
                : `${discount.value}`}
          </p>
          <p>Minimum purchase: {currencyRupiah(discount.minPurchase!)}</p>
        </div>
      </CardBody>
    </Card>
  );
}

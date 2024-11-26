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
          {
            discount.discountType !== 'BUY_ONE_GET_ONE' && 
            <>
              <p>
                Discount cut :{' '}
                {discount.discountType !== 'PERCENTAGE'? currencyRupiah(discount.value): `${discount.value}%` }
              </p>
              <p>Minimum purchase: {currencyRupiah(discount.minPurchase!)}</p>
            </>
          }
          {discount.products && <p>{discount.products?.name}</p>}
        </div>
      </CardBody>
    </Card>
  );
}

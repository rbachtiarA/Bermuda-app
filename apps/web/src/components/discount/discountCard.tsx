import currencyRupiah from "@/lib/rupiahCurrency";
import { IDiscount } from "@/type/discount";
import { Card, CardBody } from "@nextui-org/react";

export default function DiscountCard({discount, itemTotalPayment, onSelect, onClose}: {itemTotalPayment:number, discount: IDiscount,onClose:() => void, onSelect:(discount: IDiscount) => void}) {
  return (
    <Card 
        isHoverable 
        isPressable={itemTotalPayment > (discount.minPurchase??0)} 
        isDisabled={itemTotalPayment < (discount.minPurchase??0)}
        onPress={() => {
            onSelect(discount)
            onClose()
        }}
        >
        <CardBody>
        <div>
            <p>{discount.discountType}</p>
            <p>potongan : {discount.discountType !== 'PERCENTAGE'? currencyRupiah(discount.value) : `${discount.value}%`}</p>
            <p>pembelian minimum : {currencyRupiah(discount.minPurchase!)}</p>
        </div> 
        </CardBody>
    </Card>
  )
}

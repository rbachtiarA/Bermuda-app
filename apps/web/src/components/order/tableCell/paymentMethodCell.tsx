import { IOrder } from "@/type/order";
import { Chip } from "@nextui-org/react";

export default function PaymentMethodCell({paymentMethod}: {paymentMethod: IOrder['Payment']['paymentMethod']}) {
  return (
    <Chip className="capitalize" color={paymentMethod === "Gateway"? "primary" : 'secondary'} size='sm'>
        {paymentMethod}
	</Chip>
  )
}

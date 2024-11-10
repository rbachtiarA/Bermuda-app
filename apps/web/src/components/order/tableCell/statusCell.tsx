import { IOrder } from "@/type/order";
import { Chip } from "@nextui-org/react";
 
export default function StatusCell({status}: {status: IOrder['status']}) {
  return (
    <Chip className="capitalize" 
        color={status === 'Proccessed'? 'success' : status === "Cancelled" ?  'danger' : status === 'Completed'? 'success' :'warning'} 
        variant={status === "Shipped" || status === 'Completed' || status === 'Cancelled'? 'solid' : 'dot'}
        size='sm'
    >
        {status === 'PendingPayment'? 'Pending': status}
    </Chip>
  )
}

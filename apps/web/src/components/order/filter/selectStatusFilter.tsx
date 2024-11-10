import { IOrder } from "@/type/order";
import { Select, SelectItem } from "@nextui-org/react";

export default function SelectStatusFilter({statusFilter, setStatusFilter }: { statusFilter: ''| IOrder['status'],setStatusFilter: React.Dispatch<'' | IOrder['status']> }) {
    const ORDER_STATUS = [
        {key: 'PendingPayment' , label: 'Pending'},
        {key: 'Waiting' , label: 'Waiting'},
        {key: 'Proccessed' , label: 'Proccessed'},
        {key: 'Shipped' , label: 'Shipped'},
        {key: 'Completed' , label: 'Completed'},
        {key: 'Cancelled' , label: 'Cancelled'},
    ]
    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value as IOrder['status'])
    }
  return (
    <div className="w-full">
        <Select 
            label='Status order'
            placeholder='Filter order based on status'
            // selectionMode="multiple"
            selectedKeys={[statusFilter]}
            onChange={onChange}
            
        >
            {ORDER_STATUS.map((status) => (
                <SelectItem key={status.key}>
                    {status.label}
                </SelectItem>
            ))}
        </Select>
    </div>
  )
}

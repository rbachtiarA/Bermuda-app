import currencyRupiah from "@/lib/rupiahCurrency";
import { IOrder } from "@/type/order";
import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { Key, useCallback } from "react";
import AcceptPaymentIcon from "../icon/acceptPaymentIcon";
import DeniedPaymentIcon from "../icon/deniedPaymentIcon";
import CancelOrderIcon from "../icon/cancelOrderIcon";
import ShippingOrderIcon from "../icon/ShipOrderIcon";

export default function OrderTable({data, admin}:{admin?:boolean, data: IOrder[]}) {
	const COLUMN_TABLE_USER = [
		{name: 'CREATED DATE', uid: 'date'},
		{name: 'ORDER NO', uid: 'id'},
		{name: 'STATUS', uid: 'status'},
		{name: 'PAYMENT METHOD', uid: 'paymentMethod'},
		{name: 'TOTAL PAYMENT', uid: 'totalAmount'},
	]

	const COLUMN_TABLE_ADMIN = [
		{name: 'CREATED DATE', uid: 'date'},
		{name: 'ORDER NO', uid: 'id'},
		{name: 'STATUS', uid: 'status'},
		{name: 'PAYMENT METHOD', uid: 'paymentMethod'},
		{name: 'TOTAL PAYMENT', uid: 'totalAmount'},
		{name: 'ACTIONS', uid: 'adminActions'}
	]

	const renderCell = useCallback((order: IOrder, columnKey: Key) => {

		switch (columnKey) {
			case 'id':
				return (
					<div>
						<p>{order.id}</p>
					</div>
				)
			case 'status':
				return (
					<Chip className="capitalize" 
						color={order.status === 'Proccessed'? 'success' : order.status === "Cancelled" ?  'danger' : order.status === 'Completed'? 'success' :'warning'} 
						variant={order.status === "Shipped" || order.status === 'Completed' || order.status === 'Cancelled'? 'solid' : 'dot'}
						size='sm'
					>
						{order.status}
					</Chip>
				)
			case 'paymentMethod':
				return (
					<Chip className="capitalize" color={order.Payment.paymentMethod === "Gateway"? "primary" : 'secondary'} size='sm'>
						{order.Payment.paymentMethod}
					</Chip>
				)
			case 'date':
				return (
					<div>
						<p>{order.createdAt}</p>
					</div>
				)
			case 'totalAmount':
				return (
					<div>
						<p>{currencyRupiah(order.totalAmount)}</p>
					</div>
				)
			case `adminActions`:
				const isDenyAble = (order.paymentProofUrl && order.status=== 'Waiting' && !order.Payment.isConfirmed) || false
				const isAcceptable = isDenyAble
				const isCancelAble = !(order.status === 'Completed' || order.status === 'Cancelled' || order.status === 'Shipped') || false
				const isShippedAble = order.status === 'Proccessed'
				return (
					<div className="flex gap-2">
						<Tooltip content="Deny Payment" hidden={!isDenyAble}>
							<span 
								className={`text-lg text-default-400 
								${isDenyAble? `cursor-pointer active:opacity-50` : ''}`} 
								onClick={isDenyAble? () => console.log('hello'): () => null}
							>
								<DeniedPaymentIcon fill={!isDenyAble? '#aaaaaa': undefined}/>
							</span>
						</Tooltip>
						<Tooltip content="Accept Payment" hidden={!isAcceptable}>
							<span 
								className={`text-lg text-default-400 
								${isAcceptable? `cursor-pointer active:opacity-50`: ''}`} 
								onClick={() => console.log('hello')}
							>
								<AcceptPaymentIcon fill={!isAcceptable? '#aaaaaa': undefined}/>
							</span>
						</Tooltip>
						<Tooltip content="Cancel Order" hidden={!isCancelAble}>
							<span className={`text-lg text-default-400 
								${isCancelAble? `cursor-pointer active:opacity-50` : ''}`} 
								onClick={() => console.log('hello')}
							>
								<CancelOrderIcon fill={!isCancelAble? '#aaaaaa': undefined}/>
							</span>
						</Tooltip>
						<Tooltip content="Deliver" hidden={!isShippedAble}>
							<span className={`text-lg text-default-400 
								${isShippedAble? `cursor-pointer active:opacity-50` : ''}`} 
								onClick={() => console.log('hello')}
							>
								<ShippingOrderIcon fill={!isShippedAble? '#aaaaaa': undefined}/>
							</span>
						</Tooltip>
					</div>
				)
		}

	}, [])
    return (
      <div>
		<Table aria-label="User Order Table">
			<TableHeader columns={admin? COLUMN_TABLE_ADMIN : COLUMN_TABLE_USER}>
				{(column) => (
					<TableColumn key={column.uid}>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody items={data}>
				{(item) => (
					<TableRow key={item.id}>
						{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
					</TableRow>
				)}
			</TableBody>
		</Table>
	  </div>
    )
}

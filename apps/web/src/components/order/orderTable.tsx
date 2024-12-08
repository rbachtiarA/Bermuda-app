'use client'
import currencyRupiah from "@/lib/rupiahCurrency";
import { IOrder } from "@/type/order";
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { Key, useCallback, useEffect } from "react";
import StatusCell from "./tableCell/statusCell";
import PaymentMethodCell from "./tableCell/paymentMethodCell";
import AdminActionsCell from "./tableCell/AdminActionsCell";
import UserActionsCell from "./tableCell/UserActionsCell";

export default function OrderTable({data, admin,isLoading, onAccept, onCancel, onDeny, onShip, onReceive}:{admin?:boolean, data: IOrder[], isLoading: boolean,
	onDeny?:(orderId: number) => void, onAccept?:(orderId: number) => void, onCancel?:(orderId: number) => void, onShip?:(orderId: number) => void, onReceive?:(orderId: number) => void 
}) {
	const COLUMN_TABLE_USER = [
		{name: 'CREATED DATE', uid: 'date'},
		{name: 'ORDER NO', uid: 'id'},
		{name: 'STATUS', uid: 'status'},
		{name: 'PAYMENT METHOD', uid: 'paymentMethod'},
		{name: 'TOTAL PAYMENT', uid: 'totalAmount'},
		{name: 'ACTIONS', uid: 'userActions'}
	]

	const COLUMN_TABLE_ADMIN = [
		{name: 'CREATED DATE', uid: 'date'},
		{name: 'ORDER NO', uid: 'id'},
		{name: 'STATUS', uid: 'status'},
		{name: 'PAYMENT METHOD', uid: 'paymentMethod'},
		{name: 'TOTAL PAYMENT', uid: 'totalAmount'},
		{name: 'ACTIONS', uid: 'adminActions'}
	]	
	
	const onLook = () => {

	}

	const renderCell = (order: IOrder, columnKey: Key) => {
		const isImageExist = !!order.paymentProofUrl
		switch (columnKey) {
			case 'id':
				return (
					<div>
						<p>{order.id}</p>
					</div>
				)
			case 'status':
				return (
					<StatusCell status={order.status}/>
				)
			case 'paymentMethod':
				return (
					<PaymentMethodCell paymentMethod={order.Payment.paymentMethod}/>
				)
			case 'date':
				return (
					<div>
						<p>{new Date(order.createdAt).toLocaleString()}</p>
					</div>
				)
			case 'totalAmount':
				return (
					<div>
						<p>{currencyRupiah(order.totalAmount)}</p>
					</div>
				)
			case 'userActions':
				const isReceiveAble = order.status === "Shipped"
				return (
					<div className="flex gap-2">
						<UserActionsCell order={order} isImageExist={isImageExist} isReceiveAble={isReceiveAble} onLook={onLook} onReceive={onReceive!}/>
					</div>
				)
			case `adminActions`:
				const isDenyAble = (order.paymentProofUrl && order.status=== 'Waiting' && !order.Payment.isConfirmed) || false
				const isAcceptAble = isDenyAble
				const isCancelAble = !(order.status === 'Completed' || order.status === 'Cancelled' || order.status === 'Shipped') || false
				const isShippedAble = order.status === 'Proccessed'
				
				return (
					<AdminActionsCell
						onAccept={onAccept!}
						onCancel={onCancel!}
						onDeny={onDeny!}
						onShip={onShip!}
						order={order}
						isDenyAble={isDenyAble}
						isAcceptAble={isAcceptAble}
						isCancelAble={isCancelAble}
						isShippedAble={isShippedAble}
						isImageExist={isImageExist}
					/>
				)
		}
	}
	
    return (
      <div className="">
		<Table aria-label="User Order Table">
			<TableHeader columns={admin? COLUMN_TABLE_ADMIN : COLUMN_TABLE_USER}>
				{(column) => (
					<TableColumn key={column.uid}>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				isLoading={isLoading}
				loadingContent={<Spinner color="default" label="Fetching data..."/>}
			>
				{
					data.map((item) => (
						<TableRow key={item.id}>
							{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
						</TableRow>
					))
				}
			</TableBody>
		</Table>
	  </div>
    )
}

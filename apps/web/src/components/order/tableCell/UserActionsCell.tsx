import OpenFileIcon from '@/components/icon/OpenFileIcon'
import { IOrder } from '@/type/order'
import React from 'react'
import TableActionTooltip from './tableActionTooltip'
import ReceivedOrderIcon from '@/components/icon/receivedOrderIcon'

export default function UserActionsCell({
    order, isImageExist,isReceiveAble, onLook, onReceive
}: {
	order:IOrder,isImageExist: Boolean, isReceiveAble: Boolean,
	onLook:(orderId: number) => void, onReceive:(orderId: number) => void
}) {
    const openImage = () => {
        window.open(order.paymentProofUrl)
    }

  return (
    <div className="flex gap-2">
		<TableActionTooltip content='Open Image' isDisabled={isImageExist} onClick={openImage}>
			<OpenFileIcon fill={!isImageExist? '#aaaaaa': undefined}/>
		</TableActionTooltip>
		<TableActionTooltip content='Complete order' isDisabled={isReceiveAble} onClick={() => onReceive(order.id)}>
			<ReceivedOrderIcon fill={!isReceiveAble? '#aaaaaa': undefined}/>
		</TableActionTooltip>
	</div>
  )
}

import OpenFileIcon from '@/components/icon/OpenFileIcon'
import { IOrder } from '@/type/order'
import React from 'react'
import TableActionTooltip from './tableActionTooltip'
import ReceivedOrderIcon from '@/components/icon/receivedOrderIcon'
import { useRouter } from 'next/navigation'
import OpenOrderIcon from '@/components/icon/openOrderIcon'
import PaymentProofModal from '@/components/modal/paymentProofModal'
import { useDisclosure } from '@nextui-org/react'

export default function UserActionsCell({
    order, isImageExist,isReceiveAble, onLook, onReceive
}: {
	order:IOrder,isImageExist: Boolean, isReceiveAble: Boolean,
	onLook:(orderId: number) => void, onReceive:(orderId: number) => void
}) {
	const {isOpen, onOpen, onOpenChange} = useDisclosure()
	const router = useRouter()
    const openImage = () => {
        onOpen()
    }
	const openOrder = () => {
		router.push(`/user/order/${order.id}`)
	}
  return (
    <div className="flex gap-2">
		<TableActionTooltip content='Open Image' isDisabled={isImageExist} onClick={openImage} noModal>
			<OpenFileIcon fill={!isImageExist? '#aaaaaa': undefined}/>
			<PaymentProofModal imgLink={order.paymentProofUrl!} isOpen={isOpen} onOpenChange={onOpenChange} title={`${order.id!}`} />
		</TableActionTooltip>
		<TableActionTooltip content='Complete order' isDisabled={isReceiveAble} onClick={() => onReceive(order.id)}>
			<ReceivedOrderIcon fill={!isReceiveAble? '#aaaaaa': undefined}/>
		</TableActionTooltip>
		<TableActionTooltip content='Look order' isDisabled={true} onClick={() => openOrder()} noModal>
			<OpenOrderIcon fill={!true? '#aaaaaa': undefined}/>
		</TableActionTooltip>
	</div>
  )
}

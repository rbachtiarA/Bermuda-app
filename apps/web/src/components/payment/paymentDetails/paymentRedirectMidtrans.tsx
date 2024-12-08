'use client'
import ConfirmationModal from "@/components/modal/confirmationModal"
import { getMidtransStatus } from "@/lib/order.handler"
import { IOrder } from "@/type/order"
import { Button, Spinner, useDisclosure } from "@nextui-org/react"
import { Dispatch, SetStateAction, useState } from "react"
import { toast } from "react-toastify"

export default function PaymentRedirectMidtrans({token, orderId, data, setData, onClickCancelOrder}: {token: string, orderId:number, data: IOrder | null, setData:Dispatch<SetStateAction<IOrder | null>>, onClickCancelOrder:() => any}) {
    const {isOpen, onOpenChange, onOpen} = useDisclosure()
    const [isError, setIsError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const onClickRedirect = () => {
        window.open(`https://app.sandbox.midtrans.com/snap/v4/redirection/${token}`, '_blank', 'popup,noopener,norefferer')
    }
    const onClickCheckStatus = async () => {
        setIsLoading(true)
        const status = await getMidtransStatus(orderId)
        
        if(status.status === "NOT_FOUND") {
            setIsLoading(false)
            return setIsError("Please choose method in 'Pay with Gateway' first before 'check status'")
        } 
        
        switch (status.midtrans) {
            case "expire":
                toast.error('your payment is Expired')
                break;
            
            case "settlement":
                toast.success('your payment success and confirmed')
                setData({...data!, status: "Proccessed"})
                break;
            default:
                toast.info('Your payment still waiting to be paid')
                break;
        }
        setIsLoading(false)
    }

    const onCancel = async () => {
        setIsLoading(true)
        const msg = await onClickCancelOrder()
        
        if(msg === 'NOT_FOUND') {
            setIsError("Please choose method in 'Pay with Gateway' first before 'Cancel Payment'")
        } else if(msg !== `FOUND`) {
            setIsError("Error: Something is wrong")
        }
        setIsLoading(false)
    }
    return (
        <div className="grid grid-row-[auto] gap-2 justify-end">
            {isError && <p className="text-warning text-[12px]">{isError}</p>}
            <div className="grid grid-cols-[2fr_1fr] gap-2">
                <Button color={'primary'} onPress={onClickRedirect} isDisabled={isLoading}>Pay with Gateway</Button>
                <Button color={'primary'} variant="bordered" onPress={onClickCheckStatus} isDisabled={isLoading}>Check Status</Button>
            </div>
            <Button color={'danger'} variant="light" size="sm" onPress={onOpen} isDisabled={isLoading}>Cancel Payment</Button>
            <ConfirmationModal isOpen={isOpen} onConfirm={() => onCancel()} onOpenChange={onOpenChange} title="Cancel Payment" content="Are you sure want to cancel this order ?" />
            
        </div>
    )
}
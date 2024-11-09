'use client'
import { useMemo, useState } from "react"
import AddressessList from "./addressList"
import CheckoutList from "./checkoutList"
import PaymentTotalList from "./paymentList"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { IAddress } from "@/type/address"
import { getMidtransToken, getOrderPendingPayment, postOrder } from "@/lib/order.handler"
import { useRouter } from "next/navigation"
import { resetCheckout } from "@/redux/slice/checkoutSlice"

export default function CheckoutWrapper() {
    const user = useAppSelector(state => state.user)
    const store = useAppSelector(state => state.store)
    const dispatch = useAppDispatch()
    const [itemTotalPayment, setItemTotalPayment] = useState<number | null>(null)
    const [travelPayment, setTravelPayment] = useState<number | null>(null)
    const [methodPayment, setMethodPayment] = useState<'Transfer' | 'Gateway' | null>(null)
    const [selectedAddress, setselectedAddress] = useState<IAddress | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState<string | null>(null)
    const router = useRouter()
    const onBuy = async () => {
        setIsLoading(true)
        const pendingOrder = await getOrderPendingPayment(user.id)
        if(pendingOrder) {
            console.log('You need to proccess your payment previous order to make new order');
            setIsError('You need to proccess your payment previous order to make new order')
        } else {
            const {status, order, msg} = await postOrder(user.id, itemTotalPayment!+travelPayment!, travelPayment!, selectedAddress?.id!, store.id! ,methodPayment! )
            if(status === 'error') {
                if(msg.code === 'ITEM_INSUFFICIENT') {
                    setIsError(msg.details)
                }
            }
                    
            if(order && methodPayment === 'Gateway') {
                const token = await getMidtransToken(user.id, order.order.id as number)
                window.open(`https://app.sandbox.midtrans.com/snap/v4/redirection/${token}`, '_blank', 'noopener,noreferrer')
            }
            if(order) router.push('/payment')               
            
        }
        //update checkoutItem user to null using api
        dispatch(resetCheckout())
        setIsLoading(false)
    }

    const updateSelectedAddress = (address: IAddress | undefined) => {
        setselectedAddress(address)
    }

    const updateItemTotalPayment = (totalPayment: number) => {
        setItemTotalPayment(totalPayment)
    }
    const updateTravelPayment = (travelPayment: number) => {
        setTravelPayment(travelPayment)
    }
    
    const updateMethodPayment = (methodPayment: string) => {
        if(methodPayment === 'Transfer' || methodPayment === 'Gateway' ) {
            setMethodPayment(methodPayment)
        } else {
            setMethodPayment(null)
        }
        
    }

    const isPaymentInvalid = useMemo(
        () => {
            return !travelPayment || !itemTotalPayment || !methodPayment
        }, [travelPayment, itemTotalPayment, methodPayment])
    
    return (
        <div className="grid md:grid-cols-[2fr_1fr] md:w-auto gap-2 w-full p-2">
            <div className="grid gap-2">
                <AddressessList updateTravelPayment={updateTravelPayment} selectedAddress={selectedAddress} updateSelectedAddress={updateSelectedAddress}/>
                <CheckoutList updateItemTotalPayment={updateItemTotalPayment}/>
            </div>
            <div>
                <PaymentTotalList
                    isError={isError}
                    itemTotalPayment={itemTotalPayment} 
                    travelPayment={travelPayment} 
                    isPaymentInvalid={isPaymentInvalid} 
                    methodPayment={methodPayment} 
                    isLoading={isLoading}
                    updateMethodPayment={updateMethodPayment}
                    onBuy={onBuy}
                />
            </div>
        </div>
    )
}
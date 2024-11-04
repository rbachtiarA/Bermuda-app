'use client'
import { useMemo, useState } from "react"
import AddressessList from "./addressList"
import CheckoutList from "./checkoutList"
import PaymentTotalList from "./paymentList"
import { useAppSelector } from "@/redux/hook"
import { IAddress } from "@/type/address"
import { getMidtransToken, getOrderPendingPayment, postOrder } from "@/lib/order"
import { useRouter } from "next/navigation"

export default function CheckoutWrapper() {
    const user = useAppSelector(state => state.user)
    const store = useAppSelector(state => state.store)
    const [itemTotalPayment, setItemTotalPayment] = useState<number | null>(null)
    const [travelPayment, setTravelPayment] = useState<number | null>(null)
    const [methodPayment, setMethodPayment] = useState<'Transfer' | 'Gateway' | null>(null)
    const [selectedAddress, setselectedAddress] = useState<IAddress | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const onBuy = async () => {
        setIsLoading(true)
        const pendingOrder = await getOrderPendingPayment(user.id)
        if(pendingOrder) {
            console.log('You need to proccess your payment previous order to make new order');
        } else {
            try {
                const {status, order, msg} = await postOrder(user.id, itemTotalPayment!+travelPayment!, travelPayment!, selectedAddress?.id!, store.id! ,methodPayment! )
                if(status === 'failed' || status === 'error') throw msg
                        
                if(order && methodPayment === 'Gateway') {
                    const token = await getMidtransToken(user.id, order.order.id as number)
                    window.open(`https://app.sandbox.midtrans.com/snap/v4/redirection/${token}`, '_blank', 'noopener,noreferrer')
                }
                if(order) router.push('/payment')
            } catch (error) {
                console.log(error);
            }
            
        }
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
        <div className="grid md:grid-cols-[2fr_1fr] gap-2">
            <div className="grid gap-2">
                <AddressessList updateTravelPayment={updateTravelPayment} selectedAddress={selectedAddress} updateSelectedAddress={updateSelectedAddress}/>
                <CheckoutList updateItemTotalPayment={updateItemTotalPayment}/>
            </div>
            <div>
                <PaymentTotalList 
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
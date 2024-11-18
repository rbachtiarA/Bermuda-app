'use client'
import { useEffect, useMemo, useState } from "react"
import AddressessList from "./addressList"
import CheckoutList from "./checkoutList"
import PaymentTotalList from "./paymentList"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { IAddress } from "@/type/address"
import { getMidtransToken, getOrderPendingPayment, postOrder } from "@/lib/order.handler"
import { useRouter } from "next/navigation"
import { resetCheckout } from "@/redux/slice/checkoutSlice"
import { IDiscount } from "@/type/discount"
import { getShippingCost } from "@/lib/address"
import { getNearestStore } from "@/lib/store.handler"
import { updateStore } from "@/redux/slice/storeSlice"
import { error } from "console"

export default function CheckoutWrapper() {
    const user = useAppSelector(state => state.user)
    const store = useAppSelector(state => state.store)
    const dispatch = useAppDispatch()
    const [itemTotalPayment, setItemTotalPayment] = useState<number>(0)
    const [discount, setDiscount] = useState<IDiscount|null>(null)
    const [shippingCost, setShippingCost] = useState<number | null>(null)
    const [methodPayment, setMethodPayment] = useState<'Transfer' | 'Gateway' | null>(null)
    const [selectedAddress, setselectedAddress] = useState<IAddress | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState<string | null>(null)
    const router = useRouter()
    const discountCut = useMemo(() => {
        if(!!discount) {
            let val = 0
            switch (discount.discountType) {
                case 'FLAT':
                    val = discount.value
                    break;
                case 'PERCENTAGE':
                    //if value based on 100/100
                    val = itemTotalPayment!*(discount.value/100)
                    break;
                case 'REFERRAL_GIVER':
                    break;
                case 'REFERRAL_USER':
                    break;
            }
            return val
        } else {
            return 0
        }
    },[itemTotalPayment, discount])

    const onBuy = async () => {
        setIsLoading(true)
        const pendingOrder = await getOrderPendingPayment()
        if(pendingOrder) {
            setIsError('You need to proccess your payment previous order to make new order')
        } else {
            const {status, order, msg} = await postOrder(itemTotalPayment!+shippingCost!-discountCut!, shippingCost!, selectedAddress?.id!, store.id!, discountCut ,methodPayment!, discount?.id )
            if(status === 'error') {
                if(msg.code === 'ITEM_INSUFFICIENT') {
                    setIsError(msg.details)
                }
            }
                    
            if(order && methodPayment === 'Gateway') {
                const token = await getMidtransToken(order.order.id as number)
                window.open(`https://app.sandbox.midtrans.com/snap/v4/redirection/${token}`, '_blank', 'noopener,noreferrer')
            }
            if(order) router.push('/account/payment')               
            
        }
        //update checkoutItem user to null using api
        dispatch(resetCheckout())
        setIsLoading(false)
    }

    const onDiscount = (discount: IDiscount|null) => {        
        setDiscount(discount)
    }

    const updateSelectedAddress = (address: IAddress | undefined) => {
        setselectedAddress(address)
    }

    const updateItemTotalPayment = (totalPayment: number) => {
        setItemTotalPayment(totalPayment)
    }
    
    const updateMethodPayment = (methodPayment: string) => {
        if(methodPayment === 'Transfer' || methodPayment === 'Gateway' ) {
            setMethodPayment(methodPayment)
        } else {
            setMethodPayment(null)
        }
        
    }

    useEffect(() => {
        const getDataShippingCost = async () => {
            setShippingCost(null)
            if(selectedAddress) {
                const { status, msg } = await getShippingCost(selectedAddress?.id, store.id)
                if(status === 'ok') setShippingCost(msg)
            }
        }

        const getNearStore = async () => {
            if(selectedAddress) {
                const { status, msg } = await getNearestStore(selectedAddress.latitude!, selectedAddress.longitude!)
                console.log(msg);
                
                if(status === 'ok') dispatch(updateStore({id: msg.id, name: msg.name}))
            }
        }
        getNearStore()
        getDataShippingCost()
    }, [selectedAddress])

    const isPaymentInvalid = useMemo(
        () => {
            return !shippingCost || !itemTotalPayment || !methodPayment || !selectedAddress
        }, [shippingCost, itemTotalPayment, methodPayment])
    
    return (
        <div className="grid md:grid-cols-[2fr_1fr] md:w-auto gap-2 w-full p-2">
            <div className="grid gap-2">
                <AddressessList selectedAddress={selectedAddress} updateSelectedAddress={updateSelectedAddress}/>
                <CheckoutList updateItemTotalPayment={updateItemTotalPayment}/>
            </div>
            <div>
                <PaymentTotalList
                    discount={discount}
                    discountCut={discountCut}
                    isError={isError}
                    itemTotalPayment={itemTotalPayment} 
                    travelPayment={shippingCost} 
                    isPaymentInvalid={isPaymentInvalid} 
                    methodPayment={methodPayment} 
                    isLoading={isLoading}
                    updateMethodPayment={updateMethodPayment}
                    onBuy={onBuy}
                    onDiscount={onDiscount}
                />
            </div>
        </div>
    )
}
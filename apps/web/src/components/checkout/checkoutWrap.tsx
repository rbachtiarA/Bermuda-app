'use client'
import { useMemo, useState } from "react"
import AddressessList from "./addressList"
import CheckoutList from "./checkoutList"
import PaymentTotalList from "./paymentList"

export default function CheckoutWrapper() {
    const [itemTotalPayment, setItemTotalPayment] = useState<number | null>(null)
    const [travelPayment, setTravelPayment] = useState<number | null>(null)
    const [methodPayment, setMethodPayment] = useState<'TRANSFER' | 'PAYMENT_GATEWAY' | null>(null)
    const [paymentGatewayService, setPaymentGatewayService] = useState<'MOBILE_BANKING' | 'CREDIT_CARD' | null>(null)
    
    
    const updateItemTotalPayment = (totalPayment: number) => {
        setItemTotalPayment(totalPayment)
    }
    const updateTravelPayment = (travelPayment: number) => {
        setTravelPayment(travelPayment)
    }
    
    const updateMethodPayment = (methodPayment: string) => {
        if(methodPayment === 'TRANSFER' || methodPayment === 'PAYMENT_GATEWAY' ) {
            setMethodPayment(methodPayment)
        } else {
            setMethodPayment(null)
        }
        setPaymentGatewayService(null)
        
    }
    
    const updateGatewayService = (paymentGatewayService: string) => {
        if(paymentGatewayService === 'MOBILE_BANKING' || paymentGatewayService === 'CREDIT_CARD') {
            setPaymentGatewayService(paymentGatewayService)
        } else {
            setPaymentGatewayService(null)
        }
    }

    const isPaymentValid = useMemo(
        () => {
            return !travelPayment || !itemTotalPayment || !methodPayment || (methodPayment === 'PAYMENT_GATEWAY' && !paymentGatewayService)
        }, [travelPayment, itemTotalPayment, methodPayment, paymentGatewayService])
    
    return (
        <div className="grid md:grid-cols-[2fr_1fr] gap-2">
            <div className="grid gap-2">
                <AddressessList updateTravelPayment={updateTravelPayment}/>
                <CheckoutList updateItemTotalPayment={updateItemTotalPayment}/>
            </div>
            <div>
                <PaymentTotalList 
                    itemTotalPayment={itemTotalPayment} travelPayment={travelPayment} isPaymentValid={isPaymentValid} methodPayment={methodPayment} 
                    updateMethodPayment={updateMethodPayment} updateGatewayService={updateGatewayService}
                />
            </div>
        </div>
    )
}
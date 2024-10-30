'use client'
import { useMemo, useState } from "react"
import AddressessList from "./addressList"
import CheckoutList from "./checkoutList"
import PaymentTotalList from "./paymentList"
import { useAppSelector } from "@/redux/hook"
import { IAddress } from "@/type/address"

export default function CheckoutWrapper() {
    const user = useAppSelector(state => state.user)
    const [itemTotalPayment, setItemTotalPayment] = useState<number | null>(null)
    const [travelPayment, setTravelPayment] = useState<number | null>(null)
    const [methodPayment, setMethodPayment] = useState<'TRANSFER' | 'PAYMENT_GATEWAY' | null>(null)
    const [paymentGatewayService, setPaymentGatewayService] = useState<'MOBILE_BANKING' | 'CREDIT_CARD' | null>(null)
    const [handphone, setHandphone] = useState<string>('')
    const [creditCard, setCreditCard] = useState<string>('')
    const [selectedAddress, setselectedAddress] = useState<IAddress | undefined>(undefined)

    
    const onBuy = () => {
        const data = {
            userId: user.id,
            totalAmount: itemTotalPayment
        }
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
        setHandphone('')
        setCreditCard('')
    }

    const updateHandphone = (value: string) => {
        setHandphone(value)
    } 
    const updateCreditCard = (value: string) => {
        setCreditCard(value)
    } 

    const isPaymentInvalid = useMemo(
        () => {
            return !travelPayment || !itemTotalPayment || !methodPayment || 
            (methodPayment === 'PAYMENT_GATEWAY' && !paymentGatewayService) || 
            (paymentGatewayService === 'CREDIT_CARD' && (creditCard.length < 16 || creditCard.length > 19)) ||
            (paymentGatewayService === 'MOBILE_BANKING' && (handphone.length < 10 || handphone.length > 13))
        }, [travelPayment, itemTotalPayment, methodPayment, paymentGatewayService, handphone, creditCard])
    
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
                    paymentGatewayService={paymentGatewayService}
                    handphone={handphone}
                    creditCard={creditCard}
                    updateMethodPayment={updateMethodPayment} 
                    updateGatewayService={updateGatewayService}
                    updateHandphone={updateHandphone}
                    updateCreditCard={updateCreditCard}
                />
            </div>
        </div>
    )
}
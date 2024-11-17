import PaymentCard from "@/components/payment/paymentCard";

export default function page() {
    
    return (
        <div className="grid md:grid-cols-[1fr_2fr_1fr]">
            <div className="md:col-start-2 md:row-start-2 ">
                <PaymentCard />
            </div>
        </div>
    )
}
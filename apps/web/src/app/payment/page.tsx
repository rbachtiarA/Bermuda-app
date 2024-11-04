import PaymentCard from "@/components/payment/paymentCard";

export default function page() {
    
    return (
        <div className="my-2 grid md:grid-cols-[1fr_2fr_1fr]">
            <div className="col-start-2">
                <PaymentCard />
            </div>
        </div>
    )
}
import TitleBreadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import CheckoutWrapper from "@/components/checkout/checkoutWrap";

export default function page() {
    return (
        <section className="grid md:grid-cols-[1fr_8fr_1fr]">
            <div className="md:col-start-2 p-2">
                <TitleBreadcrumbs title="Checkout"/>
            </div>
            <div className="md:col-start-2">
                <CheckoutWrapper />
            </div>
        </section>
    )
}
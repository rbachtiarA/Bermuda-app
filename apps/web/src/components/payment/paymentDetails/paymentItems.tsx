import currencyRupiah from "@/lib/rupiahCurrency";
import { IOrderItem } from "@/type/order";
import { Divider } from "@nextui-org/react";

export default function PaymentItems({items}: {items: IOrderItem[]}) {
    return (
        <div className="bg-foreground-100 rounded-md p-2">
            <ul className="">
                {items.map((item, idx) => {
                    return (
                        <li key={item.id} className={`grid grid-cols-2 md:grid-cols-[2fr_1fr_2fr] first:border-none border-t-2`}>
                            <p className="flex justify-start">{idx+1}. {item.product.name}</p>
                            <p className="md:col-start-3 flex justify-end items-end">{item.quantity}&nbsp;x&nbsp;{currencyRupiah(item.price)}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
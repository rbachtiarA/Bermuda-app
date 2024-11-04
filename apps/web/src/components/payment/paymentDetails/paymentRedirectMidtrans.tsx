import { getMidtransStatus } from "@/lib/order"
import { Button } from "@nextui-org/react"

export default function PaymentRedirectMidtrans({token, orderId, getData}: {token: string, orderId:number, getData: ()=> void}) {
    const onClickRedirect = () => {
        window.open(`https://app.sandbox.midtrans.com/snap/v4/redirection/${token}`, '_blank', 'popup,noopener,norefferer')
    }
    const onClickCheckStatus = async () => {
        const status = await getMidtransStatus(orderId)
        console.log(status);
        getData()
    }

    return (
        <div className="grid grid-row-[auto] gap-2 justify-end">
            <div className="grid grid-cols-[2fr_1fr] gap-2">
                <Button color={'primary'} onPress={onClickRedirect} className="">Pay with Gateway</Button>
                <Button color={'primary'} variant="bordered" onPress={onClickCheckStatus} className="">Check Status</Button>
            </div>
            <Button color={'danger'} variant="light" size="sm" className="">Cancel Payment</Button>
        </div>
    )
}
import prisma from "@/prisma"

export default async function confirmedOrder(orderId: number) {

    await prisma.$transaction(async (tx) => {
        //const order status
        const existOrder = await tx.order.findUnique({
            where: {id: +orderId},
            include: {orderItems: true}
        })
        if(!existOrder) throw 'Order not exist'
        // code for update store quantity with cancelled order Items
        const cancelledOrderItems = existOrder.orderItems.map((item) => {
            return { productId: item.productId, quantity: item.quantity }
        })
        
        // update all quantity stock back to store and update Stock history
        for (const item of cancelledOrderItems) {
            const existStock = await tx.stock.findFirst({
                where: {
                    AND: {
                        productId: item.productId,
                        storeId: existOrder.storeId
                    }
                }
            })
            if(!existStock) throw 'Something wrong when addedd product quantity to store'

            if(existOrder?.status === 'Proccessed') {
                await tx.stockHistory.create({
                    data: {
                        changeType: 'DECREASE',
                        stockId: existStock.id,
                        quantity: item.quantity
                    }
                })
            }
        }        
    })
}
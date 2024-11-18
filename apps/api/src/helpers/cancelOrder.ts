import prisma from "@/prisma"

export default async function cancelOrder(orderId: number) {

    await prisma.$transaction(async (tx) => {
        //const order status
        const existOrder = await tx.order.findUnique({
            where: {id: +orderId}
        })

        //change order status
        const updatedOrder = await tx.order.update({
            where: { id: +orderId },
            include: { orderItems: true },
            data: {
                status: 'Cancelled',
            }
        })
    
        // code for update store quantity with cancelled order Items
        const cancelledOrderItems = updatedOrder.orderItems.map((item) => {
            return { productId: item.productId, quantity: item.quantity }
        })
        
        // update all quantity stock back to store and update Stock history
        for (const item of cancelledOrderItems) {
            const existStock = await tx.stock.findFirst({
                where: {
                    AND: {
                        productId: item.productId,
                        storeId: updatedOrder.storeId
                    }
                }
            })
            if(!existStock) throw 'Something wrong when addedd product quantity to store'
    
            await tx.stock.update({
                where: { id: existStock.id },
                data: { quantity: { increment: item.quantity}  }
            })

            if(existOrder?.status === 'Proccessed') {
                await tx.stockHistory.create({
                    data: {
                        changeType: 'INCREASE',
                        stockId: existStock.id,
                        quantity: item.quantity
                    }
                })
            }
        }        
    })
}
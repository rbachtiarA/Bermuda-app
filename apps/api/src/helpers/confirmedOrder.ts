import prisma from "@/prisma"

export default async function confirmedOrder(orderId: number) {
        await prisma.$transaction(async (tx) => {
            //const order status
            const updatedOrder = await tx.order.update({
                where: {
                    id: orderId
                },
                data: {
                    status: 'Proccessed',
                    Payment: {
                        update: {
                            confirmedAt: new Date(Date.now()),
                            isConfirmed: true
                        }
                    }
                },
                include: {
                    orderItems: true
                }
            })
            if(!updatedOrder) throw 'Order not exist'
            // code for update store quantity with confirmed order Items
            const cancelledOrderItems = updatedOrder.orderItems.map((item) => {
                return { productId: item.productId, quantity: item.quantity }
            })
            
            // update all quantity stock to reduce sold item and update Stock history
            for (const item of cancelledOrderItems) {
                const existStock = await tx.stock.findFirst({
                    where: {
                        AND: {
                            productId: item.productId,
                            storeId: updatedOrder.storeId
                        }
                    }
                })
                if(!existStock) throw 'Something wrong when creating product quantity to store stock history' 
    
                if(updatedOrder?.status === 'Proccessed') {
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
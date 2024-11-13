import { PrismaClient } from '@prisma/client';
import cron from 'node-cron'

const prisma = new PrismaClient()
cron.schedule('* * * * *', async () => {
    await cancelExpiredOrders()
    await completeShippedOrders()
})

async function cancelExpiredOrders() {
    try {
        await prisma.$transaction(async (tx) => {
            const expiredOrders = await tx.order.findMany({
                where: {
                    status: 'PendingPayment',
                    Payment: {
                        expiredDate: {
                            lt: new Date()
                        }
                    }
                },
                include: {
                    orderItems: true
                }
            })
    
            //map orderIds for updating status to cancelled
            const orderIds = expiredOrders.map((order) => order.id)
    
            //loop every order's orderItems to restore quantity of stock
            for(const order of expiredOrders) {
                for(const item of order.orderItems) {
                    await tx.stock.updateMany({
                        where: {
                            productId: item.productId,
                            storeId: order.storeId
                        },
                        data: {
                            quantity: {
                                increment: item.quantity
                            }
                        }
                    })
                }
    
            }
    
            //update expiredOrder status to cancelled
            await tx.order.updateMany({
                where: {
                    id: { in: orderIds}
                },
                data: {
                    status: 'Cancelled'
                }
            })

            console.log(`cron: update expired order : ${expiredOrders.length} order`);
            
        })
    } catch (error) {
        console.log(`cron: Error updating expired orders ${error}`);
    } finally {
        await prisma.$disconnect()
    }
    
}
async function completeShippedOrders() {
    try {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const completedOrders = await prisma.order.updateMany({
            where: {
                status: 'Shipped',
                shippedAt: { lt: sevenDaysAgo }
            },
            data: { status: 'Completed' }
        })

        console.log(`cron: update completed order: ${completedOrders.count} order`);
        
    } catch (error) {
        console.log(`cron: Error when updating completed order. Error: ${error}`);
    } finally {
        await prisma.$disconnect()
    }
}
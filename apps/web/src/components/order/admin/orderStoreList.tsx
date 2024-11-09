'use client'
import { getStoreOrders} from '@/lib/order.handler'
import { acceptPaymentOrder, canceledOrder, denyPaymentOrder, shippedOrder} from '@/lib/admin.handler'
import { useAppSelector } from '@/redux/hook'
import { IOrder } from '@/type/order'
import React, { useMemo, useEffect, useState } from 'react'
import OrderTable from '../orderTable'
import { Pagination } from '@nextui-org/react'

export default function AdminOrderList({}) {
    const user = useAppSelector((state) => state.user)
    const [data, setData] = useState<IOrder[]>([])
    const [statusFilter, setStatusFilter] = useState<IOrder['status'][]>([])
    const [paymentFilter, setPaymentFilter] = useState<IOrder['Payment']['paymentMethod'] | null>()
    const [dateFilter, setDateFilter] = useState<{min: Date | null, max: Date | null}>({min: null, max: null})
    const [page, setPage] = useState<number>(1)
    const [pages, setPages] = useState<number>(1)
    
    const filterOrder = useMemo(() => {
        let filteredData = data
        if(!!statusFilter.length) {
            filteredData = filteredData.filter((order) => statusFilter.includes(order.status))
        }
        if(paymentFilter) {
            filteredData = filteredData.filter((order) => order.Payment.paymentMethod === paymentFilter)
        }
        if(dateFilter.min !== null) {
            filteredData = filteredData.filter((order) => (new Date(order.createdAt).getTime() > dateFilter.min?.getTime()!))
        }
        if(dateFilter.max !== null) {
            filteredData = filteredData.filter((order) => (new Date(order.createdAt).getTime() < dateFilter.max?.getTime()!))
        }

        setPages(Math.ceil(filteredData.length/10))
        return filteredData

    }, [data, statusFilter])
    
    const onDenyPayment = async (orderId: number) => {
        const { status } = await denyPaymentOrder(orderId)
        if(status === 'ok') {
            const orderIndex = data.findIndex((item) => item.id === orderId)
            data[orderIndex].status = 'PendingPayment'
            setData([...data])  
        }
    }

    const onAcceptPayment = async (orderId: number) => {
        const { status } = await acceptPaymentOrder(orderId)
        if(status === 'ok') {
            const updatedOrderIndex = data.findIndex((item) => item.id === orderId)
            data[updatedOrderIndex].status = 'Proccessed'
            data[updatedOrderIndex].Payment.confirmedAt = (new Date(Date.now())).toLocaleString()
            data[updatedOrderIndex].Payment.isConfirmed = true
            setData([...data])
        }
    }
    const onCancelOrder = async (orderId: number) => {
        const { status } = await canceledOrder(orderId)
        if(status === 'ok') {
            const updatedOrderIndex = data.findIndex((item) => item.id === orderId)
            const tempData = data
            tempData[updatedOrderIndex].status = 'Cancelled'
            setData([...tempData])
        } 
    }
    const onShipOrder = async (orderId: number) => {
        const { status } = await shippedOrder(orderId)
        if(status === 'ok') {
            const updatedOrderIndex = data.findIndex((item) => item.id === orderId)
            const tempData = data
            tempData[updatedOrderIndex].status = 'Shipped'
            setData([...tempData])
        } 
    }

    useEffect(() => {
        const getData = async () => {
            const res = await getStoreOrders(5)
            const order = res.order || []
            
            if(order.length !== 0) {
                setData([...order])                
            }
        }

        getData()
    }, [])
    return (
        <div className='md:col-start-2 overflow-auto p-4 flex flex-col gap-2'>
            <div className='w-full'>
                <OrderTable data={filterOrder.slice(10*(page - 1), page*10)} admin onAccept={onAcceptPayment} onCancel={onCancelOrder} onDeny={onDenyPayment} onShip={onShipOrder}/>
            </div>
            <div className='flex justify-end'>
                <Pagination showControls total={pages} initialPage={page} page={page} onChange={setPage}/>
            </div>
        </div>
    )
}

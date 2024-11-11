'use client'
import { getStoreOrders} from '@/lib/order.handler'
import { acceptPaymentOrder, canceledOrder, denyPaymentOrder, shippedOrder} from '@/lib/admin.handler'
import { useAppSelector } from '@/redux/hook'
import { IOrder } from '@/type/order'
import React, { useMemo, useEffect, useState } from 'react'
import OrderTable from '../orderTable'
import { DatePicker, DateRangePicker, Pagination } from '@nextui-org/react'
import SelectStatusFilter from '../filter/selectStatusFilter'
import DateFilter from '../filter/dateFilter'
import OrderNameFilter from '../filter/orderNameFilter'
import { toast, ToastContainer } from 'react-toastify'

export default function AdminOrderList({}) {
    const user = useAppSelector((state) => state.user)
    const [data, setData] = useState<IOrder[]>([])
    const [statusFilter, setStatusFilter] = useState<IOrder['status'] | ''>('')
    const [orderNameFilter, setOrderNameFilter] = useState('')
    const [dateMinFilter, setDateMinFilter] = useState<number|null>(null)
    const [page, setPage] = useState<number>(1)
    const [pages, setPages] = useState<number>(1)
    
    const filterOrder = useMemo(() => {
        let filteredData = data
        if(statusFilter) {
            filteredData = filteredData.filter((order) => order.status === statusFilter)
        }
        
        if(!!orderNameFilter) {
            filteredData = filteredData.filter((order) => String(order.id) === orderNameFilter) 
        }
        if(!!dateMinFilter) {
            filteredData = filteredData.filter((order) => (new Date(order.createdAt).getTime() > dateMinFilter && (new Date(order.createdAt).getTime() <= dateMinFilter+ (60*60*24*1000) )))
        }

        setPages(Math.ceil(filteredData.length/10))
        return filteredData

    }, [data, statusFilter, dateMinFilter, orderNameFilter])
    
    const onDenyPayment = async (orderId: number) => {
        const { status } = await denyPaymentOrder(orderId)
        if(status === 'ok') {
            const orderIndex = data.findIndex((item) => item.id === orderId)
            data[orderIndex].status = 'PendingPayment'
            setData([...data])  
        } else {
            toast.error('something is Wrong, please contact technical services')
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
        } else {
            toast.error('something is Wrong, please contact technical services')
        }
    }
    const onCancelOrder = async (orderId: number) => {
        const { status } = await canceledOrder(orderId)
        if(status === 'ok') {
            const updatedOrderIndex = data.findIndex((item) => item.id === orderId)
            const tempData = data
            tempData[updatedOrderIndex].status = 'Cancelled'
            setData([...tempData])
        } else {
            toast.error('something is Wrong, please contact technical services')
        }
    }
    const onShipOrder = async (orderId: number) => {
        const { status } = await shippedOrder(orderId)
        if(status === 'ok') {
            const updatedOrderIndex = data.findIndex((item) => item.id === orderId)
            const tempData = data
            tempData[updatedOrderIndex].status = 'Shipped'
            setData([...tempData])
        } else {
            toast.error('something is Wrong, please contact technical services')
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
            <div className='flex flex-col md:flex-row gap-2 w-full flex-wrap'>
                <div className='flex gap-2 w-full'>
                    <OrderNameFilter orderNameFilter={orderNameFilter} setOrderNameFilter={setOrderNameFilter}/>
                    <SelectStatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter}/>
                </div>
                <DateFilter setDateFilter={setDateMinFilter} />
            </div>
            <div className='w-full'>
                <OrderTable data={filterOrder.slice(10*(page - 1), page*10)} admin onAccept={onAcceptPayment} onCancel={onCancelOrder} onDeny={onDenyPayment} onShip={onShipOrder}/>
            </div>
            <div className='flex justify-end'>
                <Pagination showControls total={pages} initialPage={page} page={page} onChange={setPage}/>
            </div>
            <ToastContainer position='top-center' />
        </div>
    )
}

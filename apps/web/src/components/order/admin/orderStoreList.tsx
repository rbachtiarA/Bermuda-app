'use client'
import { getStoreOrders} from '@/lib/store.handler'
import { acceptPaymentOrder, canceledOrder, denyPaymentOrder, shippedOrder} from '@/lib/admin.handler'
import { useAppSelector } from '@/redux/hook'
import { IOrder } from '@/type/order'
import React, { useMemo, useEffect, useState } from 'react'
import OrderTable from '../orderTable'
import { Pagination } from '@nextui-org/react'
import SelectStatusFilter from '../filter/selectStatusFilter'
import DateFilter from '../filter/dateFilter'
import OrderNameFilter from '../filter/orderNameFilter'
import { toast } from 'react-toastify'
import StoreFilter from '../filter/storeFilter'

export default function AdminOrderList({}) {
    const user = useAppSelector((state) => state.user)
    const [data, setData] = useState<IOrder[]>([])
    const [statusFilter, setStatusFilter] = useState<IOrder['status'] | ''>('')
    const [orderNameFilter, setOrderNameFilter] = useState('')
    const [selectedStoreId, setSelectedStoreId] = useState('')
    const [dateMinFilter, setDateMinFilter] = useState<number|null>(null)
    const [page, setPage] = useState<number>(1)
    const [pages, setPages] = useState<number>(1)
    const [isLoading, setIsLoading] = useState(false)
    
    const filterOrder = useMemo(() => {
        let filteredData = data
        if(!!selectedStoreId) {
            filteredData = filteredData.filter((order) => order.storeId === Number(selectedStoreId))
        }
        if(statusFilter) {
            filteredData = filteredData.filter((order) => order.status === statusFilter)
        }
        
        if(!!orderNameFilter) {
            filteredData = filteredData.filter((order) => String(order.id) === orderNameFilter) 
        }
        if(!!dateMinFilter) {
            const timeZoneOffsetMilliSeconds = new Date().getTimezoneOffset() * 60 * 1000
            const oneDayInMilliseconds = 24*60*60*1000
            filteredData = filteredData.filter((order) => (
                (new Date(order.createdAt).getTime() - timeZoneOffsetMilliSeconds ) > dateMinFilter && 
                (new Date(order.createdAt).getTime() - timeZoneOffsetMilliSeconds <= dateMinFilter + oneDayInMilliseconds )))
        }

        setPages(Math.ceil(filteredData.length/10))
        return filteredData

    }, [data, statusFilter, dateMinFilter, orderNameFilter, selectedStoreId])
    
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
            setIsLoading(true)
            const res = await getStoreOrders()
            const order = res.order || []
            
            if(order.length !== 0) {
                setData([...order])                
            }
            setIsLoading(false)
        }

        getData()
    }, [])
    return (
        <div className='md:col-start-2 overflow-auto py-4 flex flex-col gap-2 p-4'>
            <div className='flex flex-col md:flex-row gap-2 w-full flex-wrap'>
                {
                    user.role === 'SUPER_ADMIN' &&
                    <StoreFilter selectedStoreId={selectedStoreId} setSelectedStoreId={setSelectedStoreId}/>
                }
                <div className='flex gap-2 w-full'>
                    <OrderNameFilter orderNameFilter={orderNameFilter} setOrderNameFilter={setOrderNameFilter}/>
                    <SelectStatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter}/>
                </div>
                <DateFilter setDateFilter={setDateMinFilter} />
            </div>
            <div className='w-full'>
                <OrderTable isLoading={isLoading} data={filterOrder.slice(10*(page - 1), page*10)} admin onAccept={onAcceptPayment} onCancel={onCancelOrder} onDeny={onDenyPayment} onShip={onShipOrder}/>
            </div>
            <div className='flex justify-end'>
                <Pagination showControls total={pages} initialPage={page} page={page} onChange={setPage}/>
            </div>
        </div>
    )
}

'use client'
import { completeOrder, getUserOrders } from '@/lib/order.handler'
import { useAppSelector } from '@/redux/hook'
import { IOrder } from '@/type/order'
import React, { useEffect, useMemo, useState } from 'react'
import OrderTable from '../orderTable'
import { Pagination } from '@nextui-org/react'
import OrderNameFilter from '../filter/orderNameFilter'
import DateFilter from '../filter/dateFilter'

export default function OrderList({}) {
    const [data, setData] = useState<IOrder[]>([])
    const [page, setPage] = useState<number>(1)
    const [pages, setPages] = useState<number>(1)
    const [dateMinFilter, setDateMinFilter] = useState<number|null>(null)
    const [orderNameFilter, setOrderNameFilter] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const filterOrder = useMemo(() => {
        let filteredData = data
        
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

    }, [data, dateMinFilter, orderNameFilter])

    const onReceive = async (orderId: number) => {
        const { status } = await completeOrder(orderId)
        if(status === 'ok') {
            const orderIndex = data.findIndex((item) => item.id === orderId)
            data[orderIndex].status = 'Completed'
            setData([...data])  
        }
    }

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)
            const res = await getUserOrders()
            const order = res.order
            
            if(order.length !== 0) {
                setData([...order])
            }
            setIsLoading(false)
        }

        getData()
    }, [])
    return (
        <div className='md:col-start-2 overflow-auto p-4 flex flex-col gap-2'>
            <div className='flex gap-2 w-full'>
                    <OrderNameFilter orderNameFilter={orderNameFilter} setOrderNameFilter={setOrderNameFilter}/>
                    <DateFilter setDateFilter={setDateMinFilter} />
                </div>
            <div className='w-full'>
                <OrderTable isLoading={isLoading} data={filterOrder.slice(10*(page - 1), page*10)} onReceive={onReceive}/>
            </div>
            <div className='flex justify-end'>
                <Pagination size='sm' showControls total={pages} initialPage={page} page={page} onChange={setPage}/>
            </div>
        </div>
    )
}

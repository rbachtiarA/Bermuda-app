'use client'
import { completeOrder, getUserOrders } from '@/lib/order.handler'
import { useAppSelector } from '@/redux/hook'
import { IOrder } from '@/type/order'
import React, { useEffect, useState } from 'react'
import OrderTable from '../orderTable'
import { Pagination } from '@nextui-org/react'

export default function OrderList({}) {
    const [data, setData] = useState<IOrder[]>([])
    const [filterData, setFilterData] = useState<IOrder[]>([])
    const [page, setPage] = useState<number>(1)
    const [pages, setPages] = useState<number>(1)
    const getData = async () => {
        const res = await getUserOrders()
        const order = res.order
        setData([...order])
        setPages(Math.ceil(order.length/10))
    }

    const onReceive = async (orderId: number) => {
        const { status } = await completeOrder(orderId)
        if(status === 'ok') {
            const orderIndex = data.findIndex((item) => item.id === orderId)
            data[orderIndex].status = 'Completed'
            setData([...data])  
        }
    }

    useEffect(() => {
        getData()
    }, [])
    return (
        <div className='md:col-start-2 overflow-auto p-4 flex flex-col gap-2'>
            <div className='w-full'>
                <OrderTable data={data.slice(10*(page - 1), page*10)} onReceive={onReceive}/>
            </div>
            <div className='flex justify-end'>
                <Pagination size='sm' showControls total={pages} initialPage={page} page={page} onChange={setPage}/>
            </div>
        </div>
    )
}

'use client'
import { getUserOrders } from '@/lib/order'
import { useAppSelector } from '@/redux/hook'
import { IOrder } from '@/type/order'
import React, { useEffect, useState } from 'react'
import OrderTable from './orderTable'
import { Pagination } from '@nextui-org/react'

export default function OrderList({}) {
    const user = useAppSelector((state) => state.user)
    const [data, setData] = useState<IOrder[]>([])
    const [filterData, setFilterData] = useState<IOrder[]>([])
    const [page, setPage] = useState<number>(1)
    const [pages, setPages] = useState<number>(1)
    const getData = async () => {
        const res = await getUserOrders(user.id)
        const order = res.order
        setData([...order])
        setPages(Math.ceil(order.length/10))
    }

    useEffect(() => {
        getData()
    }, [])
    return (
        <div className='md:col-start-2'>
            <OrderTable data={data.slice(10*(page - 1), page*10)} />
            <div className=''>
                <Pagination showControls total={pages} initialPage={page} page={page} onChange={setPage}/>
            </div>
        </div>
    )
}

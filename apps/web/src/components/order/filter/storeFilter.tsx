'use client'
import { getStoresList } from "@/lib/store.handler";
import { IOrder } from "@/type/order";
import { IStore } from "@/type/store";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

export default function StoreFilter({selectedStoreId, setSelectedStoreId }: { selectedStoreId: string,setSelectedStoreId: React.Dispatch<string> }) {
    const [stores, setStores] = useState<IStore[]>([])
    useEffect(() => {
        const getData = async () => {
            const { status, msg } = await getStoresList()
            if(status === 'ok') setStores([...msg])
        }
        getData()
    }, [])

    const STORES_LIST = useMemo(() => {
        return stores.map((store) => {
            return { key: `${store.id}`, label: `${store.name}` }
        })
    },[stores])

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStoreId(e.target.value)
    }
    return (
        <div className="w-full">
            <Select 
                label='Store Order'
                placeholder='Filter order based on store'
                // selectionMode="multiple"
                selectedKeys={[selectedStoreId]}
                onChange={onChange}
            >
                {STORES_LIST.map((store) => (
                    <SelectItem key={store.key}>
                        {store.label}
                    </SelectItem>
                ))}
            </Select>
        </div>
  )
}

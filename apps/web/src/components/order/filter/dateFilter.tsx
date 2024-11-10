import { DatePicker, DateRangePicker, DateValue } from '@nextui-org/react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

export default function DateFilter({setDateFilter}: {setDateFilter: Dispatch<SetStateAction<number|null>>}) {
    const [value, setValue] = useState<DateValue | null>(null)
    useEffect(() => {
        setDateFilter(new Date(value?.toString()!).getTime())        
    }, [value])
  return (
    <div className='w-full'>
        <DatePicker label='Filter order based on date' value={value} onChange={setValue}/>
    </div>
  )
}

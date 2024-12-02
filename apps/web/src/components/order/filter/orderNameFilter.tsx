import { Input } from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";

export default function OrderNameFilter({orderNameFilter, setOrderNameFilter}: {orderNameFilter:string, setOrderNameFilter: Dispatch<SetStateAction<string>>}) {
    return (
    <div className="w-full">
        <Input 
            label='Order No'
            placeholder="Search Order by Order Id"
            value={orderNameFilter}
            onValueChange={setOrderNameFilter}
        />
    </div>
  )
}

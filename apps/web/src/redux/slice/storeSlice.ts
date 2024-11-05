import { ICartItem, IUpdateQuantityCart } from "@/type/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { id: number } = {
    id: 1
}

export const storeSlice = createSlice({
    name: "store",
    initialState,
    reducers:{},

})

export const {} = storeSlice.actions
export default storeSlice.reducer
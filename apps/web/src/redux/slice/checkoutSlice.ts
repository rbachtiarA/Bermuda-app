import { ICartItem, IUpdateQuantityCart } from "@/type/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: number[] = []

export const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers:{
        addSelectedCheckout: (state, action:PayloadAction<number>) => {
            const id = action.payload
            if(state.includes(id)) {
                return [...state, id]
            } 
        },
        removeSelectedCheckout: (state, action:PayloadAction<number>) => {
            const removedId = action.payload
            return [...state.filter((id) => id !== removedId)]
        },
        resetCheckout: (state) => []
    },

})

export const {} = checkoutSlice.actions
export default checkoutSlice.reducer
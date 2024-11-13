import { ICartItem, IUpdateQuantityCart } from "@/type/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: number[] = []

export const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers:{
        addSelectedCheckout: (state, action:PayloadAction<number>) => {
            const id = action.payload
            if(!state.includes(id)) {
                return [...state, id]
            } 
        },
        selectedAllItems: (state, action:PayloadAction<number[]>) => {
            return [...action.payload]
        },
        removeSelectedCheckout: (state, action:PayloadAction<number>) => {
            const removedId = action.payload
            return [...state.filter((id) => id !== removedId)]
        },
        resetCheckout: (state) => {
            return []
        }
    },

})

export const { addSelectedCheckout, removeSelectedCheckout, selectedAllItems, resetCheckout} = checkoutSlice.actions
export default checkoutSlice.reducer
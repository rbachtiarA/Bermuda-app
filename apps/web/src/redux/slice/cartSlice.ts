import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface ICartItem {
    id: number
    productId: number
    quantity: number
    totalPrice: number
}

const initialState: ICartItem[] = []

export const cartSlice = createSlice({
    name: "ItemCart",
    initialState,
    reducers:{
        addedToCart: (state, action: PayloadAction<ICartItem>) => {
            const { productId, quantity, totalPrice } = action.payload
            const isItemExist = state.findIndex((item) => item.productId === productId)
            if(isItemExist !== -1) {
                state[isItemExist].quantity += quantity
                return state
            } else {
                return [...state, {id: 1, productId, quantity, totalPrice}]
            }
        },
        
        resetCart: () => {
            return []
        }, 
    },

})

export const {addedToCart, resetCart} = cartSlice.actions
export default cartSlice.reducer
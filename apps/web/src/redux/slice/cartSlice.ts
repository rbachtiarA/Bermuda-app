import { ICartItem, IUpdateQuantityCart } from "@/type/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ICartItem[] = []

export const cartSlice = createSlice({
    name: "ItemCart",
    initialState,
    reducers:{
        updatedCartFromDatabase: (state, action: PayloadAction<ICartItem[]>) => {
            const cartItems = action.payload
            console.log(cartItems);
            
            return [...cartItems]
        },
        addedToCart: (state, action: PayloadAction<ICartItem>) => {
            const { id, cartId, productId, quantity, totalPrice } = action.payload
            const isItemExist = state.findIndex((item) => item.productId === productId)
            console.log(isItemExist)
            
            if(isItemExist !== -1) {
                state[isItemExist].quantity += quantity
                return state
            } else {
                return [...state, {id, cartId, productId, quantity, totalPrice}]
            }
        },
        updatedCartQuantity: (state, action: PayloadAction<IUpdateQuantityCart>) => {
            const { productId, quantity } = action.payload
            const isItemExist = state.findIndex((item) => item.productId === productId)
            if(isItemExist !== -1) {
                state[isItemExist].quantity = quantity
                return state
            }
        },
        removedFromCart: (state, action: PayloadAction<ICartItem>) => {
            const { productId } = action.payload
            return [...state.filter((cartItem) => cartItem.productId !== productId)]
        },
        resetCart: () => {
            return []
        }, 
    },

})

export const {updatedCartFromDatabase,updatedCartQuantity, addedToCart, removedFromCart, resetCart} = cartSlice.actions
export default cartSlice.reducer
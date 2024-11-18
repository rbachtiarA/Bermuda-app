import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { id: number, name: string } = {
    id: 1,
    name: 'Bermuda Store'
}

export const storeSlice = createSlice({
    name: "store",
    initialState,
    reducers:{
        updateStore: (state, action:PayloadAction<{id: number, name: string}>) => {
            const { id, name } = action.payload
            const newState = {id, name}
            return newState
        }
    }

})

export const {updateStore} = storeSlice.actions
export default storeSlice.reducer
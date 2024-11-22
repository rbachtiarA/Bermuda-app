import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { id: number, name: string, inRange: boolean} = {
    id: 0,
    name: '',
    inRange: false 
}

export const storeSlice = createSlice({
    name: "store",
    initialState,
    reducers:{
        updateStore: (state, action:PayloadAction<{id: number, name: string, distance: number}>) => {
            const { id, name, distance } = action.payload
            const newState = {...state, id, name, inRange: distance <= 50}
            return newState
        }
    }

})

export const {updateStore} = storeSlice.actions
export default storeSlice.reducer
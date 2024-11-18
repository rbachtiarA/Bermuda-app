import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { id: number } = {
    id: 1
}

export const storeSlice = createSlice({
    name: "store",
    initialState,
    reducers:{
        updateStore: (state, action:PayloadAction<number>) => {
            return  {id: action.payload}
        }
    },

})

export const {} = storeSlice.actions
export default storeSlice.reducer
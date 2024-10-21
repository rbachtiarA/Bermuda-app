import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface IUserDemo {
    name: string
}

const initialState: IUserDemo = {
    name: 'dummy'
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        changeName: (state) => {
            state.name = "dummyChange"
        },
        resetName: (state) => {
            state.name = "dummy"
        } 
    }
})

export const {changeName, resetName} = userSlice.actions
export default userSlice.reducer
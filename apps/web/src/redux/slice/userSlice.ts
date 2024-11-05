import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface IUserDemo {
    id: number
    name: string
}

const initialState: IUserDemo = {
    id: 3,
    name: 'adam'
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
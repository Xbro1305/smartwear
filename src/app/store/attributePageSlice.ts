import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AttributePageState {
  value: string
}

const initialState: AttributePageState = {
  value: 'Вид изделия',
}

export const attributePageSlice = createSlice({
  name: 'attributePage',
  initialState,
  reducers: {
    setAttributePage: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
    clearAttributePage: state => {
      state.value = ''
    },
  },
})

export const { setAttributePage, clearAttributePage } = attributePageSlice.actions
export default attributePageSlice.reducer

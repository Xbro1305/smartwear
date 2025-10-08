import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AttributePageState {
  value: string
  isSystem: boolean
  id: number
}

const initialState: AttributePageState = {
  value: 'Вид изделия',
  isSystem: true,
  id: 1,
}

export const attributePageSlice = createSlice({
  name: 'attributePage',
  initialState,
  reducers: {
    setAttributePage: (state, action: PayloadAction<AttributePageState>) => {
      state.value = action.payload.value
      state.isSystem = action.payload.isSystem
      state.id = action.payload.id
    },
    clearAttributePage: state => {
      state.value = ''
      state.isSystem = false
      state.id = 0
    },
  },
})

export const { setAttributePage, clearAttributePage } = attributePageSlice.actions
export default attributePageSlice.reducer

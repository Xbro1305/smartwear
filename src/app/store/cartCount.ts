import { createSlice } from '@reduxjs/toolkit'

const getInitialCart = () => {
  const count = localStorage.getItem('cartCount')
  return count ? Number(count) : 0
}

const cartCountSlice = createSlice({
  name: 'cartCount',
  initialState: getInitialCart(),
  reducers: {
    setCartCount: (state, action) => {
      if (action.payload > 2) {
        return state // важно вернуть текущий state
      }

      localStorage.setItem('cartCount', action.payload)
      return action.payload // ✅ правильно обновляем state
    },
  },
})

export const { setCartCount } = cartCountSlice.actions
export default cartCountSlice.reducer

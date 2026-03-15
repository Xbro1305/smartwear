import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const getInitialCart = () => {
  const stored = localStorage.getItem('cart')
  return stored ? JSON.parse(stored) : []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getInitialCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItemIndex = state.items.findIndex(
        (item: any) =>
          item.id === action.payload.id &&
          item.size.name === action.payload.size.name &&
          item.color.alias === action.payload.color.alias
      )

      if (state.items.length >= 2 && existingItemIndex === -1) {
        toast.error('В корзине уже есть 2 товара. Удалите что-то, чтобы добавить новый товар.')
        return
      }

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += 1
      } else {
        state.items.push(action.payload)
      }

      localStorage.setItem('cart', JSON.stringify(state.items))
    },

    removeFromCart: (state, action) => {
      state.items.splice(action.payload, 1)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },

    setCart: (state, action) => {
      state.items = action.payload
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
  },
})

export const { addToCart, removeFromCart, setCart } = cartSlice.actions
export default cartSlice.reducer

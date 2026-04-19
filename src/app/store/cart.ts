import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

type CartItem = {
  id: number
  size: { name: string }
  color: { alias: string }
}

const getInitialCart = (): CartItem[] => {
  const stored = localStorage.getItem('cart')
  return stored ? JSON.parse(stored) : []
}

const saveCart = (items: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(items))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getInitialCart(),
  },
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const exists = state.items.find(
        item =>
          item.id === action.payload.id &&
          item.size.name === action.payload.size.name &&
          item.color.alias === action.payload.color.alias
      )

      if (state.items.length >= 2 && !exists) {
        toast.error('В корзине уже есть 2 товара. Удалите что-то, чтобы добавить новый товар.')
        return
      }

      if (exists) {
        toast.info('Этот товар уже в корзине')
        return
      }

      state.items.push(action.payload)
      saveCart(state.items)
      toast.success('Товар добавлен в корзину')
    },

    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      state.items = state.items.filter(
        item =>
          !(
            item.id === action.payload.id &&
            item.size.name === action.payload.size.name &&
            item.color.alias === action.payload.color.alias
          )
      )

      saveCart(state.items)
    },

    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
      saveCart(state.items)
    },

    clearCart: state => {
      state.items = []
      saveCart([])
    },
  },
})

export const { addToCart, removeFromCart, setCart, clearCart } = cartSlice.actions
export default cartSlice.reducer

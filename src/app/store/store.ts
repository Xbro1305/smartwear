import { baseApi } from '@/shared/api'
import { combineSlices, configureStore } from '@reduxjs/toolkit'
import attributePageReducer from './attributePageSlice'
import cartReducer from './cart'
import cartCountReducer from './cartCount'

const rootReducer = combineSlices(baseApi, {
  attributePage: attributePageReducer,
  cart: cartReducer,
  cartCount: cartCountReducer,
})

export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
  reducer: rootReducer,
})

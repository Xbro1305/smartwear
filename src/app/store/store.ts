import { baseApi } from '@/shared/api'
import { combineSlices, configureStore } from '@reduxjs/toolkit'
import attributePageReducer from './attributePageSlice'

const rootReducer = combineSlices(baseApi, {
  attributePage: attributePageReducer,
})

export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
  reducer: rootReducer,
})

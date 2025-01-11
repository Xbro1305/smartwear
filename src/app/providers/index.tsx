import { Provider } from 'react-redux'

import { ThemeProvider } from '@/app/providers/theme'

import { store } from '../store'
import { Router } from './router'

export const Providers = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </Provider>
  )
}

import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import './global.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'

import { Providers } from './providers'
import { SnackbarProvider } from 'notistack'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider>
      <Providers />
    </SnackbarProvider>
  </StrictMode>
)

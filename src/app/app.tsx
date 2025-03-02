import { Fragment } from 'react'

import { createRoot } from 'react-dom/client'

import './global.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ToastContainer } from 'react-toastify'

import { Providers } from './providers'
import { SnackbarProvider } from 'notistack'

createRoot(document.getElementById('root')!).render(
  <Fragment>
    <SnackbarProvider>
      <Providers />
      <ToastContainer />
    </SnackbarProvider>
  </Fragment>
)

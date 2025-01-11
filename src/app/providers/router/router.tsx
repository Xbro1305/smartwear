import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { AdminLayout } from '@/app/layouts/admin-layout'

import { RootLayout } from '../../layouts/root-layout'
import { adminRoutes } from './admin-routes'
import { privateRoutes } from './private-routes'
import { publicRoutes } from './public-routes'
``
const router = createBrowserRouter([
  {
    children: [...publicRoutes, ...privateRoutes],
    element: <RootLayout />,
  },
  {
    children: [...adminRoutes],
    element: <AdminLayout />,
  },
])

export const Router = () => {
  return <RouterProvider router={router} />
}

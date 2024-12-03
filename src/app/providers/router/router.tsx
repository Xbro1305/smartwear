import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '../../layouts/root-layout'
import { privateRoutes } from './private-routes'
import { publicRoutes } from './public-routes'
import { adminRoutes } from './admin-routes'
import { AdminLayout } from '@/app/layouts/admin-layout'

const router = createBrowserRouter([
  {
    children: [...publicRoutes, ...privateRoutes],
    element: <RootLayout />,
  },
  {
    children: [...adminRoutes, ...privateRoutes],
    element: <AdminLayout />,
  },
])

export const Router = () => {
  return <RouterProvider router={router} />
}

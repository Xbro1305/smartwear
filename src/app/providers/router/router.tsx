import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { AdminLayout } from '@/app/layouts/admin-layout'
import { ROUTER_PATHS } from '@/shared/config/routes'

import { RootLayout } from '../../layouts/root-layout'
import { adminRoutes } from './admin-routes'
import { privateRoutes } from './private-routes'
import { publicRoutes } from './public-routes'
const { ADMINLOGIN } = ROUTER_PATHS

;``
const router = createBrowserRouter([
  {
    children: [...publicRoutes, ...privateRoutes],
    element: <RootLayout />,
  },
  {
    children: adminRoutes.filter(route => route.path === ADMINLOGIN),
    element: <RootLayout />,
  },
  {
    children: adminRoutes.filter(route => route.path !== ADMINLOGIN),
    element: <AdminLayout />,
  },
])

export const Router = () => {
  return <RouterProvider router={router} />
}

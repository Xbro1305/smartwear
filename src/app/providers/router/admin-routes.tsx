import type { RouteObject } from 'react-router-dom'

import { HomePage } from '@/pages/home'
import { AdminLogin } from '@/pages/admin/login'

import { ROUTER_PATHS } from '@/shared/config/routes'

import { AuthGuard } from './auth-guard'

const { ADMINLOGIN } = ROUTER_PATHS

export const adminRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <AdminLogin />,
        path: ADMINLOGIN,
      },
    ],
    element: <AuthGuard />,
  },
]

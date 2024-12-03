import type { RouteObject } from 'react-router-dom'

import { ROUTER_PATHS } from '@/shared/config/routes'
import { AdminLogin } from '@/pages/admin/login'

const { adminLogin } = ROUTER_PATHS

export const adminRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <AdminLogin />,
        path: adminLogin,
      },
    ],
  },
]

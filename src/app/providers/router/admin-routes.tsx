import type { RouteObject } from 'react-router-dom'

import { AdminLogin } from '@/pages/admin/login'
import { RestorePass } from '@/pages/admin/setpass/ui/Restore'
import { MainPage } from '@/pages/main'
import { ROUTER_PATHS } from '@/shared/config/routes'

import { AuthGuard } from './auth-guard'

const { ADMINLOGIN, MAIN, RESTOREPASS } = ROUTER_PATHS

export const adminRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <AdminLogin />,
        path: ADMINLOGIN,
      },
      {
        element: <MainPage />,
        path: MAIN,
      },
      {
        element: <RestorePass />,
        path: RESTOREPASS,
      },
    ],
    element: <AuthGuard />,
  },
]

import type { RouteObject } from 'react-router-dom'

import { MainPage } from '@/pages/admin/home'
import { AdminLogin } from '@/pages/admin/login'
import { RestorePass } from '@/pages/admin/setpass/ui/Restore'
import { ROUTER_PATHS } from '@/shared/config/routes'

//import { AdminGuard } from './admin-guard'

const { ADMIN, ADMINLOGIN, RESTOREPASS } = ROUTER_PATHS

export const adminRoutes: RouteObject[] = [
  {
    element: <AdminLogin />,
    path: ADMINLOGIN,
  },
  {
    children: [
      {
        element: <MainPage />,
        path: ADMIN,
      },
      {
        element: <RestorePass />,
        path: RESTOREPASS,
      },
    ],
    //element: <AdminGuard />,
  },
]

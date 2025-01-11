import type { RouteObject } from 'react-router-dom'

import { ProfilePage } from '@/pages/profile'
import { ROUTER_PATHS } from '@/shared/config/routes'

import { AuthGuard } from './auth-guard'

const { PROFILE } = ROUTER_PATHS

export const privateRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <ProfilePage />,
        path: PROFILE,
      },
    ],
    element: <AuthGuard />,
  },
]

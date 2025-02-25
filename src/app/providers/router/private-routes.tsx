import type { RouteObject } from 'react-router-dom'

import { ProfilePage } from '@/pages/profile'
import { ROUTER_PATHS } from '@/shared/config/routes'

import { AuthGuard } from './auth-guard'
import { ConfirmEmail } from '@/pages/sign-in/ui/ConfirmEmail'

const { PROFILE } = ROUTER_PATHS

export const privateRoutes: RouteObject[] = [
  {
    children: [
      { element: <ProfilePage />, path: PROFILE },
      { element: <ConfirmEmail />, path: '/confirm-email' },
    ],
    element: <AuthGuard />,
  },
]

import type { RouteObject } from 'react-router-dom'

import { ProfilePage } from '@/pages/profile'
import { ROUTER_PATHS } from '@/shared/config/routes'

import { AuthGuard } from './auth-guard'
import { ConfirmEmail } from '@/pages/sign-in/ui/ConfirmEmail'
import { Order } from '@/pages/order/order'

const { PROFILE, ORDER } = ROUTER_PATHS

export const privateRoutes: RouteObject[] = [
  {
    children: [
      { element: <ProfilePage />, path: PROFILE },
      { element: <ConfirmEmail />, path: '/confirm-email' },
      { element: <Order />, path: ORDER },
    ],
    element: <AuthGuard />,
  },
]

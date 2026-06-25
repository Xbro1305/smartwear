import type { RouteObject } from 'react-router-dom'

import { ProfilePage } from '@/pages/profile'
import { ROUTER_PATHS } from '@/shared/config/routes'

import { AuthGuard } from './auth-guard'
import { ConfirmEmail } from '@/pages/sign-in/ui/ConfirmEmail'
import { CreateOrder } from '@/pages/createOrder/createOrder'
import { NewOrderDetails } from '@/pages/newOrderDetails/newOrderDetails'
import { Order } from '@/pages/order/Order'

const { PROFILE, ORDER, ORDERPROFILE } = ROUTER_PATHS

export const privateRoutes: RouteObject[] = [
  {
    children: [
      { element: <ProfilePage />, path: PROFILE },
      { element: <ProfilePage />, path: `${PROFILE}/:endpointPage` },
      { element: <ConfirmEmail />, path: '/confirm-email' },
      { element: <CreateOrder />, path: ORDER },
      { element: <NewOrderDetails />, path: `${ORDER}/:id` },
      { element: <Order />, path: `${ORDERPROFILE}/:id` },
    ],
    element: <AuthGuard />,
  },
]

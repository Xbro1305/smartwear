import type { RouteObject } from 'react-router-dom'


import { HomePage } from '@/pages/home'

import { ROUTER_PATHS } from '@/shared/config/routes'

import { AuthGuard } from './auth-guard'

const {
  
  HOME,
 
} = ROUTER_PATHS

export const privateRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <HomePage />,
        path: HOME,
      },
      
    ],
    element: <AuthGuard />,
  },
]

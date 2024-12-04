import type { RouteObject } from 'react-router-dom';

import { HomePage } from '@/pages/home';
import { AdminLogin } from '@/pages/admin/login';
import { ProfilePage } from '@/pages/profile';


import { ROUTER_PATHS } from '@/shared/config/routes';

import { AuthGuard } from './auth-guard';

const { HOME, PROFILE, ADMINLOGIN} = ROUTER_PATHS;

export const privateRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <HomePage />,
        path: HOME,
      },
      {
        element: <ProfilePage />,
        path: PROFILE,
      },
      {
        element: <AdminLogin />,
        path: ADMINLOGIN,
      },
      ],
    element: <AuthGuard />,
  },
];

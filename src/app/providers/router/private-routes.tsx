import type { RouteObject } from 'react-router-dom';

import { HomePage } from '@/pages/home';
import { PoliticsPage } from '@/pages/politics';
import { OfertaPage } from '@/pages/oferta';
import { ProfilePage } from '@/pages/profile';

import { ROUTER_PATHS } from '@/shared/config/routes';

import { AuthGuard } from './auth-guard';

const { HOME, POLITICS, OFERTA, PROFILE } = ROUTER_PATHS;

export const privateRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <HomePage />,
        path: HOME,
      },
      {
        element: <PoliticsPage />, 
        path: POLITICS,
      },
      {
        element: <OfertaPage />, 
        path: OFERTA,
      },
      {
        element: <ProfilePage />,
        path: PROFILE,
      }
    ],
    element: <AuthGuard />,
  },
];

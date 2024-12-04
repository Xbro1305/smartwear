import type { RouteObject } from 'react-router-dom'

import { SignInPage } from '@/pages/sign-in'
import { PoliticsPage } from '@/pages/politics';
import { OfertaPage } from '@/pages/oferta';
import { CatalogPage } from '@/pages/catalog';
import { SignUpPage } from '@/pages/sign-up'
import { AboutPage } from '@/pages/about';
import { ContactPage } from '@/pages/contacts';
import { DeliveryPage } from '@/pages/delivery';
import { ROUTER_PATHS } from '@/shared/config/routes'

const { SIGN_IN, SIGN_UP, POLITICS, OFERTA, CATALOG, ABOUT, CONTACTS, DELIVERY } = ROUTER_PATHS

export const publicRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <SignInPage />,
        path: SIGN_IN,
      },
      {
        element: <SignUpPage />,
        path: SIGN_UP,
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
        element: <CatalogPage />,
        path: CATALOG,
      },
      {
        element: <AboutPage />,
        path: ABOUT,
      },
      {
        element: <ContactPage />,
        path: CONTACTS,
      },
      {
        element: <DeliveryPage />,
        path: DELIVERY,
      },
    ],
  },
]

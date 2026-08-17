import type { RouteObject } from 'react-router-dom'
import { Navigate, useParams } from 'react-router-dom'

import { AboutPage } from '@/pages/about'
import { Articles } from '@/pages/articles/ui/Articles'
import { CatalogPage } from '@/pages/catalog'
import { ContactPage } from '@/pages/contacts'
import { DeliveryPage } from '@/pages/delivery'
import { HomePage } from '@/pages/home'
import { OldHomePage } from '@/pages/old-home'
import { New } from '@/pages/new/'
import PvzMapWidget from '@/pages/pvz/PvzMapWidget'
import { SignInPage } from '@/pages/sign-in'
import { SignUpPage } from '@/pages/sign-up'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { CatalogResolver } from './CatalogResolver'
import { Cart } from '@/pages/cart/cart'

const { ABOUT, CATALOG, CONTACTS, DELIVERY, HOME, SIGN_IN } = ROUTER_PATHS
const { ARTICLES, NEWS, SIGN_UP, USER_ARTICLE, CART } = ROUTER_PATHS

// Статьи переехали в корень (/:keyword). Старый путь /article/:keyword редиректим на новый,
// чтобы сохранить внешние ссылки и закладки.
const ArticleRedirect = () => {
  const { keyword } = useParams<{ keyword: string }>()
  return <Navigate to={`/${keyword ?? ''}`} replace />
}

export const publicRoutes: RouteObject[] = [
  {
    children: [
      { element: <SignInPage />, path: SIGN_IN },
      { element: <PvzMapWidget onSelect={pvz => console.log(pvz)} />, path: '/pvz' },
      { element: <ArticleRedirect />, path: `${USER_ARTICLE}/:keyword` },
      { element: <Articles />, path: ARTICLES },
      { element: <New />, path: `${NEWS}/:name` },
      { element: <HomePage />, path: HOME },
      { element: <OldHomePage />, path: '/old-home' },
      { element: <SignUpPage />, path: SIGN_UP },
      // /privacy и /terms удалены как отдельные страницы — теперь резолвятся как статьи (Правки 3, п.1)
      { element: <CatalogPage />, path: CATALOG },
      { element: <AboutPage />, path: ABOUT },
      { element: <ContactPage />, path: CONTACTS },
      { element: <DeliveryPage />, path: DELIVERY },
      { element: <CatalogResolver />, path: `/*` },
      { element: <Cart />, path: CART },
    ],
  },
]

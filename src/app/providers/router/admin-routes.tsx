import type { RouteObject } from 'react-router-dom'

import { MainPage } from '@/pages/admin/home'
import { AdminLogin } from '@/pages/admin/login'
import { RestorePass } from '@/pages/admin/setpass/ui/Restore'
import { ROUTER_PATHS } from '@/shared/config/routes'

import { AdminGuard } from './admin-guard'
import { ArticlesList } from '@/pages/admin/articles'
import { CreateArticle } from '@/pages/admin/articles/Create/Create'

const { ADMIN, ADMINLOGIN, RESTOREPASS, ADMINARTICLES, CREATEARTICLE } = ROUTER_PATHS
const { EDITARTICLE } = ROUTER_PATHS

export const adminRoutes: RouteObject[] = [
  {
    element: <AdminLogin />,
    path: ADMINLOGIN,
  },
  {
    children: [
      { element: <MainPage />, path: ADMIN },
      { element: <RestorePass />, path: RESTOREPASS },
      { element: <ArticlesList />, path: ADMINARTICLES },
      { element: <CreateArticle />, path: CREATEARTICLE },
    ],
    element: <AdminGuard />,
  },
]

import type { RouteObject } from 'react-router-dom'

import { ArticlesList } from '@/pages/admin/articles'
import { CreateArticle } from '@/pages/admin/articles/Create/Create'
import { EditArticle } from '@/pages/admin/articles/Edit/Edit'
import { MainPage } from '@/pages/admin/home'
import { AdminLogin } from '@/pages/admin/login'
import { RestorePass } from '@/pages/admin/setpass/ui/Restore'
import { ROUTER_PATHS } from '@/shared/config/routes'

import { AdminGuard } from './admin-guard'

const { ADMIN, ADMINARTICLES, ADMINLOGIN, CREATEARTICLE, RESTOREPASS } = ROUTER_PATHS
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
      { element: <EditArticle />, path: `${EDITARTICLE}/:id` },
    ],
    element: <AdminGuard />,
  },
]

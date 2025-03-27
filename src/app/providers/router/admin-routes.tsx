import { Navigate, type RouteObject } from 'react-router-dom'

import { ArticlesList } from '@/pages/admin/articles'
import { CreateArticle } from '@/pages/admin/articles/Create/Create'
import { EditArticle } from '@/pages/admin/articles/Edit/Edit'
import { MainPage } from '@/pages/admin/home'
import { AdminLogin } from '@/pages/admin/login'
import { RestorePass } from '@/pages/admin/setpass/ui/Restore'
import { ROUTER_PATHS } from '@/shared/config/routes'

import { AdminGuard } from './admin-guard'
import { CloneArticle } from '@/pages/admin/articles/Clone/Clone'
import { ProductFeatures, ProductsList } from '@/pages/admin/products'
import { Atributes } from '@/pages/admin/products/atributes/Atributes'

const { ADMIN, ADMINARTICLES, ADMINLOGIN, CREATEARTICLE, RESTOREPASS, EDIT_PRODUCT } = ROUTER_PATHS
const { EDITARTICLE, CLONEARTICLE, ADMINPRODUCTS, ADMINSETTINGS, CREATE_PRODUCT } = ROUTER_PATHS
const { ADMINPRODUCTS_FEATURES, ADMINPRODUCTS_ATRIBUTES } = ROUTER_PATHS

export const adminRoutes: RouteObject[] = [
  {
    element: <AdminLogin />,
    path: ADMINLOGIN,
  },
  {
    children: [
      { element: <MainPage />, path: ADMIN },
      { element: <Navigate to={ADMIN} />, path: '/admin' },
      { element: <MainPage />, path: ADMINSETTINGS },
      { element: <ProductsList />, path: ADMINPRODUCTS },
      { element: <ProductFeatures />, path: ADMINPRODUCTS_FEATURES },
      { element: <Atributes />, path: ADMINPRODUCTS_ATRIBUTES },
      { element: <div>Cоздать продукт</div>, path: CREATE_PRODUCT },
      { element: <div>Редактировать продукт</div>, path: `${EDIT_PRODUCT}/:id` },
      { element: <RestorePass />, path: RESTOREPASS },
      { element: <ArticlesList />, path: ADMINARTICLES },
      { element: <CreateArticle />, path: CREATEARTICLE },
      { element: <EditArticle />, path: `${EDITARTICLE}/:id` },
      { element: <CloneArticle />, path: `${CLONEARTICLE}/:id` },
    ],
    element: <AdminGuard />,
  },
]

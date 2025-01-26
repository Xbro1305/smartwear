import { Outlet, useLocation } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'

export const AuthGuard = () => {
  const { data: userData, error, isLoading } = useGetMeQuery()

  if (isLoading) {
    console.log('Загрузка данных пользователя...')

    return <div>Загрузка...</div>
  }

  if (error) {
    console.error('Ошибка при загрузке данных пользователя:', error)

    const location = useLocation()
    const from = location?.state?.from || ROUTER_PATHS.PROFILE

    return <Navigate to={`${ROUTER_PATHS.SIGN_IN}?redirectUrl=${from}`} />
  }

  const isAuthenticated = Boolean(userData)

  console.log(`Проверка аутентификации пользователя. Аутентифицирован: ${isAuthenticated}`)
  if (userData) {
    console.log(`Данные пользователя:`, userData)
  }

  const location = useLocation()
  const from = location?.state?.from || ROUTER_PATHS.PROFILE

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={`${ROUTER_PATHS.SIGN_IN}?redirectUrl=${from}`} />
  )
}

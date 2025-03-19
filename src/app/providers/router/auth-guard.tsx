import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useGetMeQuery } from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'

export const AuthGuard = () => {
  const { data: userData, error, isLoading } = useGetMeQuery()
  const location = useLocation()

  if (isLoading) {
    console.log('Загрузка данных пользователя...')

    return <div>Загрузка...</div>
  }

  if (error || !userData) {
    console.error('Ошибка при загрузке данных пользователя:', error)
    const redirectUrl = location.pathname + location.search
    return <Navigate to={`${ROUTER_PATHS.SIGN_IN}?redirectUrl=${redirectUrl}`} replace />
  }

  console.log(`Проверка аутентификации пользователя. Аутентифицирован: ${!!userData}`)
  if (userData) {
    console.log(`Данные пользователя:`, userData)
  }

  return <Outlet />
}

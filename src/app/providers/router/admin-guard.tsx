import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'

export const AdminGuard = () => {
  const { data: userData, isLoading } = useGetMeQuery()

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  const isAdmin = userData?.role === 'ADMIN'

  console.log(`Проверка роли пользователя. Роль: ${userData?.role || 'не указана'}`)
  console.log(`isAdmin: ${isAdmin}`)

  return isAdmin ? <Outlet /> : <Navigate replace to={ROUTER_PATHS.ADMINLOGIN} />
  // return <Outlet />
}

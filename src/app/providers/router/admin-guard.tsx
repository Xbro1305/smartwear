import { Navigate, Outlet } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'

export const AdminGuard = () => {
  const { data: userData, isLoading } = useGetMeQuery()

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  console.log('isAdmin: ' + userData?.role)

  return userData?.role === 'ADMIN' ? <Outlet /> : <Navigate replace to={ROUTER_PATHS.ADMINLOGIN} />
}

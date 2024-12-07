import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'

export const AdminGuard = () => {
  const { data: userData } = useGetMeQuery()

  return userData?.role == 'ADMIN' ? <Outlet /> : <Navigate replace to={ROUTER_PATHS.ADMINLOGIN} />
}

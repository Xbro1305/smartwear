import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'

export const AuthGuard = () => {
  const { data: userData } = useGetMeQuery()

  // return userData?.id ? <Outlet /> : <Navigate replace to={ROUTER_PATHS.SIGN_IN} />
  return <Outlet />
}

import { Outlet } from 'react-router-dom'

//import { useGetMeQuery } from '@/entities/auth'
//import { ROUTER_PATHS } from '@/shared/config/routes'

export const AuthGuard = () => {
  //const { data: userData, isLoading } = useGetMeQuery()

  //if (isLoading) {
  // return <div>Загрузка...</div>
  //}

  //return userData ? <Outlet /> : <Navigate replace to={ROUTER_PATHS.SIGN_IN} />
  return <Outlet />
}

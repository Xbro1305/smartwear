import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { useState, useEffect } from 'react'

export const AdminGuard = () => {
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'))
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Хук будет вызываться только если токен есть
  const { data: userData, isLoading } = useGetMeQuery(undefined, {
    skip: !token,
  })

  if (!token) {
    return <Navigate replace to={ROUTER_PATHS.ADMINLOGIN} />
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  const isAdmin = userData?.role === 'ADMIN'

  console.log(`Проверка роли пользователя. Роль: ${userData?.role || 'не указана'}`)
  console.log(`isAdmin: ${isAdmin}`)

  return isAdmin ? <Outlet /> : <Navigate replace to={ROUTER_PATHS.ADMINLOGIN} />
}

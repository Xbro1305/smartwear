import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'
export const AdminLayout = () => {
  const { data } = useGetMeQuery()

  useEffect(() => {
    let isActive = true
    let closeTimeout: any

    const markActive = () => {
      isActive = true
      clearTimeout(closeTimeout)
      localStorage.setItem('lastActivity', Date.now().toString())
    }

    const checkInactivity = () => {
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0', 10)
      const now = Date.now()
      const timeout = data?.role === 'ADMIN' ? 30 * 60 * 1000 : 24 * 60 * 60 * 1000

      if (now - lastActivity > timeout) {
        localStorage.removeItem('token')
      }
    }

    const handleBeforeUnload = () => {
      isActive = false
      closeTimeout = setTimeout(() => {
        if (!isActive && data?.role === 'ADMIN') {
          localStorage.removeItem('token')
        }
      }, 5000)
    }

    window.addEventListener('mousemove', markActive)
    window.addEventListener('keydown', markActive)
    window.addEventListener('mousedown', markActive)
    window.addEventListener('scroll', markActive)
    window.addEventListener('beforeunload', handleBeforeUnload)

    const interval = setInterval(checkInactivity, 5 * 60 * 1000)

    return () => {
      window.removeEventListener('mousemove', markActive)
      window.removeEventListener('keydown', markActive)
      window.removeEventListener('mousedown', markActive)
      window.removeEventListener('scroll', markActive)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearInterval(interval)
      clearTimeout(closeTimeout)
    }
  }, [data])
  const renderMain = (
    <main>
      <Outlet />
    </main>
  )

  return (
    <>
      <div>{renderMain}</div>
    </>
  )
}

import { useEffect, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { AdminHeader } from '@/widgets/adminHeader/adminHeader'
import { SideBar } from '@/widgets/adminSidebar/sidebar'

export const AdminLayout = () => {
  const location = useLocation()
  const { ADMINLOGIN } = ROUTER_PATHS

  const { data } = useGetMeQuery()

  const page = useMemo(() => {
    return location.pathname.split('/admin/')[1]?.split('/')[0] || 'home'
  }, [location.pathname])

  useEffect(() => {
    let closeTimeout: ReturnType<typeof setTimeout>

    const markActive = () => {
      localStorage.setItem('isActive', 'true')
      localStorage.setItem('lastActivity', Date.now().toString())
      clearTimeout(closeTimeout)
    }

    const checkInactivity = () => {
      const last = Number(localStorage.getItem('lastActivity') || 0)
      const now = Date.now()

      if (now - last > 30 * 60 * 1000) {
        localStorage.removeItem('token')
        window.location.reload()
      }
    }

    const handleBeforeUnload = () => {
      localStorage.setItem('isActive', '')

      closeTimeout = setTimeout(() => {
        if (!localStorage.getItem('isActive')) {
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

  // ✅ логин-страница без layout
  if (location.pathname === ADMINLOGIN || location.pathname === `${ADMINLOGIN}/`) {
    return <Outlet />
  }

  return (
    <div className="grid grid-cols-[300px_1fr] w-full min-h-[100dvh]">
      <SideBar redirectingPage={page} />

      <main className="flex flex-col">
        <AdminHeader page={page} setPage={() => {}} />

        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

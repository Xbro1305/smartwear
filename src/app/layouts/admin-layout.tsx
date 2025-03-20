import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { AdminHeader } from '@/widgets/adminHeader/adminHeader'
import { SideBar } from '@/widgets/adminSidebar/sidebar'
export const AdminLayout = () => {
  const [page, setPage] = useState<string>('Главная')

  const location = useLocation()

  useEffect(() => {
    const path = location.pathname.split('/admin/')[1]?.split('/')[0] || 'home'
    setPage(path)
  }, [location.pathname])

  const { data } = useGetMeQuery()

  useEffect(() => {
    localStorage.setItem('isActive', 'true')
    let closeTimeout: any

    const markActive = () => {
      localStorage.setItem('isActive', 'true')
      clearTimeout(closeTimeout)
      localStorage.setItem('lastActivity', Date.now().toString())
    }

    const checkInactivity = () => {
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0', 10)
      const now = Date.now()
      const timeout = 30 * 60 * 1000

      if (now - lastActivity > timeout) {
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

  const { ADMINLOGIN } = ROUTER_PATHS

  const renderMain = (
    <main>
      <Outlet />
    </main>
  )

  if (window.location.pathname == ADMINLOGIN) {
    return (
      <>
        <div>{renderMain}</div>
      </>
    )
  } else if (window.location.pathname == ADMINLOGIN + '/') {
    return (
      <>
        <div>{renderMain}</div>
      </>
    )
  } else {
    return (
      <div
        style={{ display: 'grid', gridTemplateColumns: '300px calc(100% - 300px)', width: '100%' }}
      >
        <SideBar redirectingPage={page} />
        <main
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AdminHeader page={page} setPage={setPage} />
          <div
            onClick={() => {
              const path = location.pathname.split('/admin/')[1]?.split('/')[0] || 'home'
              if (path && path != page) {
                setPage(path)
              }
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    )
  }
}

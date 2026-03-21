import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'
import { Modal } from '@/pages/home/ui/Modal'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import { BottomBar } from '@/widgets/bottomBar/bottomBar'

export const RootLayout = () => {
  const { isError, isLoading } = useGetMeQuery()
  const location = useLocation()

  const isAuthenticated = !isError && !isLoading

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  useEffect(() => {
    let closeTimeout: ReturnType<typeof setTimeout>

    const markActive = () => {
      localStorage.setItem('lastActivity', Date.now().toString())
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
      closeTimeout = setTimeout(() => {
        localStorage.removeItem('token')
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
  }, [])

  if (isLoading) return null

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="max-h-[calc(100dvh-70px)] xl:max-h-[100dvh] flex-1 flex flex-col overflow-y-auto">
        <Header />
        <main>
          <Outlet />
          <Modal />
        </main>
        <Footer />
      </div>
      <BottomBar />
    </div>
  )
}

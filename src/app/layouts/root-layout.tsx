import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'
import { Modal } from '@/pages/home/ui/Modal'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'

export const RootLayout = () => {
  const { data, isError, isLoading } = useGetMeQuery()
  const isAuthenticated = !isError && !isLoading

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
      const timeout = 2 * 60 * 1000

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

  if (isLoading) {
    return <div>Проверка ваших полномочий...</div>
  }

  const renderMain = (
    <main>
      <Outlet />
      <Modal />
    </main>
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    return (
      <>
        <Header />
        <div>{renderMain}</div>
        <Footer />
      </>
    )
  }

  return (
    <div>
      <Header />
      {!isLoading && renderMain}
      <Footer />
      <Footer />
    </div>
  )
}

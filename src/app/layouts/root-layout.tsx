import { useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'
import { Modal } from '@/pages/home/ui/Modal'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import { BottomBar } from '@/widgets/bottomBar/bottomBar'

export const RootLayout = () => {
  const { isLoading } = useGetMeQuery()
  const location = useLocation()
  const navType = useNavigationType() // POP (назад/вперёд) | PUSH | REPLACE
  const positions = useRef<Record<string, number>>({})

  // Сохраняем позицию скролла .main-container для текущей записи истории
  useEffect(() => {
    const el = document.querySelector('.main-container') as HTMLElement | null
    if (!el) return
    const key = location.key
    const onScroll = () => {
      positions.current[key] = el.scrollTop
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [location.key])

  // При «назад/вперёд» восстанавливаем позицию, при обычном переходе — вверх
  useLayoutEffect(() => {
    const el = document.querySelector('.main-container') as HTMLElement | null
    if (!el) return
    if (navType === 'POP') {
      el.scrollTop = positions.current[location.key] ?? 0
    } else {
      el.scrollTop = 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

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
      <div className="main-container flex-1 flex flex-col overflow-y-auto">
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

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { ROUTER_PATHS } from '@/shared/config/routes'

import styles from '../home.module.scss'

export const Modal = () => {
  const [show, setIsSeen] = useState(!localStorage.getItem('isUserAccessedCookies'))

  useEffect(() => {
    const userAccessedCookies = localStorage.getItem('isUserAccessedCookies')
    const timestamp = localStorage.getItem('cookiesTimestamp')

    if (userAccessedCookies && timestamp) {
      const elapsedTime = Date.now() - parseInt(timestamp)

      if (elapsedTime > 10 * 60 * 1000) {
        localStorage.removeItem('isUserAccessedCookies')
        localStorage.removeItem('cookiesTimestamp')
        setIsSeen(true)
      } else {
        setIsSeen(false)
      }
    } else {
      setIsSeen(true)
    }
  }, [])

  const close = () => {
    localStorage.setItem('isUserAccessedCookies', 'true')
    localStorage.setItem('cookiesTimestamp', Date.now().toString())
    setIsSeen(false)
  }

  if (!show) {
    return null
  }

  return (
    <div className={styles.modal}>
      <p className={styles.modal_text}>
        Продолжая пользоваться сайтом, вы соглашаетесь на обработку файлов cookie и других
        пользовательских данных в соответствии с{' '}
        <Link to={ROUTER_PATHS.POLITICS}>политикой конфиденциальности</Link>.
      </p>
      <button className={styles.modal_button} onClick={close}>
        Понятно
      </button>
    </div>
  )
}

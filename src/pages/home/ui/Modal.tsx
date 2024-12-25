import { useState } from 'react'
import { Link } from 'react-router-dom'

import { ROUTER_PATHS } from '@/shared/config/routes'

import styles from '../home.module.scss'

export const Modal = () => {
  const isSeen = localStorage.getItem('isUserAccessedCookies')
  const [display, setDisplay] = useState(isSeen ? true : false)

  const close = () => {
    localStorage.setItem('isUserAccessedCookies', 'true')
    setDisplay(true)
  }

  return (
    <div className={styles.modal} style={{ display: display ? 'none' : 'flex' }}>
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

import { Link } from 'react-router-dom'
import styles from '../home.module.scss'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { useState } from 'react'

export const Modal = () => {
  const access = localStorage.getItem('isUserAccessedCookies')
  const [display, setDisplay] = useState(access ? true : false)

  const close = () => {
    localStorage.setItem('isUserAccessedCookies', 'true')
    setDisplay(true)
  }

  return (
    <div style={{ display: display ? 'none' : 'flex' }} className={styles.modal}>
      <p className={styles.modal_text}>
        Продолжая пользоваться сайтом, вы соглашаетесь на обработку файлов cookie и других
        пользовательских данных в соответствии с{' '}
        <Link to={ROUTER_PATHS.POLITICS}>политикой конфиденциальности</Link>.
      </p>
      <button onClick={close} className={styles.modal_button}>
        Понятно
      </button>
    </div>
  )
}

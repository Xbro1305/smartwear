import { Link } from 'react-router-dom'

import { ROUTER_PATHS } from '@/shared/config/routes'

import styles from './Header.module.scss'

import logo from '../../../assets/images/logo.png'
import profile from '../../../assets/images/svg (1).svg'
import cart from '../../../assets/images/svg (2).svg'
import search from '../../../assets/images/svg.svg'
import { useEffect, useState } from 'react'

export const Header: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token')
    alert('Токен удалён!')
    window.location.reload()
  }

  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.header_sect}>
        <Link className={styles.header_logo} to={ROUTER_PATHS.HOME}>
          <div className={styles.header_logo_wrapper}>
            <img alt={'Logo'} className={styles.header_logo} src={logo} />
          </div>
        </Link>
        <Link to={ROUTER_PATHS.CATALOG}>Каталог</Link>
        <Link to={ROUTER_PATHS.ABOUT}>О нас</Link>
        <Link to={ROUTER_PATHS.CONTACTS}>Контакты</Link>
        <Link to={ROUTER_PATHS.DELIVERY}>Доставка</Link>
      </div>
      <div className={styles.header_sect}>
        <Link to={ROUTER_PATHS.SEARCH}>
          <img alt={'Search'} src={search} />
        </Link>
        <Link to={ROUTER_PATHS.PROFILE}>
          <img alt={'Profile'} src={profile} />
        </Link>
        <Link className={styles.header_button} onClick={handleLogout} to={''}>
          <img alt={'Cart'} src={cart} />
        </Link>
      </div>
      <button className={styles.header_menu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <h1 className={styles.header_width}>{width}</h1>
    </header>
  )
}

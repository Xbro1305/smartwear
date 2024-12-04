import styles from './Header.module.scss'
import logo from '../../../assets/images/logo.png'
import search from '../../../assets/images/svg.svg'
import profile from '../../../assets/images/svg (1).svg'
import cart from '../../../assets/images/svg (2).svg'
import { Link } from 'react-router-dom'
import { ROUTER_PATHS } from '@/shared/config/routes'

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header_sect}>
        <Link to={ROUTER_PATHS.HOME} className={styles.header_logo}>
          <div className={styles.header_logo_wrapper}>
            <img className={styles.header_logo} src={logo} alt="Logo" />
          </div>
        </Link>
        <Link to={ROUTER_PATHS.CATALOG}>Каталог</Link>
        <Link to={ROUTER_PATHS.ABOUT}>О нас</Link>
        <Link to={ROUTER_PATHS.CONTACTS}>Контакты</Link>
        <Link to={ROUTER_PATHS.DELIVERY}>Доставка</Link>
      </div>
      <div className={styles.header_sect}>
        <Link to={ROUTER_PATHS.SEARCH}>
          <img src={search} alt="Search" />
        </Link>
        <Link to={ROUTER_PATHS.PROFILE}>
          <img src={profile} alt="Profile" />
        </Link>
        <Link to={ROUTER_PATHS.CART}>
          <img src={cart} alt="Cart" />
        </Link>
      </div>
      <button className={styles.header_menu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  )
}

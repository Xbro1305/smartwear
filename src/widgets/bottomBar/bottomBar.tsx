import { ROUTER_PATHS } from '@/shared/config/routes'
import styles from '../header/ui/Header.module.scss'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import home from '../header/icons/home.svg'
import catalog from '../header/icons/catalog.svg'
import saved from '../header/icons/saved.svg'
import basket from '../header/icons/basket.svg'
import profile from '../header/icons/profile.svg'
import { useSelector } from 'react-redux'

export const BottomBar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const cartLength = useSelector((state: any) => state.cart.items.length)

  const handleCatalogClick = () => {
    const lastProduct = localStorage.getItem('lastProductPage')

    const isFromCartOrProfile = location.pathname === '/cart' || location.pathname === '/profile'

    if (isFromCartOrProfile && lastProduct) {
      localStorage.removeItem('lastProductPage')
      navigate(lastProduct)
    } else {
      navigate(ROUTER_PATHS.CATALOG)
    }
  }

  return (
    <div className={styles.mob_navigation}>
      <Link className="p2" to={ROUTER_PATHS.HOME}>
        <img src={home} alt="" />
        Главная
      </Link>
      <a className="p2 cursor-pointer" onClick={handleCatalogClick}>
        <img src={catalog} alt="" />
        Каталог
      </a>
      <Link className="p2" to={'/cart'}>
        <img src={saved} alt="" />
        Избранное
      </Link>
      <Link className="p2 relative" to={'/cart'}>
        <img src={basket} alt="" />
        Корзина
        {cartLength > 0 && (
          <div className="absolute bottom-[18px] right-[5px] bg-red text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-[10px]">
            {cartLength}
          </div>
        )}
      </Link>
      <Link className="p2" to={ROUTER_PATHS.PROFILE} state={{ from: location.pathname }}>
        <img src={profile} alt="" />
        {localStorage.getItem('token') ? 'Профиль' : 'Войти'}
      </Link>
    </div>
  )
}

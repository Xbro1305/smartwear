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

  const cartLength = useSelector((state: any) => state.cartCount)

  // универсальный state
  const getState = () => ({
    ...location.state,
    from: location.pathname,
  })

  // универсальный navigate
  const navigateWithState = (path: string) => {
    navigate(path, { state: getState() })
  }

  const handleCatalogClick = () => {
    const lastProduct = localStorage.getItem('lastProductPage')

    const isFromCartOrProfile = location.pathname === '/cart' || location.pathname === '/profile'

    if (isFromCartOrProfile && lastProduct) {
      localStorage.removeItem('lastProductPage')
      navigateWithState(lastProduct)
    } else {
      navigateWithState(ROUTER_PATHS.CATALOG)
    }
  }

  return (
    <div className={`navigation ${styles.mob_navigation}`}>
      <Link className="p2" to={ROUTER_PATHS.HOME} state={getState()}>
        <img src={home} alt="" />
        Главная
      </Link>

      <button className="p2 cursor-pointer" onClick={handleCatalogClick}>
        <img src={catalog} alt="" />
        Каталог
      </button>

      <Link className="p2" to={'/favorites'} state={getState()}>
        <img src={saved} alt="" />
        Избранное
      </Link>

      <Link className="p2 relative" to={'/cart'} state={getState()}>
        <img src={basket} alt="" />
        Корзина
        {cartLength > 0 && (
          <div className="absolute bottom-[18px] right-[5px] bg-red text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-[10px]">
            {cartLength}
          </div>
        )}
      </Link>

      <Link className="p2" to={ROUTER_PATHS.PROFILE} state={getState()}>
        <img src={profile} alt="" />
        {localStorage.getItem('token') ? 'Профиль' : 'Войти'}
      </Link>
    </div>
  )
}

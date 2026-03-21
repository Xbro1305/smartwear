import { ROUTER_PATHS } from '@/shared/config/routes'
import styles from '../header/ui/Header.module.scss'
import { Link } from 'react-router-dom'
import home from '../header/icons/home.svg'
import catalog from '../header/icons/catalog.svg'
import saved from '../header/icons/saved.svg'
import basket from '../header/icons/basket.svg'
import profile from '../header/icons/profile.svg'
import { useSelector } from 'react-redux'

export const BottomBar = () => {
  const cartLength = useSelector((state: any) => state.cart.items.length)

  return (
    <div className={styles.mob_navigation}>
      <Link className="p2" to={ROUTER_PATHS.HOME}>
        <img src={home} alt="" />
        Главная
      </Link>
      <Link className="p2" to={ROUTER_PATHS.CATALOG}>
        <img src={catalog} alt="" />
        Каталог
      </Link>
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

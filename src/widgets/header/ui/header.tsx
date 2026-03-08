import { Link, useLocation } from 'react-router-dom'

import { ROUTER_PATHS } from '@/shared/config/routes'

import styles from './Header.module.scss'
import { MdMenu, MdClose } from 'react-icons/md'
import logo from '../../../assets/images/logo.png'

import cart from '../../../assets/images/svg (2).svg'
import search from '../../../assets/images/svg.svg'
import { useEffect, useState } from 'react'
import axios from 'axios'
import home from '../icons/home.svg'
import catalog from '../icons/catalog.svg'
import saved from '../icons/saved.svg'
import basket from '../icons/basket.svg'
import profile from '../icons/profile.svg'

// interface MenuItem {
//   title: string
//   subCategories?: string[]
// }

// interface ThirdColumnData {
//   [key: string]: string[]
// }

// Данные меню
// const firstColumn: MenuItem[] = [
//   { title: 'Женщинам', subCategories: ['Весна/лето', 'Демисезон', 'Зима'] },
//   { title: 'Мужчинам', subCategories: ['Весна/лето', 'Демисезон', 'Зима'] },
//   { title: 'Аксессуары' },
//   { title: 'Новые поступления' },
//   { title: 'Распродажа' },
//   { title: 'Большие размеры' },
//   { title: 'Наши материалы' },
// ]

// const thirdColumnData: ThirdColumnData = {
//   'Весна/лето': ['Autojack', 'Nordwind', 'Запорожец', 'Технология комфорта'],
//   Демисезон: ['Autojack', 'Nordwind'],
//   Зима: ['Запорожец', 'Технология комфорта'],
// }

export const Header: React.FC = () => {
  // const [activeFirstColumn, setActiveFirstColumn] = useState<number | null>(null)
  // const [activeSecondColumn, setActiveSecondColumn] = useState<string | null>(null)
  // const [activeColumn, setActiveColumn] = useState(0)
  // const closeMenuTimer = useRef<NodeJS.Timeout | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [categories, setCategories] = useState<any>(null)
  const cartLength = (localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : [])
    .length
  const main = document?.querySelector('main')

  isOpen && main && main.addEventListener('click', () => setIsOpen(false))

  const location = useLocation()
  const redirectUrl = location.pathname + location.search
  const searchParams = new URLSearchParams(location.search)

  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/categories`).then(res => {
      const data = res?.data?.filter((cat: any) => cat.showInMenu)
      setCategories(data)
    })

    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  console.log(categories)

  return (
    <header className={styles.header}>
      <div className={styles.header_sect}>
        <Link className={styles.header_logo} to="/">
          <div className={styles.header_logo_wrapper}>
            <img alt="Logo" className={styles.header_logo_img} src={logo} />
          </div>
        </Link>
        {/* <div className={styles.header_link_with_menu}>
          <Link
            className={styles.header_catalogLink}
            onMouseEnter={() => {
              if (activeFirstColumn != null) setActiveColumn(2)
              if (activeSecondColumn != null) setActiveColumn(3)
              else setActiveColumn(1)
              handleMouseEnter()
            }}
            onMouseLeave={handleMouseLeave}
            to={ROUTER_PATHS.CATALOG}
          >
            Каталог
          </Link>
          <div
            className={styles.dropdown_menu}
            style={{ display: activeColumn >= 1 ? 'flex' : 'none' }}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
          >
            <div
              className={styles.dropdown_block}
              style={{ display: activeColumn >= 1 ? 'flex' : 'none' }}
            >
              {firstColumn.map((item, index) => (
                <div
                  onMouseEnter={() => {
                    setActiveColumn(2)
                    setActiveFirstColumn(index)
                    setActiveSecondColumn(null)
                  }}
                  style={{
                    display: activeColumn >= 1 ? 'flex' : 'none',
                    color: activeFirstColumn == index ? 'var(--red)' : '',
                  }}
                  key={index}
                >
                  <Link
                    style={{
                      color: activeFirstColumn == index ? 'var(--red)' : '',
                    }}
                    to={ROUTER_PATHS.CATALOG}
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>

            {activeFirstColumn !== null && firstColumn[activeFirstColumn]?.subCategories && (
              <div
                className={styles.dropdown_block}
                style={{ display: activeColumn >= 2 ? 'flex' : 'none' }}
              >
                {firstColumn[activeFirstColumn].subCategories!.map((subCategory, index) => (
                  <div
                    onMouseEnter={() => {
                      setActiveColumn(3)
                      setActiveSecondColumn(subCategory)
                    }}
                    key={index}
                    style={{
                      color: activeSecondColumn == subCategory ? 'var(--red)' : '',
                    }}
                  >
                    <Link
                      style={{
                        color: activeSecondColumn == subCategory ? 'var(--red)' : '',
                      }}
                      to={ROUTER_PATHS.CATALOG}
                    >
                      {subCategory}
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {activeSecondColumn && thirdColumnData[activeSecondColumn] && (
              <div
                className={styles.dropdown_block}
                style={{ display: activeColumn >= 3 ? 'flex' : 'none' }}
              >
                {thirdColumnData[activeSecondColumn].map((item, index) => (
                  <Link key={index} to={`/${item.toLowerCase()}`}>
                    {item}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div> */}

        {categories &&
          categories.map((category: any) => (
            <Link key={category.id} to={`${category.slug}`}>
              {category.name}
            </Link>
          ))}

        <Link to="/about">О нас</Link>
        <Link to="/contacts">Контакты</Link>
        <Link to="/delivery">Доставка</Link>
        <Link to={ROUTER_PATHS.ARTICLES}>Статьи</Link>
      </div>

      <div className={styles.header_sect}>
        <Link to={ROUTER_PATHS.SEARCH}>
          <img alt="Search" src={search} />
        </Link>
        <Link
          to={
            localStorage.getItem('token')
              ? ROUTER_PATHS.PROFILE
              : `${ROUTER_PATHS.SIGN_IN}?redirectUrl=${searchParams.get('redirectUrl') || redirectUrl || ''}`
          }
          state={{ from: location.pathname }}
        >
          <img alt="Profile" src={profile} />
          {localStorage.getItem('token') ? 'Профиль' : 'Войти'}
        </Link>

        <Link to={ROUTER_PATHS.CART} className={styles.header_button}>
          <img alt="Cart" src={cart} />
          {cartLength > 0 && (
            <div className="absolute bottom-[10px] -right-[3px] bg-red text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-[12px]">
              {cartLength}
            </div>
          )}
        </Link>
      </div>
      <button className={styles.header_menu} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <MdClose /> : <MdMenu />}
      </button>
      {/* <h1 className={styles.header_width}>{width}</h1> */}

      <div
        className={styles.mob_header}
        id="mob_header"
        style={width <= 1214 && isOpen ? {} : { top: '-100%' }}
      >
        <Link onClick={() => setIsOpen(false)} to={ROUTER_PATHS.CATALOG}>
          Каталог
        </Link>
        <Link onClick={() => setIsOpen(false)} to="/about">
          О нас
        </Link>
        <Link onClick={() => setIsOpen(false)} to="/contacts">
          Контакты
        </Link>
        <Link onClick={() => setIsOpen(false)} to={ROUTER_PATHS.ARTICLES}>
          Статьи
        </Link>
        <Link onClick={() => setIsOpen(false)} to="/delivery">
          Доставка
        </Link>
      </div>

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
    </header>
  )
}

import { Link } from 'react-router-dom'

import { ROUTER_PATHS } from '@/shared/config/routes'

import styles from './Header.module.scss'

import logo from '../../../assets/images/logo.png'
import profile from '../../../assets/images/svg (1).svg'
import cart from '../../../assets/images/svg (2).svg'
import search from '../../../assets/images/svg.svg'
import { useEffect, useRef, useState } from 'react'

interface MenuItem {
  title: string
  subCategories?: string[]
}

interface ThirdColumnData {
  [key: string]: string[]
}

// Данные меню
const firstColumn: MenuItem[] = [
  { title: 'Женщинам', subCategories: ['Весна/лето', 'Демисезон', 'Зима'] },
  { title: 'Мужчинам', subCategories: ['Весна/лето', 'Демисезон', 'Зима'] },
  { title: 'Аксессуары' },
  { title: 'Новые поступления' },
  { title: 'Распродажа' },
  { title: 'Большие размеры' },
  { title: 'Наши материалы' },
]

const thirdColumnData: ThirdColumnData = {
  'Весна/лето': ['Autojack', 'Nordwind', 'Запорожец', 'Технология комфорта'],
  Демисезон: ['Autojack', 'Nordwind'],
  Зима: ['Запорожец', 'Технология комфорта'],
}

export const Header: React.FC = () => {
  const [activeFirstColumn, setActiveFirstColumn] = useState<number | null>(null)
  const [activeSecondColumn, setActiveSecondColumn] = useState<string | null>(null)
  const [activeColumn, setActiveColumn] = useState(0)
  const closeMenuTimer = useRef<NodeJS.Timeout | null>(null)

  const handleMouseLeave = () => {
    closeMenuTimer.current = setTimeout(() => setActiveColumn(0), 0)
  }

  const handleMouseEnter = () => {
    if (closeMenuTimer.current) {
      clearTimeout(closeMenuTimer.current)
      closeMenuTimer.current = null
    }
  }

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
        <Link className={styles.header_logo} to="/">
          <div className={styles.header_logo_wrapper}>
            <img alt="Logo" className={styles.header_logo_img} src={logo} />
          </div>
        </Link>
        <div className={styles.header_link_with_menu}>
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
            {/* 1 */}
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
                    color: activeFirstColumn == index ? '#dc2a1f' : '',
                  }}
                  key={index}
                >
                  <Link
                    style={{
                      color: activeFirstColumn == index ? '#dc2a1f' : '',
                    }}
                    to={ROUTER_PATHS.CATALOG}
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>

            {/* 2 */}
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
                        color: activeSecondColumn == subCategory ? '#dc2a1f' : '',
                      }}
                      to={ROUTER_PATHS.CATALOG}
                    >
                      {subCategory}
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* 3 */}
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
        </div>
        <Link to="/about">О нас</Link>
        {/* <Link to="/contacts">Контакты</Link> */}
        <Link to={ROUTER_PATHS.ARTICLES}>Статьи</Link>
        <Link to="/delivery">Доставка</Link>
      </div>

      <div className={styles.header_sect}>
        <Link to={ROUTER_PATHS.SEARCH}>
          <img alt="Search" src={search} />
        </Link>
        <Link to={ROUTER_PATHS.PROFILE}>
          <img alt="Profile" src={profile} />
          {localStorage.getItem('token') ? 'Профиль' : 'Войти'}
        </Link>
        <Link to={ROUTER_PATHS.CART} className={styles.header_button} onClick={handleLogout}>
          <img alt="Cart" src={cart} />
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

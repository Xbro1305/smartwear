import styles from './sidebar.module.scss'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useGetMeQuery } from '@/entities/auth'
import { IoCard, IoExitOutline } from 'react-icons/io5'
import logo from '@/assets/images/logo.png'
import { FaCog, FaFileAlt, FaList, FaQuestion } from 'react-icons/fa'
import { FaHome } from 'react-icons/fa'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { LuBlocks } from 'react-icons/lu'
import atributesImg from '@/assets/images/broadcast-one.svg'
import { useEffect, useState } from 'react'

const { ADMINARTICLES, ADMIN, HOME, ADMINSETTINGS } = ROUTER_PATHS
const rp = { ...ROUTER_PATHS }

export const SideBar = ({ redirectingPage }: { redirectingPage: string }) => {
  const { data: user } = useGetMeQuery()
  const location = useLocation()
  const [page, setPage] = useState(() => {
    return location.pathname.split('/admin/')[1]?.split('/')[0] || 'home'
  })
  const [items, setItems] = useState<MenuItem[]>(menuItems[page] || menuItems.home)

  useEffect(() => {
    setPage(redirectingPage)
    setItems(menuItems[redirectingPage] || menuItems.home)
  }, [location.pathname, redirectingPage])

  return (
    <div className={styles.sidebar}>
      <Link to={HOME}>
        <img src={logo} className={styles.sidebar_logo} alt="" />
      </Link>
      <div className={styles.sidebar_navigation}>
        {items.map((item, index) => (
          <NavLink
            end={item.end}
            title={item.name}
            id="adminSideBar_link"
            key={index}
            to={item.path}
            className={styles.sidebar_navigation_item}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
      <div className={styles.sidebar_profile}>
        <figure>
          <img alt={'img'} src={''} />
        </figure>
        <section>
          <p>{user?.name}</p>
          <span>Админ</span>
        </section>
        <button>
          <IoExitOutline />
        </button>
      </div>
    </div>
  )
}

type MenuItem = {
  name: string
  icon: JSX.Element
  path: string
  end: boolean
}

type MenuItems = {
  [key: string]: MenuItem[]
}

const menuItems: MenuItems = {
  home: [
    { name: 'Статистика', icon: <FaHome />, path: ADMIN, end: true },
    { name: 'Статьи', icon: <FaFileAlt />, path: ADMINARTICLES, end: false },
    { name: 'Настройки', icon: <FaCog />, path: ADMINSETTINGS, end: false },
  ],
  products: [
    { name: 'Список товаров', icon: <FaList />, path: rp.ADMINPRODUCTS, end: true },
    { name: 'Категории', icon: <LuBlocks />, path: rp.ADMINPRODUCTS_CATEGORIES, end: false },
    {
      name: 'Атрибуты',
      icon: <img src={atributesImg} />,
      path: rp.ADMINPRODUCTS_ATRIBUTES,
      end: false,
    },
    { name: 'Особенности', icon: <FaQuestion />, path: rp.ADMINPRODUCTS_FEATURES, end: false },
    { name: 'Цены', icon: <IoCard />, path: rp.ADMINPRODUCTS_PRICES, end: false },
  ],
}

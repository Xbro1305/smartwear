import styles from './sidebar.module.scss'
import { Link, NavLink } from 'react-router-dom'
import { useGetMeQuery } from '@/entities/auth'
import { IoExitOutline } from 'react-icons/io5'
import logo from '@/assets/images/logo.png'
import { FaUsers, FaBoxOpen, FaShoppingCart, FaNewspaper, FaCog, FaFileAlt } from 'react-icons/fa'
import { FaSearch, FaHome } from 'react-icons/fa'
import { ROUTER_PATHS } from '@/shared/config/routes'

const { ADMINARTICLES, ADMIN, HOME } = ROUTER_PATHS

export const SideBar = () => {
  const { data: user } = useGetMeQuery()

  return (
    <div className={styles.sidebar}>
      <Link to={HOME}>
        <img src={logo} className={styles.sidebar_logo} alt="" />
      </Link>
      <label className={styles.sidebar_search}>
        <FaSearch />
        <input type="text" placeholder="Поиск" />
      </label>
      <div className={styles.sidebar_navigation}>
        {menuItems.map((item, index) => (
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

const menuItems = [
  { name: 'Главная', icon: <FaHome />, path: ADMIN, end: true },
  { name: 'Сотрудники', icon: <FaUsers />, path: '/admin/employees', end: false },
  { name: 'Покупатели', icon: <FaShoppingCart />, path: '/admin/customers', end: false },
  { name: 'Заказы', icon: <FaBoxOpen />, path: '/admin/orders', end: false },
  // { name: 'Новости', icon: <FaNewspaper />, path: '/admin/news', end: false },
  { name: 'Настройки', icon: <FaCog />, path: '/admin/settings', end: false },
  { name: 'Статьи', icon: <FaFileAlt />, path: ADMINARTICLES, end: false },
  { name: 'Товары', icon: <FaBoxOpen />, path: '/products', end: false },
]

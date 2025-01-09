import { NavLink } from 'react-router-dom'
import styles from './adminHader.module.scss'
import { FaSearch } from 'react-icons/fa'

import { ROUTER_PATHS } from '@/shared/config/routes'
const { ADMINARTICLES, ADMIN } = ROUTER_PATHS

export const AdminHeader = () => {
  const menuItems = [
    { name: 'Главная', path: ADMIN, end: true },
    { name: 'Сотрудники', path: '/admin/employees', end: false },
    { name: 'Покупатели', path: '/admin/customers', end: false },
    { name: 'Заказы', path: '/admin/orders', end: false },
    { name: 'Новости', path: '/admin/news', end: false },
    { name: 'Настройки', path: '/admin/settings', end: false },
    { name: 'Статьи', path: ADMINARTICLES, end: false },
    { name: 'Товары', path: '/products', end: false },
  ]

  return (
    <header className={styles.adminHeader}>
      <section className={styles.adminHeader_links}>
        {menuItems.map(i => (
          <NavLink className="adminHeader_link" to={i.path} end={i.end}>
            {i.name}
          </NavLink>
        ))}
      </section>
      <label>
        <FaSearch />
        <input type="text" placeholder="Поиск" />
      </label>
    </header>
  )
}

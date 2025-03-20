import styles from './adminHader.module.scss'
import { FaSearch } from 'react-icons/fa'

import { ROUTER_PATHS } from '@/shared/config/routes'
const { ADMIN } = ROUTER_PATHS

export const AdminHeader = ({
  setPage,
  page,
}: {
  setPage: (item: string) => void
  page: string
}) => {
  const menuItems = [
    { name: 'Главная', path: ADMIN, end: false },
    { name: 'Товары', path: '/admin/products', end: false },
    { name: 'Заказы', path: '/admin/orders', end: false },
    { name: 'Магазины', path: '/admin/shops', end: false },
    { name: 'Сотрудники', path: '/admin/employees', end: false },
    // { name: 'Клиенты', path: '/admin/clients', end: false },
    // { name: 'Новости', path: '/admin/news', end: false },
    // { name: 'Статьи', path: ADMINARTICLES, end: false },
  ]

  return (
    <header className={styles.adminHeader}>
      <section className={styles.adminHeader_links}>
        {menuItems.map(i => (
          <button
            className={`adminHeader_link ${page == i.path.split('/')[2] && 'active'}`}
            onClick={() => setPage(i.path.split('/')[2])}
          >
            {i.name}
          </button>
        ))}
      </section>
      <label>
        <FaSearch />
        <input type="text" placeholder="Поиск" />
      </label>
    </header>
  )
}

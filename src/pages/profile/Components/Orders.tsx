import { useEffect, useState } from 'react'
import styles from './Components.module.scss'
import { NumericFormat } from 'react-number-format'
import { IoEnter } from 'react-icons/io5'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { CgChevronDown } from 'react-icons/cg'

interface order {
  id: number
  createdAt: Date
  status: string
  totalAmount: string
}

export const Orders = () => {
  const [orders, setOrders] = useState<order[]>([])
  const [ordersCount, setOrdersCount] = useState(0)

  const { ORDERPROFILE } = ROUTER_PATHS

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/orders/my`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => {
        setOrders(res.data)
        setOrdersCount(res.data.length)
      })
      .catch(console.error)
  }, [])

  return (
    <div className={styles.orders}>
      <h2 className="h2">История заказов</h2>
      <section className={styles.orders_top}>
        <p className="p2">
          Всего заказов: <b>{ordersCount}</b>
        </p>
        <div>
          <p>Все заказы</p>
          <CgChevronDown />
        </div>
      </section>

      <div className={styles.orders_list}>
        <div className={styles.orders_list_top}>
          <p className="p2">Номер заказа</p>
          <p className="p2">Дата создания</p>
          <p className="p2">Статус</p>
          <p className="p2">Сумма заказа, ₽</p>
          <p className="p2"></p>
        </div>
        {orders.map(i => (
          <Link className={styles.orders_list_item} to={`${ORDERPROFILE}/${i.id}`}>
            <p className="p2">№ {i.id}</p>
            <p className="p2">
              {new Date(i.createdAt).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              })}
            </p>
            <p className="p2" style={{ color: i.status == 'NEW' ? 'var(--green)' : 'var(--dark)' }}>
              {i.status == 'NEW' ? 'Новый' : i.status == 'CANCELLED' ? 'Отменен' : 'Завершен'}
            </p>
            <NumericFormat
              className="p2"
              value={i.totalAmount}
              decimalSeparator="."
              thousandSeparator=" "
              displayType="text"
            />
            <p className="p2" style={{ cursor: 'pointer' }}>
              <IoEnter />
            </p>
          </Link>
        ))}
      </div>

      {/* <button onClick={getMoreOrders}>Показать ещё</button> */}
    </div>
  )
}

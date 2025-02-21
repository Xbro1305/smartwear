import { useState } from 'react'
import styles from './Components.module.scss'
import { NumericFormat } from 'react-number-format'
import { IoEnter } from 'react-icons/io5'

interface order {
  id: number
  date: string
  status: string
  price: number
}

export const Orders = () => {
  const data = [
    { id: 100000, date: '10.01.2025 г.', status: 'В обработке', price: 7835.0 },
    { id: 100001, date: '10.01.2025 г.', status: 'В обработке', price: 7835.0 },
    { id: 100002, date: '10.01.2025 г.', status: 'Выполнен', price: 7835.0 },
    { id: 100003, date: '10.01.2025 г.', status: 'Выполнен', price: 7835.0 },
    { id: 100004, date: '10.01.2025 г.', status: 'Выполнен', price: 7835.0 },
  ]
  const [orders, setOrders] = useState<order[]>(data)
  const [ordersCount, setOrdersCount] = useState(20)

  const getMoreOrders = () => {}

  return (
    <div className={styles.orders}>
      <h2 className="h2">История заказов</h2>
      <section className={styles.orders_top}>
        <p className="p2">
          Всего заказов: <b>{ordersCount}</b>
        </p>
        <select>
          <option value="all">Все заказы</option>
        </select>
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
          <div className={styles.orders_list_item}>
            <p className="p2">№ {i.id}</p>
            <p className="p2">{i.date}</p>
            <p
              className="p2"
              style={{ color: i.status == 'Выполнен' ? 'var(--green)' : 'var(--dark)' }}
            >
              {i.status}
            </p>
            <NumericFormat
              className="p2"
              value={i.price}
              decimalSeparator="."
              thousandSeparator=" "
              displayType="text"
            />
            <p>
              <IoEnter />
            </p>
          </div>
        ))}
      </div>

      <button onClick={getMoreOrders}>Показать ещё</button>
    </div>
  )
}

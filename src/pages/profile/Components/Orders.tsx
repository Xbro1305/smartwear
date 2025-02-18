import { useState } from 'react'
import styles from './Components.module.scss'
import { CustomSelect } from '@/widgets/customSelect/select'

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
    { id: 100002, date: '10.01.2025 г.', status: 'В обработке', price: 7835.0 },
    { id: 100003, date: '10.01.2025 г.', status: 'В обработке', price: 7835.0 },
    { id: 100004, date: '10.01.2025 г.', status: 'В обработке', price: 7835.0 },
  ]
  const [orders, setOrders] = useState<order[]>(data)
  const [ordersCount, setOrdersCount] = useState(20)

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
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'

import cube from '@/assets/images/Cube.svg'
import Infographic from '@/assets/images/Infographic.svg'
import people from '@/assets/images/People.svg'
import chart_line from '@/assets/images/chart-line.svg'
import clock from '@/assets/images/clock.svg'
import { useGetMeQuery } from '@/entities/auth'
import { AdminHeader } from '@/widgets/adminHeader/adminHeader'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'

import './select.css'

import styles from './home.module.scss'

import { ChartComponent } from './chart'
import { MonthsSelect, Select } from './select'

const sellsPoints = [380, 204, 222, 203, 312, 318, 115, 145, 120, 128, 143, 176, 140, 145]
const ordersPoints = [128, 80, 130, 65, 89, 130, 115, 145, 120, 128, 143, 176, 140, 145]
const returnsPoints = [9, 8, 5, 6, 8, 7, 9, 10, 9, 10, 10, 9, 11, 7]

export const MainPage = () => {
  const [openNavigation, setOpenNavigation] = useState<boolean>(true)
  const { data: user } = useGetMeQuery()

  return (
    <>
      <AdminHeader />
      <div className={styles.adminHome}>
        <div className={styles.adminHome_left}>
          <div
            aria-opened={openNavigation == true ? true : false}
            className={styles.adminHome_left_navigation}
          >
            <p
              className={styles.adminHome_left_navigation_current}
              onClick={() => {
                setOpenNavigation(!openNavigation)
              }}
            >
              <span>{'>'}</span>Главная
            </p>
            <div
              aria-opened={openNavigation == true ? true : false}
              className={styles.adminHome_left_links}
            >
              {menuItems.map(i => (
                <Link to={'/admin' + i?.link}>{i.label}</Link>
              ))}
            </div>
          </div>
          <div className={styles.adminHome_left_profile}>
            <figure>
              <img alt={'img'} src={''} />
            </figure>
            <section>
              <p>{user?.name}</p>
              <span>Админ</span>
            </section>
            <button>
              <MdOutlineKeyboardArrowDown />
            </button>
          </div>
        </div>
        <div className={styles.adminHome_right}>
          <div className={styles.adminHome_right_works}>
            <h2 className={styles.adminHome_h2}>Список дел</h2>
            <div className={styles.adminHome_right_works_wrapper}>
              <div className={styles.adminHome_right_works_item}>
                <p className={styles.adminHome_p1}>Срочные задачи</p>
                <h2 className={styles.adminHome_numbers} style={{ color: '#CD0832' }}>
                  3
                </h2>
              </div>
              <div className={styles.adminHome_right_works_item}>
                <p className={styles.adminHome_p1}>Несрочные задачи</p>
                <h2 className={styles.adminHome_numbers}>7</h2>
              </div>
              <div className={styles.adminHome_right_works_item}>
                <p className={styles.adminHome_p1}>Все задачи</p>
                <h2 className={styles.adminHome_numbers}>10</h2>
              </div>
            </div>
          </div>
          <div className={styles.adminHome_right_goods}>
            <h2 className={styles.adminHome_h2}>Статусы товаров</h2>
            <div className={styles.adminHome_right_goods_wrapper}>
              <div className={styles.adminHome_right_goods_item}>
                <p className={styles.adminHome_p1}>
                  <span>Близки к исчерпанию</span>
                  <img alt={''} src={Infographic} />
                </p>
                <h2 className={styles.adminHome_numbers}>6</h2>
              </div>
              <div className={styles.adminHome_right_goods_item}>
                <p className={styles.adminHome_p1}>
                  <span>Товарные позиции</span>
                  <img alt={''} src={people} />
                </p>
                <h2 className={styles.adminHome_numbers}>86</h2>
              </div>
              <div className={styles.adminHome_right_goods_item}>
                <p className={styles.adminHome_p1}>
                  <span>Заказы к оформлению</span>
                  <img alt={''} src={cube} />
                </p>
                <h2 className={styles.adminHome_numbers}>4</h2>
              </div>
              <div className={styles.adminHome_right_goods_item}>
                <p className={styles.adminHome_p1}>
                  <span>Заказы в движении</span>
                  <img alt={''} src={clock} />
                </p>
                <h2 className={styles.adminHome_numbers}>10</h2>
              </div>
            </div>
          </div>
          <div className={styles.adminHome_right_goodStats}>
            <h2 className={styles.adminHome_h2}>Статистика по продажам</h2>
            <div className={styles.adminHome_right_goodStats_top}>
              <h3 className={styles.adminHome_h3}>Продажи</h3>
              <section className={styles.adminHome_right_goodStats_top_params}>
                <MonthsSelect options={months} />
                <Select options={[{ image: chart_line, value: 'chart' }]} />
                <button>...</button>
              </section>
            </div>
            <div className={styles.adminHome_right_chart}>
              <ChartComponent points={sellsPoints} />
              <p>Тыс. ₽</p>
            </div>
            <div className={styles.adminHome_right_goodStats_top}>
              <h3 className={styles.adminHome_h3}>Заказы</h3>
              <section className={styles.adminHome_right_goodStats_top_params}>
                <MonthsSelect options={months} />
                <Select options={[{ image: chart_line, value: 'chart' }]} />
                <button>...</button>
              </section>
            </div>
            <div className={styles.adminHome_right_chart}>
              <ChartComponent points={ordersPoints} />
              <p>Количество заказов</p>
            </div>
            <div className={styles.adminHome_right_goodStats_top}>
              <h3 className={styles.adminHome_h3}>Bозвраты</h3>
              <section className={styles.adminHome_right_goodStats_top_params}>
                <MonthsSelect options={months} />
                <Select options={[{ image: chart_line, value: 'chart' }]} />
                <button>...</button>
              </section>
            </div>
            <div className={styles.adminHome_right_chart}>
              <ChartComponent points={returnsPoints} />
              <p>Количество возвратов</p>
            </div>
          </div>
          <Link className={styles.adminHome_right_learnButton} to={'/admin/statistics'}>
            Изучить полную статистику
          </Link>
        </div>
      </div>
    </>
  )
}

const months = [
  { id: 1, value: 'January' },
  { id: 2, value: 'February' },
  { id: 3, value: 'March' },
  { id: 4, value: 'April' },
  { id: 5, value: 'May' },
  { id: 6, value: 'June' },
  { id: 7, value: 'July' },
  { id: 8, value: 'August' },
  { id: 9, value: 'September' },
  { id: 10, value: 'October' },
  { id: 11, value: 'November' },
  { id: 12, value: 'December' },
]

const menuItems = [
  { id: 1, label: 'Статистика', link: '/statistics' },
  { id: 2, label: 'Сотрудники', link: '/employees' },
  { id: 3, label: 'Клиенты', link: '/clients' },
  { id: 4, label: 'Новости', link: '/news' },
  { id: 5, label: 'Статьи', link: '/articles' },
  { id: 6, label: 'Заказы', link: '/orders' },
  { id: 7, label: 'Товары', link: '/products' },
]

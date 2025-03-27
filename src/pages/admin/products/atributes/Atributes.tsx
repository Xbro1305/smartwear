import { useEffect, useState } from 'react'
import styles from './Atributes.module.scss'
import { SeasonAttrCase, TargetGroups, Types, Brands } from './items'

export const Atributes = () => {
  const [active, setActive] = useState<string>('')
  const [checkedItem, setCheckedItem] = useState(menuItems[0])

  useEffect(() => {
    const items = menuItems.find(item => item.key === active) || menuItems[0]
    setCheckedItem(items)
  }, [active])

  return (
    <div className={styles.atributes}>
      <h1 id="h1">Характеристики товара</h1>
      <div className={styles.atributes_top}>
        <div className={styles.atributes_menu}>
          {menuItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActive(item.key)}
              className={`${styles.atributes_menu_item} ${active == item.key ? styles.atributes_menu_item_active : ''}`}
            >
              <h2>{item.title}</h2>
            </div>
          ))}
        </div>
        <div className={styles.atributes_menu}>
          <p style={{ width: '100%', height: '38px' }} className={`${styles.atributes_menu_item}`}>
            Простые атрибуты
          </p>
        </div>
      </div>
      {checkedItem?.component}
    </div>
  )
}

const menuItems = [
  {
    title: 'Виды изделий',
    key: '',
    id: 1,
    component: <Types />,
  },
  {
    title: 'Сезоны',
    key: 'seasons',
    id: 2,
    component: <SeasonAttrCase />,
  },
  {
    title: 'Целевые группы',
    key: 'targetGroups',
    id: 3,
    component: <TargetGroups />,
  },
  {
    title: 'Бренды',
    key: 'brands',
    id: 4,
    component: <Brands />,
  },
  // {
  //   title: 'Цвета',
  //   key: 'colors',
  //   id: 5,
  // },
  // {
  //   title: 'Размеры',
  //   key: 'sizes',
  //   id: 6,
  // },
  // {
  //   title: 'Длины изделий',
  //   key: 'lengths',
  //   id: 7,
  // },
  // {
  //   title: 'Коллекции',
  //   key: 'collections',
  //   id: 8,
  // },
]

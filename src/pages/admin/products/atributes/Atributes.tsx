import { useState } from 'react'
import styles from './Atributes.module.scss'
import { SeasonAttrCase, TargetGroups, Types, Brands, Colors } from './items'

export const Atributes = () => {
  const [active, setActive] = useState<keyof typeof menuItems>('Вид изделия')

  return (
    <div className={styles.atributes}>
      <h1 id="h1">Характеристики товара</h1>
      <div className={styles.atributes_top}>
        <div className={styles.atributes_menu}>
          {atributes
            .filter(i => i.isSystem)
            .map(item => (
              <div
                key={item.id}
                onClick={() => setActive(item.name)}
                className={`${styles.atributes_menu_item} ${active == item.name ? styles.atributes_menu_item_active : ''}`}
              >
                <h2>{item.name}</h2>
              </div>
            ))}
        </div>
        <div className={styles.atributes_menu}>
          <p style={{ width: '100%', height: '38px' }} className={`${styles.atributes_menu_item}`}>
            Простые атрибуты
          </p>
        </div>
      </div>
      {menuItems[active]}
    </div>
  )
}

const atributes = [
  {
    id: 1,
    name: 'Вид изделия',
    isSystem: true,
  },
  {
    id: 2,
    name: 'Сезон',
    isSystem: true,
  },
  {
    id: 3,
    name: 'Целевая группа',
    isSystem: true,
  },
  {
    id: 4,
    name: 'Бренд',
    isSystem: true,
  },
  {
    id: 5,
    name: 'Цвет',
    isSystem: true,
  },
  {
    id: 6,
    name: 'Размер',
    isSystem: true,
  },
  {
    id: 7,
    name: 'Длина изделия',
    isSystem: true,
  },
  {
    id: 8,
    name: 'Коллекция',
    isSystem: true,
  },
]

const menuItems: Record<string, JSX.Element> = {
  'Вид изделия': <Types id={1} />,
  Сезон: <SeasonAttrCase id={2} />,
  'Целевая группа': <TargetGroups id={3} />,
  Бренд: <Brands id={4} />,
  Цвет: <Colors id={5} />,
  Размер: <Types id={6} />,
  'Длина изделия': <Types id={7} />,
  Коллекция: <Types id={8} />,
}

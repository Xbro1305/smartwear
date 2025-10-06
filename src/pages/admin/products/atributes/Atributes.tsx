import styles from './Atributes.module.scss'
import {
  SeasonAttrCase,
  TargetGroups,
  Types,
  Brands,
  Colors,
  Sizes,
  Collections,
  Lengths,
} from './items'
import { useDispatch, useSelector } from 'react-redux'
import { setAttributePage } from '@/app/store/attributePageSlice'

export const Atributes = () => {
  // const [active, setActive] = useState(atributes[0].name)
  const dispatch = useDispatch<AppDispatch>()
  const attributePage = useSelector((state: RootState) => state.attributePage.value)
  const activeAttr = atributes.find(attr => attr.name === attributePage)

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
                onClick={() => dispatch(setAttributePage(item.name))}
                className={`${styles.atributes_menu_item} ${attributePage === item.name ? styles.atributes_menu_item_active : ''}`}
              >
                <h2>{item.name}</h2>
              </div>
            ))}
        </div>

        <div className={styles.atributes_menu}>
          <p style={{ width: '100%', height: '38px' }} className={styles.atributes_menu_item}>
            Простые атрибуты
          </p>
        </div>
      </div>

      {activeAttr?.component}
    </div>
  )
}

const atributes: {
  id: number
  name: string
  isSystem: boolean
  component: JSX.Element
}[] = [
  { id: 1, name: 'Вид изделия', isSystem: true, component: <Types id={1} /> },
  { id: 2, name: 'Сезон', isSystem: true, component: <SeasonAttrCase id={2} /> },
  { id: 3, name: 'Целевая группа', isSystem: true, component: <TargetGroups id={3} /> },
  { id: 4, name: 'Бренд', isSystem: true, component: <Brands id={4} /> },
  { id: 5, name: 'Цвет', isSystem: true, component: <Colors id={5} /> },
  { id: 6, name: 'Размер', isSystem: true, component: <Sizes /> },
  { id: 7, name: 'Длина изделия', isSystem: true, component: <Lengths /> },
  { id: 8, name: 'Коллекция', isSystem: true, component: <Collections /> },
]

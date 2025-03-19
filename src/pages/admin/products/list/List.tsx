import { useState } from 'react'
import styles from './List.module.scss'
import { CiSearch } from 'react-icons/ci'
import { FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa'
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu'
import { FilterSelector } from '../Components/FilterSelector/Selector'
import productImg from '@/assets/images/Ellipse 170.png'
import { Link } from 'react-router-dom'
import { ROUTER_PATHS } from '@/shared/config/routes'

interface Filters {
  gender?: { title: '' } | { title: 'Женский'; key: 'female' } | { title: 'Мужской'; key: 'male' }
  image?: { title: '' } | { title: 'Включено'; key: true } | { title: 'Отключено'; key: false }
  availability?:
    | { title: '' }
    | { title: 'В наличии'; key: true }
    | { title: 'Закончился'; key: false }
  season?:
    | { title: '' }
    | { title: 'Демисезон'; key: 'Демисезон' }
    | { title: 'Весна/Лето'; key: 'Весна/Лето' }
    | { title: 'Зима'; key: 'Зима' }
    | { title: 'Все сезоны'; key: 'Все сезоны' }
  status?: { title: '' } | { title: 'Включено'; key: true } | { title: 'Отключено'; key: false }
  warehouse?: { title: '' } | { title: string; key: string }
}

// {
//     "name": "Женская зимняя куртка LimoLady 3007",
//     "description": "Теплая куртка с водонепроницаемым покрытием",
//     "article": "12345678",
//     "status": "true",
//     "price": "5623",
//     "quantity": "87" ,
//   "category": "Одежда",
//   "featureIds": [
//     1,
//     2
//   ]
// }

const { CREATE_PRODUCT, EDIT_PRODUCT, PRODUCT } = ROUTER_PATHS

const items = [
  {
    name: 'Женская зимняя куртка LimoLady 3007',
    description: 'Теплая куртка с водонепроницаемым покрытием',
    article: String(Math.floor(Math.random() * 1000000)),
    id: String(Math.floor(Math.random() * 1000000)),
    status: Math.floor(Math.random() * 2),
    price: Math.floor(Math.random() * 10000),
    quantity: Math.floor(Math.random() * 100),
  },
  {
    name: 'Женская зимняя куртка LimoLady 3007',
    description: 'Теплая куртка с водонепроницаемым покрытием',
    article: String(Math.floor(Math.random() * 1000000)),
    id: String(Math.floor(Math.random() * 1000000)),
    status: Math.floor(Math.random() * 2),
    price: Math.floor(Math.random() * 10000),
    quantity: Math.floor(Math.random() * 100),
  },
  {
    name: 'Женская зимняя куртка LimoLady 3007',
    description: 'Теплая куртка с водонепроницаемым покрытием',
    article: String(Math.floor(Math.random() * 1000000)),
    id: String(Math.floor(Math.random() * 1000000)),
    status: 0,
    price: Math.floor(Math.random() * 10000),
    quantity: Math.floor(Math.random() * 100),
  },
  {
    name: 'Женская зимняя куртка LimoLady 3007',
    description: 'Теплая куртка с водонепроницаемым покрытием',
    article: String(Math.floor(Math.random() * 1000000)),
    id: String(Math.floor(Math.random() * 1000000)),
    status: Math.floor(Math.random() * 2),
    price: Math.floor(Math.random() * 10000),
    quantity: 5,
  },
  {
    name: 'Женская зимняя куртка LimoLady 3007',
    description: 'Теплая куртка с водонепроницаемым покрытием',
    article: String(Math.floor(Math.random() * 1000000)),
    id: String(Math.floor(Math.random() * 1000000)),
    status: 1,
    price: Math.floor(Math.random() * 10000),
    quantity: Math.floor(Math.random() * 100),
  },
]

export const ProductsList = () => {
  const [products, setProducts] = useState(items)
  const [searching, setSearching] = useState('')
  const [checked, setChecked] = useState<string[]>([])
  const [filters, setFilters] = useState<Filters>({
    gender: { title: '' },
    image: { title: '' },
    availability: { title: '' },
    season: { title: '' },
    status: { title: '' },
    warehouse: { title: '' },
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const handleFilterChange = (filter: keyof Filters, value: any) => {
    const newFilters = { ...filters }
    newFilters[filter] = value
    setFilters(newFilters)
  }

  const productsLength = products.length
  const spittedPL = productsLength.toString().split('').pop()

  const handleSort = (key: any) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })

    const sortedProducts = [...products].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })

    setProducts(sortedProducts)
  }

  return (
    <div className={styles.productsList}>
      <h1 id="h1">Товары</h1>
      <div className={styles.productsList_container}>
        <div className={styles.productsList_top}>
          <section>
            <Link to={CREATE_PRODUCT} id="admin-button">
              + Добавить товар
            </Link>
            <p id="b2">
              {products.length}{' '}
              {spittedPL == '1'
                ? 'товар'
                : spittedPL == '2' || spittedPL == '3' || spittedPL == '4'
                  ? 'товарa'
                  : 'товаров'}
            </p>
          </section>
          <section>
            <label className={styles.productsList_top_label}>
              <CiSearch />
              <input
                placeholder="Введи название, артикул"
                type="text"
                value={searching}
                onChange={e => setSearching(e.target.value)}
              />
              {searching && <p onClick={() => setSearching('')}>&times;</p>}
            </label>
            <button className={styles.productsList_top_filterButton}>
              <p onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <FaFilter />
                Фильтр
              </p>
              <FilterItems
                isFilterOpen={isFilterOpen}
                handleFilterChange={handleFilterChange}
                filters={filters}
              />
            </button>
            <button
              style={
                checked.length
                  ? {
                      background: '#FFF3F3',
                      color: 'var(--light-red)',
                      borderColor: 'var(--light-red)',
                    }
                  : {}
              }
              className={`${styles.productsList_top_deleteButton} ${styles.productsList_hoverItem}`}
            >
              <LuTrash2 />
              <i>Удалить выбранные</i>
            </button>
          </section>
        </div>
        <div className={styles.productsList_wrapper}>
          <div className={styles.productsList_wrapper_top}>
            <p>Название товара и фото</p>
            <p onClick={() => handleSort('article')}>
              Артикул{' '}
              {sortConfig.key === 'article' ? (
                sortConfig.direction === 'asc' ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )
              ) : (
                <FaChevronDown />
              )}
            </p>
            <p onClick={() => handleSort('status')}>
              Статус{' '}
              {sortConfig.key === 'status' ? (
                sortConfig.direction === 'asc' ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )
              ) : (
                <FaChevronDown />
              )}
            </p>
            <p onClick={() => handleSort('price')}>
              Цена на сайте{' '}
              {sortConfig.key === 'price' ? (
                sortConfig.direction === 'asc' ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )
              ) : (
                <FaChevronDown />
              )}
            </p>
            <p onClick={() => handleSort('quantity')}>
              Количество{' '}
              {sortConfig.key === 'quantity' ? (
                sortConfig.direction === 'asc' ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )
              ) : (
                <FaChevronDown />
              )}
            </p>
            <p></p>
          </div>
          <div className={styles.productsList_wrapper_bottom}>
            {products.map((i, index) => (
              <div key={index} className={styles.productsList_wrapper_item}>
                <label>
                  <input
                    onChange={e => {
                      if (e.target.checked == true) {
                        const newChecked = [...checked, i.article]
                        setChecked(newChecked)
                      } else {
                        const newChecked = checked.filter(item => item != i.article)
                        setChecked(newChecked)
                      }
                    }}
                    checked={checked.includes(i.article)}
                    type="checkbox"
                    name="item"
                    id="checkbox"
                  />
                  <img src={productImg} alt="" />
                  <p>{i.name}</p>
                </label>
                <label>{i.article}</label>
                <label style={{ color: i.status == 1 ? 'var(--green)' : '' }}>
                  {i.status == 1 ? 'Включено' : 'Отключено'}
                </label>
                <label>{i.price}</label>
                <label style={i.quantity < 10 ? { color: '#e02844', background: '#FFEFEF' } : {}}>
                  {i.quantity}
                </label>
                <section>
                  <button
                    style={{
                      background: '#FFF3F3',
                      color: 'var(--light-red)',
                      borderColor: 'var(--light-red)',
                    }}
                    className={`${styles.productsList_top_deleteButton} ${styles.productsList_hoverItem} `}
                  >
                    <LuTrash2 />
                    <i>Удалить товар</i>
                  </button>
                  <Link
                    to={`${EDIT_PRODUCT}/${i.id}`}
                    className={`${styles.productsList_top_deleteButton} ${styles.productsList_hoverItem} `}
                  >
                    <LuPencil />
                    <i>Редактировать</i>
                  </Link>
                  <Link
                    to={`${PRODUCT}/${i.article}`}
                    className={`${styles.productsList_top_deleteButton} ${styles.productsList_hoverItem} `}
                  >
                    <LuEye />
                    <i>Товар на сайте</i>
                  </Link>
                </section>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const FilterItems = ({
  filters,
  handleFilterChange,
  isFilterOpen,
}: {
  filters: Filters
  handleFilterChange: (filter: keyof Filters, value: any) => void
  isFilterOpen: boolean
}) => {
  return (
    <>
      <div
        className={`${styles.productsList_top_filterButton_child} ${isFilterOpen ? styles.productsList_top_filterButton_child_active : 'hidden'}`}
      >
        <label>
          <FilterSelector
            options={[
              { title: 'Мужской', key: 'male' },
              { title: 'Женский', key: 'female' },
            ]}
            isEmpty={filters.gender?.title === ''}
            value={filters.gender}
            onChange={value => handleFilterChange('gender', value)}
            title={'Пол'}
          />
        </label>
        <label>
          <FilterSelector
            options={[
              { title: 'Отключено', key: false },
              { title: 'Включено', key: true },
            ]}
            isEmpty={filters.image?.title === ''}
            value={filters.image}
            onChange={value => handleFilterChange('image', value)}
            title={'Изображение'}
          />
        </label>
        <label>
          <FilterSelector
            options={[
              { title: 'В наличии', key: true },
              { title: 'Закончился', key: false },
            ]}
            isEmpty={filters.availability?.title === ''}
            value={filters.availability}
            onChange={value => handleFilterChange('availability', value)}
            title={'Наличие'}
          />
        </label>
        <label>
          <FilterSelector
            options={[
              { title: 'Демисезон', key: 'Демисезон' },
              { title: 'Весна/Лето', key: 'Весна/Лето' },
              { title: 'Зима', key: 'Зима' },
              { title: 'Все сезоны', key: 'Все сезоны' },
            ]}
            isEmpty={filters.season?.title === ''}
            value={filters.season}
            onChange={value => handleFilterChange('season', value)}
            title={'Сезон'}
          />
        </label>
        <label className="col-span-2">
          <FilterSelector
            options={[
              { title: 'Включено', key: true },
              { title: 'Отключено', key: false },
            ]}
            isEmpty={filters.status?.title === ''}
            value={filters.status}
            onChange={value => handleFilterChange('status', value)}
            title={'Статус'}
          />
        </label>
        <label className="col-span-2">
          <FilterSelector
            options={[
              { title: 'Москва, дом 4', key: 'Москва, дом 4' },
              { title: 'Москва, дом 6', key: 'Москва, дом 6' },
            ]}
            isEmpty={filters.warehouse?.title === ''}
            value={filters.warehouse}
            onChange={value => handleFilterChange('warehouse', value)}
            title={'Склад'}
          />
        </label>
      </div>
    </>
  )
}

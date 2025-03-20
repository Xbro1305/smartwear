import { useEffect, useState } from 'react'
import styles from './List.module.scss'
import { CiSearch } from 'react-icons/ci'
import { FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa'
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu'
import { FilterSelector } from '../Components/FilterSelector/Selector'
import productImg from '@/assets/images/Ellipse 170.png'
import { Link } from 'react-router-dom'
import { ROUTER_PATHS } from '@/shared/config/routes'
import axios from 'axios'
import { toast } from 'react-toastify'

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

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
  description: string
  price: string | number
  articul: string
  imageUrl: null | string
  categoryId: number
  quantity: number
  status: boolean
  createdAt: string
  updatedAt: string
  category: Category
  features: {
    id: number
    productId: number
    featureId: number
    feature: {
      id: number
      name: string
      description: string
    }
  }[]
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

export const ProductsList = () => {
  const [items, setItems] = useState<Product[]>([])
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

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/products?categoryName=Одежда&page=1&limit=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        setItems(res.data)
        setProducts(res.data)
      })
      .catch(() => {
        toast.error('Ошибка при загрузке товаров')
      })
  }, [])

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
            {products &&
              products?.map((i, index) => (
                <div key={index} className={styles.productsList_wrapper_item}>
                  <label>
                    <input
                      onChange={e => {
                        if (e.target.checked == true) {
                          const newChecked = [...checked, i.articul]
                          setChecked(newChecked)
                        } else {
                          const newChecked = checked.filter(item => item != i.articul)
                          setChecked(newChecked)
                        }
                      }}
                      checked={checked.includes(i.articul)}
                      type="checkbox"
                      name="item"
                      id="checkbox"
                    />
                    <img src={productImg} alt="" />
                    <p>{i.name}</p>
                  </label>
                  <label>{i.articul}</label>
                  <label style={{ color: i.status == true ? 'var(--green)' : '' }}>
                    {i.status == true ? 'Включено' : 'Отключено'}
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
                      to={`${PRODUCT}/${i.articul}`}
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

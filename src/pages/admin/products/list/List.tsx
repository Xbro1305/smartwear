import { useEffect, useState } from 'react'
import styles from './List.module.scss'
import { CiSearch } from 'react-icons/ci'
import { FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa'
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu'
import { FilterSelector } from '../Components/FilterSelector/Selector'
// import productImg from '@/assets/images/Ellipse 170.png'
import { Link } from 'react-router-dom'
import { ROUTER_PATHS } from '@/shared/config/routes'
import axios from 'axios'
import { toast } from 'react-toastify'
import { type Attribute } from '../Create/CreateProduct'

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

interface Feature {
  id: number
  productId: number
  featureId: number
  feature: {
    id: number
    name: string
    description: string
  }
}

interface Product {
  seoSlug: any
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
  features: Feature[]
  media: { url: string; kind: string }[]
}

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
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

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
      let valA = a[key]
      let valB = b[key]

      if (valA == null) valA = ''
      if (valB == null) valB = ''

      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.trim().toLowerCase()
        valB = valB.trim().toLowerCase()
        return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }

      if (typeof valA === 'boolean') {
        valA = valA ? 1 : 0
        valB = valB ? 1 : 0
      }

      if (key === 'price') {
        valA = Number(valA)
        valB = Number(valB)
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1
      if (valA > valB) return direction === 'asc' ? 1 : -1
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

    document.title = 'Товары - Панель администратора'
  }, [])

  const deleteProduct = (id: number) => {
    axios(`${import.meta.env.VITE_APP_API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        setProducts(products.filter(product => product.id !== id))
        toast.success('Товар успешно удален')
        setDeletingId(null)
      })
      .catch(() => {
        toast.error('Ошибка при удалении товара')
      })
  }

  const handleDeleteSelected = () => {
    if (checked.length) {
      checked.forEach(id => {
        deleteProduct(Number(id))
        setIsDeleting(false)
        setChecked([])
      })
    } else {
      toast.error('Выберите товары для удаления')
    }
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
                  ? 'тoвapa'
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
              {isFilterOpen && (
                <div
                  className="z-40 fixed w-full h-screen top-[0] left-[0]"
                  onClick={() => setIsFilterOpen(false)}
                ></div>
              )}
              <FilterItems
                isFilterOpen={isFilterOpen}
                handleFilterChange={handleFilterChange}
                filters={filters}
              />
            </button>
            <button
              onClick={() => checked.length && setIsDeleting(true)}
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
          <div className={`overflow-y-auto ${styles.productsList_wrapper_top}`}>
            <p>Название товара и фото</p>
            <p>Артикул</p>
            <p onClick={() => handleSort('status')}>
              Статус
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
          <div className={`max-h-[400px] ${styles.productsList_wrapper_bottom}`}>
            {products &&
              products?.map((i, index) => (
                <div key={index} className={styles.productsList_wrapper_item}>
                  <label>
                    <input
                      onChange={e => {
                        if (e.target.checked == true) {
                          const newChecked = [...checked, i.id.toString()]
                          setChecked(newChecked)
                        } else {
                          const newChecked = checked.filter(item => item != i.id.toString())
                          setChecked(newChecked)
                        }
                      }}
                      checked={checked.includes(i.id.toString())}
                      type="checkbox"
                      name="item"
                      id="checkbox"
                    />
                    <img
                      src={i?.media?.find(m => m?.kind == 'cover')?.url || i?.media[0]?.url}
                      alt=""
                      className="w-[40px] aspect-square"
                      style={{
                        opacity:
                          i?.media?.find(m => m?.kind == 'cover')?.url || i?.media[0]?.url
                            ? '1'
                            : '0',
                      }}
                    />
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
                      onClick={() => setDeletingId(i.id)}
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
                      to={`${PRODUCT}/${i.seoSlug}`}
                      target="_blank"
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

      <div className={`${styles.deleteModal} ${isDeleting ? 'flex' : 'hidden'}`}>
        <div className={styles.deleteModal_body}>
          <h2 id="h2">Удалить выбранные товары?</h2>
          <p id="b2">Вы уверены, что хотите удалить выбранные товары?</p>
          <section className="ml-auto flex gap-[10px] mt-[20px]">
            <button
              onClick={() => setIsDeleting(false)}
              className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
            >
              Отмена
            </button>
            <button onClick={handleDeleteSelected} id="admin-button">
              Удалить
            </button>
          </section>
        </div>
      </div>

      <div className={`${styles.deleteModal} ${deletingId ? 'flex' : 'hidden'}`}>
        <div className={styles.deleteModal_body}>
          <h2 id="h2">Удалить товар?</h2>
          <p>Вы уверены, что хотите удалить товар?</p>
          <section className="ml-auto flex gap-[10px] mt-[20px]">
            <button
              onClick={() => setDeletingId(null)}
              className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
            >
              Отмена
            </button>
            <button onClick={() => deleteProduct(deletingId as number)} id="admin-button">
              Удалить
            </button>
          </section>
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
  const [stores, setStores] = useState<any[]>([])
  const [attributs, setAttributes] = useState<Attribute[]>([])
  const [openedFilter, setOpenedFilter] = useState<string | null>(null)

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/stores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        setStores(res.data)
      })
      .catch(() => {
        toast.error('Ошибка при загрузке товаров')
      })
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        setAttributes(res.data)
      })
      .catch(() => {
        toast.error('Ошибка при загрузке товаров')
      })
  }, [])

  return (
    <>
      <div
        className={`${styles.productsList_top_filterButton_child} ${isFilterOpen ? styles.productsList_top_filterButton_child_active : 'hidden'} z-50 relative`}
      >
        <label>
          <FilterSelector
            options={
              attributs
                .find(i => i.name == 'Целевая группа')
                ?.values.map(a => ({ title: a.value, key: a.id })) || []
            }
            isEmpty={filters.gender?.title === ''}
            value={filters.gender}
            onChange={value => handleFilterChange('gender', value)}
            title={'Пол'}
            onClick={() => setOpenedFilter(openedFilter === 'gender' ? null : 'gender')}
            isOpen={openedFilter === 'gender'}
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
            onClick={() => setOpenedFilter(openedFilter === 'image' ? null : 'image')}
            isOpen={openedFilter === 'image'}
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
            onClick={() => setOpenedFilter(openedFilter === 'stock' ? null : 'stock')}
            isOpen={openedFilter === 'stock'}
          />
        </label>
        <label>
          <FilterSelector
            options={
              attributs
                .find(i => i.name == 'Сезон')
                ?.values.map(a => ({ title: a.value, key: a.id })) || []
            }
            isEmpty={filters.season?.title === ''}
            value={filters.season}
            onChange={value => handleFilterChange('season', value)}
            title={'Сезон'}
            onClick={() => setOpenedFilter(openedFilter === 'season' ? null : 'season')}
            isOpen={openedFilter === 'season'}
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
            onClick={() => setOpenedFilter(openedFilter === 'status' ? null : 'status')}
            isOpen={openedFilter === 'status'}
          />
        </label>
        <label className="col-span-2">
          <FilterSelector
            options={stores?.map((s: any) => ({ title: s.name, key: s.id })) || []}
            isEmpty={filters.warehouse?.title === ''}
            value={filters.warehouse}
            onChange={value => handleFilterChange('warehouse', value)}
            title={'Склад'}
            onClick={() => setOpenedFilter(openedFilter === 'warehouse' ? null : 'warehouse')}
            isOpen={openedFilter === 'warehouse'}
          />
        </label>
      </div>
    </>
  )
}

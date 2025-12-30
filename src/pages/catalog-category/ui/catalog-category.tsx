/* eslint-disable react/jsx-key */
/* eslint-disable max-lines */
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { Link } from 'react-router-dom'
import { FaChevronDown } from 'react-icons/fa'

import banner from '@/assets/images/catalogBanner.svg'
// import item from '@/assets/images/homeCatalog.jpeg'
import heart from '@/assets/images/homeHeart.svg'
import { ROUTER_PATHS } from '@/shared/config/routes'

import styles from './catalog-category.module.scss'
import axios from 'axios'
import { IoMdSwitch } from 'react-icons/io'
import { HiOutlineSwitchVertical } from 'react-icons/hi'

type Color = {
  border: string
  name: string
  value: string
}

interface Props {
  data: any
}

const FilterBlock = ({
  title,
  isOpen,
  toggle,
  children,
}: {
  title: string
  isOpen: boolean
  toggle?: () => void
  children: React.ReactNode
}) => (
  <div className={styles.catalog_filter}>
    <div
      className={styles.catalog_filter_title}
      onClick={toggle}
      style={{ background: 'var(--gray)' }}
    >
      <h5 className={'h5'}>{title}</h5>
      {toggle && <FaChevronDown style={{ transform: isOpen ? '' : 'rotate(180deg)' }} />}
    </div>
    {isOpen && <div className={styles.catalog_filter_items}>{children}</div>}
  </div>
)
const Breadcrumbs = ({ data }: { data: any }) => {
  if (!data) return null

  const categories = [...(data?.ancestors || []), data?.current]

  let path = ''

  return (
    <nav className="flex gap-2 text-sm">
      {categories?.map((item, index) => {
        path += `/${item?.slug}`

        return (
          <span key={item?.id} className="flex items-center gap-2">
            <a href={path} className="text-blue-600 hover:underline">
              {item?.name}
            </a>
            {index < categories?.length - 1 && <span>&gt;</span>}
          </span>
        )
      })}
    </nav>
  )
}

export const CatalogCategory: React.FC<Props> = ({ data }) => {
  const [open, setOpen] = useState({
    category: true,
    season: true,
    brand: true,
    color: true,
    size: true,
    cloth: true,
    length: true,
  })

  const toggle = (key: keyof typeof open) => setOpen(prev => ({ ...prev, [key]: !prev[key] }))

  const [price, setPrice] = useState<number>(100000)

  const [brands, setBrands] = useState<{ id: number; name: string }[]>([])

  const [colors, _] = useState<Color[]>([
    { border: '#000', name: 'Черный', value: '#000000' },
    { border: 'var(--service)', name: 'Белый', value: '#FFFFFF' },
    { border: '#0000FF', name: 'Синий', value: '#0000FF' },
    { border: '#008000', name: 'Зеленый', value: '#008000' },
  ])
  const [sizes, ___] = useState(['40', '42', '44', '46'])
  const [clothes, __] = useState(['Вальтерм', 'Вальтерм + Файбертек', 'Файбертек', 'Гусиный пух'])
  const [lengths, ____] = useState(['до 80 (10)', '80-90 (4)', '90-100 (26)', '100-110 (23)'])

  const [category, setCategory] = useState<any>([])

  const url = window.location.pathname.split('/')
  const id = url[url.length - 1] // last

  useEffect(() => {
    window.scrollTo(0, 0)

    axios(`${import.meta.env.VITE_APP_API_URL}/categories/${id}`).then(r => setCategory(r.data))

    const b = data?.items?.reduce((acc: { id: number; name: string }[], item: any) => {
      if (!acc.some(brand => brand.id === item.brand.id)) {
        acc.push(item.brand)
      }
      return acc
    }, [])

    console.log(b)

    setBrands(b)
  }, [data])

  return (
    <div className={styles.catalog_page}>
      <div className={styles.catalog_top}>
        <div className={styles.catalog_top_banner}>
          <img src={banner} alt="" />
        </div>
        <div className={styles.catalog_top_navigation}>
          <p className="p1">
            <Breadcrumbs data={category} />
          </p>
        </div>
      </div>

      <div className={styles.catalog}>
        {/* LEFT */}
        <div className={styles.catalog_left}>
          <FilterBlock title="Категория" isOpen={open.category} toggle={() => toggle('category')}>
            {categories.map(i => (
              <label key={i.category}>
                <input type="checkbox" />
                <p className="p1">{i.title}</p>
              </label>
            ))}
          </FilterBlock>

          <FilterBlock title="Сезон" isOpen={open.season} toggle={() => toggle('season')}>
            {seasons.map(i => (
              <label key={i}>
                <input type="checkbox" />
                <p className="p1">{i}</p>
              </label>
            ))}
          </FilterBlock>

          <FilterBlock title="Бренды" isOpen={open.brand} toggle={() => toggle('brand')}>
            {brands.map(i => (
              <label key={i.id}>
                <input type="checkbox" />
                <p className="p1">{i.name}</p>
              </label>
            ))}
            {/* <span
              className="p2"
              style={{ color: 'var(--service)' }}
              onClick={() => setBrands([...brands])}
            >
              Показать все{' '}
              <span style={{ display: 'block', transform: 'rotate(90deg)' }}>{'>'}</span>
            </span> */}
          </FilterBlock>

          <FilterBlock title="Цена" isOpen>
            <section className={styles.catalog_filter_price}>
              <span className="p2" style={{ color: 'var(--service)' }}>
                от <NumericFormat value={2500} displayType="text" thousandSeparator=" " />
              </span>
              <span className="p2" style={{ color: 'var(--service)' }}>
                до <NumericFormat value={price} displayType="text" thousandSeparator=" " />
              </span>
            </section>
            <input
              type="range"
              min={2500}
              max={100000}
              step={500}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className={styles.catalog_filter_price_slider}
            />
          </FilterBlock>

          <FilterBlock title="Цвет" isOpen={open.color} toggle={() => toggle('color')}>
            {colors.map(i => (
              <label key={i.name}>
                <input type="checkbox" />
                <div
                  className={styles.catalog_filter_color}
                  style={{ background: i.value, borderColor: i.border }}
                />
                <p className="p1">{i.name}</p>
              </label>
            ))}
          </FilterBlock>

          <FilterBlock title="Размер одежды" isOpen={open.size} toggle={() => toggle('size')}>
            {sizes.map(i => (
              <label key={i}>
                <input type="checkbox" />
                <p className="p1">{i}</p>
              </label>
            ))}
          </FilterBlock>

          <FilterBlock title="Утеплитель" isOpen={open.cloth} toggle={() => toggle('cloth')}>
            {clothes.map(i => (
              <label key={i}>
                <input type="checkbox" />
                <p className="p1">{i}</p>
              </label>
            ))}
          </FilterBlock>

          <FilterBlock title="Диапазон длины" isOpen={open.length} toggle={() => toggle('length')}>
            {lengths.map(i => (
              <label key={i}>
                <input type="checkbox" />
                <p className="p1">{i}</p>
              </label>
            ))}
          </FilterBlock>
        </div>

        {/* RIGHT */}
        <div className={styles.catalog_right}>
          <div className={styles.catalog_right_top}>
            <div className={styles.catalog_right_top_header}>
              <div className={styles.catalog_right_top_title}>
                <h2 className="h1">{category?.current?.name || 'Каталог'}</h2>
                <p className="p1">{data.items.length} товара(ов)</p>
              </div>
              <div className={styles.catalog_right_top_mobile}>
                <p className="p2">
                  <IoMdSwitch /> Фильтры
                </p>
                <p className="p2">
                  <HiOutlineSwitchVertical />
                  Популярное
                </p>
              </div>

              <select>
                <option value="">Популярное</option>
                <option value="">Пo убыванию цены</option>
                <option value="">По возрастанию цены</option>
                <option value="">Сначала новые</option>
                <option value="">Сначала старые</option>
              </select>
            </div>
            <div className={styles.catalog_right_top_brands}>
              {category?.descendants?.map((b: any) => (
                <p key={b.id} className="p1">
                  <Link to={b.slug}>{b.name}</Link>
                </p>
              ))}
            </div>
          </div>
          <div className={styles.catalog_wrapper}>
            {data.items.map((i: any) => (
              <Link to={`/${i.slug}`} className={styles.catalog_item} key={i.name}>
                <img src={i.imageUrl} alt="" />
                <div className={styles.catalog_item_info}>
                  <div className={styles.catalog_item_top}>
                    <div className={styles.catalog_item_colors}>
                      {i.colors.map((c: any) => (
                        <div
                          key={c.id}
                          className={styles.catalog_item_color}
                          style={{ background: c.hexCode || '#eee' }}
                        ></div>
                      ))}
                    </div>
                    <img className={styles.catalog_item_heart} src={heart} alt="" />
                  </div>

                  <h5 className="h5">{i.name}</h5>

                  <div className={`${styles.catalog_item_prices}`}>
                    <NumericFormat
                      className="h5"
                      value={i.price}
                      displayType="text"
                      thousandSeparator=" "
                      suffix=" ₽"
                    />
                    {i.oldPrice && i.oldPrice > 0 && (
                      <>
                        <NumericFormat
                          className="h5 text-[#B0B7BF_!important] text-[80%_!important] line-through"
                          value={i.oldPrice}
                          displayType="text"
                          thousandSeparator=" "
                          suffix=" ₽"
                        />
                        <NumericFormat
                          className="h5 text-[var(--red)_!important]"
                          value={-((i.oldPrice * 100) / i.price - 100)}
                          displayType="text"
                          thousandSeparator=" "
                          suffix=" %"
                        />
                      </>
                    )}
                  </div>

                  <Link className="button" to={`/${i.slug}`}>
                    Подробнее
                  </Link>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ====== DATA ====== */

// const recomendations = [
//   {
//     colors: ['#849051', '#EFC7BD'],
//     img: item,
//     price: '24150',
//     oldPrice: '1500',
//     name: 'Женская демисезонная куртка limolady 3279',
//   },
// ]

const categories = [
  { category: 'men', link: ROUTER_PATHS.MEN, title: 'Мужчинам' },
  { category: 'women', link: ROUTER_PATHS.WOMEN, title: 'Женщинам' },
  { category: 'acs', link: ROUTER_PATHS.ACS, title: 'Аксессуары' },
]

const seasons = ['Весна/лето', 'Демисезон', 'Зима']

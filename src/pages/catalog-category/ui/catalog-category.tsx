/* eslint-disable react/jsx-key */
/* eslint-disable max-lines */
import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { Link, useNavigate } from 'react-router-dom'

import banner from '@/assets/images/catalogBanner.svg'
import item from '@/assets/images/homeCatalog.jpeg'
import heart from '@/assets/images/homeHeart.svg'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { FaChevronDown } from 'react-icons/fa'

import styles from './catalog-category.module.scss'

type Category = 'acs' | 'men' | 'women'

interface CatalogCategoryProps {
  category: Category
}

const categoryTitles: Record<Category, string> = {
  acs: 'Аксессуары',
  men: 'Мужчинам',
  women: 'Женщинам',
}

type Color = {
  border: string
  name: string
  value: string
}

export const CatalogCategory: React.FC<CatalogCategoryProps> = ({ category }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(true)
  const [isSeasonOpen, setIsSeasonOpen] = useState<boolean>(true)
  const [isBrandOpen, setIsBrandOpen] = useState<boolean>(true)
  const [isColorOpen, setIsColorOpen] = useState<boolean>(true)
  const [isSizesOpen, setIsSizesOpen] = useState<boolean>(true)
  const [isClothOpen, setIsClothOpen] = useState<boolean>(true)
  const [isLengthOpen, setIsLengthOpen] = useState<boolean>(true)
  const [price, setPrice] = useState<number | string>(100000)
  const [brands, setBrands] = useState<any>([
    'Autojack',
    'Nordwind',
    'Запорожец',
    'Технология комфорта',
  ])
  const [colors, setColors] = useState<Color[]>([
    { border: '#000000', name: 'Черный', value: '#000000' },
    { border: 'var(--service)', name: 'Белый', value: '#FFFFFF' },
    { border: '#0000FF', name: 'Синий', value: '#0000FF' },
    { border: '#008000', name: 'Зеленый', value: '#008000' },
  ])
  const [clothes, setClothes] = useState([
    'Вальтерм',
    'Вальтерм + Файбертек',
    'Файбертек',
    'Гусиный пух',
  ])
  const [sizes, setSizes] = useState(['40', '42', '44', '46'])
  const [lengths, setLengths] = useState(['до 80 (10)', '80-90 (4)', '90-100 (26)', '100-110 (23)'])

  const navigate = useNavigate()

  return (
    <div className={styles.catalog_page}>
      <div className={styles.catalog_top}>
        <div className={styles.catalog_top_banner}>
          <img alt={''} src={banner} />
        </div>
        <div className={styles.catalog_top_navigation}>
          <p className={'p1'}>Все категории {'>'} Зимняя одежда</p>
        </div>
      </div>
      <div className={styles.catalog}>
        <div className={styles.catalog_left}>
          <div className={styles.catalog_filter}>
            <div
              className={styles.catalog_filter_title}
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              style={{ background: 'var(--gray)' }}
            >
              <h5 className={'h5'}>Категория</h5>
              <FaChevronDown style={{ transform: isCategoryOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isCategoryOpen && (
              <div className={styles.catalog_filter_items}>
                {categories.map(i => (
                  <label onClick={() => navigate(i.link)}>
                    <input checked={category == i.category} name={i.category} type={'checkbox'} />
                    <p className={'p1'}>{i.title}</p>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className={styles.catalog_filter}>
            <div
              className={styles.catalog_filter_title}
              onClick={() => setIsSeasonOpen(!isSeasonOpen)}
              style={{ background: 'var(--gray)' }}
            >
              <h5 className={'h5'}>Сезон</h5>
              <FaChevronDown style={{ transform: isSeasonOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isSeasonOpen && (
              <div className={styles.catalog_filter_items}>
                {seasons.map(i => (
                  <label>
                    <input name={i} type={'checkbox'} />
                    <p className={'p1'}>{i}</p>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className={styles.catalog_filter}>
            <div
              className={styles.catalog_filter_title}
              onClick={() => setIsBrandOpen(!isBrandOpen)}
              style={{ background: 'var(--gray)' }}
            >
              <h5 className={'h5'}>Бренды</h5>
              <FaChevronDown style={{ transform: isBrandOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isBrandOpen && (
              <div className={styles.catalog_filter_items}>
                {brands.map((i: any) => (
                  <label>
                    <input name={i} type={'checkbox'} />
                    <p className={'p1'}>{i}</p>
                  </label>
                ))}
                <span
                  className={'p2 showmore'}
                  onClick={() => {
                    const showMoreElement = document.querySelector<HTMLSpanElement>('.showmore')

                    if (showMoreElement) {
                      showMoreElement.style.display = 'none'
                    }
                    setBrands([...brands, 'другие бренды'])
                  }}
                  style={{ color: 'var(--service)' }}
                >
                  Показать все{' '}
                  <span style={{ display: 'block', transform: 'rotate(90deg)' }}>{'>'}</span>
                </span>
              </div>
            )}
          </div>
          <div className={styles.catalog_filter}>
            <div className={styles.catalog_filter_title}>
              <h5 className={'h5'}>Цена</h5>
            </div>
            <div className={styles.catalog_filter_items}>
              <section className={styles.catalog_filter_price}>
                <span className={'p2'} style={{ color: 'var(--service)' }}>
                  от
                  <NumericFormat displayType={'text'} thousandSeparator={' '} value={2500} />
                </span>
                <span className={'p2'} style={{ color: 'var(--service)' }}>
                  до
                  <NumericFormat displayType={'text'} thousandSeparator={' '} value={price} />
                </span>
              </section>
              <input
                className={styles.catalog_filter_price_slider}
                max={100000}
                min={2500}
                onChange={e => {
                  setPrice(e.target.value)
                }}
                step={500}
                type={'range'}
                value={price}
              />
            </div>
          </div>
          <div className={styles.catalog_filter}>
            <div
              className={styles.catalog_filter_title}
              onClick={() => setIsColorOpen(!isColorOpen)}
            >
              <h5 className={'h5'}>Цвет</h5>
              <FaChevronDown style={{ transform: isColorOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isColorOpen && (
              <div className={styles.catalog_filter_items}>
                {colors.map((i: any) => (
                  <label style={{ gridTemplateColumns: '24p 24px 1fr !important' }}>
                    <input type={'checkbox'} />
                    <div
                      className={styles.catalog_filter_color}
                      style={{ background: i.value, borderColor: i?.border }}
                    ></div>
                    <p className={'p1'}>{i.name}</p>
                  </label>
                ))}
                <span
                  className={'p2 showmorecolors'}
                  onClick={() => {
                    const showMoreElement =
                      document.querySelector<HTMLSpanElement>('.showmorecolors')

                    if (showMoreElement) {
                      showMoreElement.style.display = 'none'
                    }
                    setColors([...colors, { border: '#000000', name: 'Черный', value: '#000000' }])
                  }}
                  style={{ color: 'var(--service)' }}
                >
                  Показать все{' '}
                  <span style={{ display: 'block', transform: 'rotate(90deg)' }}>{'>'}</span>
                </span>
              </div>
            )}
          </div>
          <div className={styles.catalog_filter}>
            <div
              className={styles.catalog_filter_title}
              onClick={() => setIsSizesOpen(!isSizesOpen)}
            >
              <h5 className={'h5'}>Размер одежды</h5>
              <FaChevronDown style={{ transform: isSizesOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isSizesOpen && (
              <div className={styles.catalog_filter_items}>
                {sizes.map((i: any) => (
                  <label>
                    <input name={i} type={'checkbox'} />
                    <p className={'p1'}>{i}</p>
                  </label>
                ))}
                <span
                  className={'p2 showmoresizes'}
                  onClick={() => {
                    const showMoreElement =
                      document.querySelector<HTMLSpanElement>('.showmoresizes')

                    if (showMoreElement) {
                      showMoreElement.style.display = 'none'
                    }
                    setSizes([...sizes, '50'])
                  }}
                  style={{ color: 'var(--service)' }}
                >
                  Показать все{' '}
                  <span style={{ display: 'block', transform: 'rotate(90deg)' }}>{'>'}</span>
                </span>
              </div>
            )}
          </div>
          <div className={styles.catalog_filter}>
            <div
              className={styles.catalog_filter_title}
              onClick={() => setIsClothOpen(!isClothOpen)}
            >
              <h5 className={'h5'}>Утеплитель</h5>
              <FaChevronDown style={{ transform: isClothOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isClothOpen && (
              <div className={styles.catalog_filter_items}>
                {clothes.map((i: any) => (
                  <label>
                    <input name={i} type={'checkbox'} />
                    <p className={'p1'}>{i}</p>
                  </label>
                ))}
                <span
                  className={'p2 showmoreclothes'}
                  onClick={() => {
                    const showMoreElement =
                      document.querySelector<HTMLSpanElement>('.showmoreclothes')

                    if (showMoreElement) {
                      showMoreElement.style.display = 'none'
                    }
                    setClothes([...clothes, 'ляляля'])
                  }}
                  style={{ color: 'var(--service)' }}
                >
                  Показать все{' '}
                  <span style={{ display: 'block', transform: 'rotate(90deg)' }}>{'>'}</span>
                </span>
              </div>
            )}
          </div>
          <div className={styles.catalog_filter}>
            <div
              className={styles.catalog_filter_title}
              onClick={() => setIsLengthOpen(!isLengthOpen)}
            >
              <h5 className={'h5'}>Диапазон длинны</h5>
              <FaChevronDown style={{ transform: isLengthOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isLengthOpen && (
              <div className={styles.catalog_filter_items}>
                {lengths.map((i: any) => (
                  <label>
                    <input name={i} type={'checkbox'} />
                    <p className={'p1'}>{i}</p>
                  </label>
                ))}
                <span
                  className={'p2 showmorelengths'}
                  onClick={() => {
                    const showMoreElement =
                      document.querySelector<HTMLSpanElement>('.showmorelengths')

                    if (showMoreElement) {
                      showMoreElement.style.display = 'none'
                    }
                    setLengths([...lengths, 'ляляля'])
                  }}
                  style={{ color: 'var(--service)' }}
                >
                  Показать все{' '}
                  <span style={{ display: 'block', transform: 'rotate(90deg)' }}>{'>'}</span>
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.catalog_right}>
          <div className={styles.catalog_top}>
            <section className={styles.catalog_top_title}>
              <h1 className={'h1'}>{categoryTitles[category]}</h1>
            </section>
          </div>
          <div className={styles.catalog_wrapper}>
            {recomendations.map(i => (
              <div className={styles.catalog_item}>
                <img alt={''} src={i.img} />
                <div className={styles.catalog_item_info}>
                  <div className={styles.catalog_item_top}>
                    <div className={styles.catalog_item_colors}>
                      {i.colors.map((c: string) => (
                        <div
                          className={styles.catalog_item_color}
                          style={{ background: `${c}` }}
                        ></div>
                      ))}
                    </div>
                    <img alt={''} src={heart} />
                  </div>
                  <h5 className={'h5'}>{i.title}</h5>
                  <section className={styles.catalog_item_prices}>
                    <NumericFormat
                      className={'h5'}
                      decimalSeparator={'.'}
                      displayType={'text'}
                      suffix={' ₽'}
                      thousandSeparator={' '}
                      value={i.price}
                    />
                  </section>
                  <Link className={'button'} to={''}>
                    Подробнее
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const recomendations = [
  {
    colors: ['#849051', '#EFC7BD'],
    img: item,
    price: 24150,
    sale: false,
    title: 'Женская демисезонная куртка limolady 3279',
  },
  {
    colors: ['#849051', '#EFC7BD'],
    img: item,
    price: 24150,
    sale: false,
    title: 'Женская демисезонная куртка limolady 3279',
  },
  {
    colors: ['#849051', '#EFC7BD'],
    img: item,
    price: 24150,
    sale: true,
    title: 'Женская демисезонная куртка limolady 3279',
  },
  {
    colors: ['#849051', '#EFC7BD'],
    img: item,
    price: 24150,
    sale: true,
    title: 'Женская демисезонная куртка limolady 3279',
  },
  {
    colors: ['#849051', '#EFC7BD'],
    img: item,
    price: 24150,
    sale: false,
    title: 'Женская демисезонная куртка limolady 3279',
  },
  {
    colors: ['#849051', '#EFC7BD'],
    img: item,
    price: 24150,
    sale: true,
    title: 'Женская демисезонная куртка limolady 3279',
  },
]

const categories = [
  { category: 'men', link: ROUTER_PATHS.MEN, title: 'Мужчинам' },
  { category: 'women', link: ROUTER_PATHS.WOMEN, title: 'Женщинам' },
  { category: 'acs', link: ROUTER_PATHS.ACS, title: 'Аксессуары' },
]

const seasons = ['Весна/лето', 'Демисезон', 'Зима']

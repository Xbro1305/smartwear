import { Link, useNavigate } from 'react-router-dom'
import banner from '@/assets/images/catalogBanner.svg'
import styles from './catalog-category.module.scss'
import { NumericFormat } from 'react-number-format'
import heart from '@/assets/images/homeHeart.svg'
import item from '@/assets/images/homeCatalog.jpeg'
import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { ROUTER_PATHS } from '@/shared/config/routes'

type Category = 'women' | 'men' | 'acs'

interface CatalogCategoryProps {
  category: Category
}

type Color = {
  name: string
  value: string
  border: string
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
    { name: 'Черный', value: '#000000', border: '#000000' },
    { name: 'Белый', value: '#FFFFFF', border: 'var(--service)' },
    { name: 'Синий', value: '#0000FF', border: '#0000FF' },
    { name: 'Зеленый', value: '#008000', border: '#008000' },
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
          <img src={banner} alt="" />
        </div>
        <div className={styles.catalog_top_navigation}>
          <p className="p1">Все категории {'>'} Зимняя одежда</p>
        </div>
      </div>
      <div className={styles.catalog}>
        <div className={styles.catalog_left}>
          <div className={styles.catalog_filter}>
            <div
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={styles.catalog_filter_title}
              style={{ background: 'var(--gray)' }}
            >
              <h5 className="h5">Категория</h5>
              <FaChevronDown style={{ transform: isCategoryOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isCategoryOpen && (
              <div className={styles.catalog_filter_items}>
                {categories.map(i => (
                  <label onClick={() => navigate(i.link)}>
                    <input checked={category == i.category} type="checkbox" name={i.category} />
                    <p className="p1">{i.title}</p>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className={styles.catalog_filter}>
            <div
              onClick={() => setIsSeasonOpen(!isSeasonOpen)}
              className={styles.catalog_filter_title}
              style={{ background: 'var(--gray)' }}
            >
              <h5 className="h5">Сезон</h5>
              <FaChevronDown style={{ transform: isSeasonOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isSeasonOpen && (
              <div className={styles.catalog_filter_items}>
                {seasons.map(i => (
                  <label>
                    <input type="checkbox" name={i} />
                    <p className="p1">{i}</p>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className={styles.catalog_filter}>
            <div
              onClick={() => setIsBrandOpen(!isBrandOpen)}
              className={styles.catalog_filter_title}
              style={{ background: 'var(--gray)' }}
            >
              <h5 className="h5">Бренды</h5>
              <FaChevronDown style={{ transform: isBrandOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isBrandOpen && (
              <div className={styles.catalog_filter_items}>
                {brands.map((i: any) => (
                  <label>
                    <input type="checkbox" name={i} />
                    <p className="p1">{i}</p>
                  </label>
                ))}
                <span
                  onClick={() => {
                    const showMoreElement = document.querySelector<HTMLSpanElement>('.showmore')
                    if (showMoreElement) showMoreElement.style.display = 'none'
                    setBrands([...brands, 'другие бренды'])
                  }}
                  className="p2 showmore"
                  style={{ color: 'var(--service)' }}
                >
                  Показать все{' '}
                  <span style={{ transform: 'rotate(90deg)', display: 'block' }}>{'>'}</span>
                </span>
              </div>
            )}
          </div>
          <div className={styles.catalog_filter}>
            <div className={styles.catalog_filter_title}>
              <h5 className="h5">Цена</h5>
            </div>
            <div className={styles.catalog_filter_items}>
              <section className={styles.catalog_filter_price}>
                <span className="p2" style={{ color: 'var(--service)' }}>
                  от
                  <NumericFormat value={2500} displayType="text" thousandSeparator={' '} />
                </span>
                <span className="p2" style={{ color: 'var(--service)' }}>
                  до
                  <NumericFormat value={price} displayType="text" thousandSeparator={' '} />
                </span>
              </section>
              <input
                type="range"
                min={2500}
                max={100000}
                value={price}
                step={500}
                className={styles.catalog_filter_price_slider}
                onChange={e => {
                  setPrice(e.target.value)
                }}
              />
            </div>
          </div>
          <div className={styles.catalog_filter}>
            <div
              onClick={() => setIsColorOpen(!isColorOpen)}
              className={styles.catalog_filter_title}
            >
              <h5 className="h5">Цвет</h5>
              <FaChevronDown style={{ transform: isColorOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isColorOpen && (
              <div className={styles.catalog_filter_items}>
                {colors.map((i: any) => (
                  <label style={{ gridTemplateColumns: '24p 24px 1fr !important' }}>
                    <input type="checkbox" />
                    <div
                      className={styles.catalog_filter_color}
                      style={{ background: i.value, borderColor: i?.border }}
                    ></div>
                    <p className="p1">{i.name}</p>
                  </label>
                ))}
                <span
                  onClick={() => {
                    const showMoreElement =
                      document.querySelector<HTMLSpanElement>('.showmorecolors')
                    if (showMoreElement) showMoreElement.style.display = 'none'
                    setColors([...colors, { name: 'Черный', value: '#000000', border: '#000000' }])
                  }}
                  className="p2 showmorecolors"
                  style={{ color: 'var(--service)' }}
                >
                  Показать все{' '}
                  <span style={{ transform: 'rotate(90deg)', display: 'block' }}>{'>'}</span>
                </span>
              </div>
            )}
          </div>
          <div className={styles.catalog_filter}>
            <div
              onClick={() => setIsSizesOpen(!isSizesOpen)}
              className={styles.catalog_filter_title}
            >
              <h5 className="h5">Размер одежды</h5>
              <FaChevronDown style={{ transform: isSizesOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isSizesOpen && (
              <div className={styles.catalog_filter_items}>
                {sizes.map((i: any) => (
                  <label>
                    <input type="checkbox" name={i} />
                    <p className="p1">{i}</p>
                  </label>
                ))}
                <span
                  onClick={() => {
                    const showMoreElement =
                      document.querySelector<HTMLSpanElement>('.showmoresizes')
                    if (showMoreElement) showMoreElement.style.display = 'none'
                    setSizes([...sizes, '50'])
                  }}
                  className="p2 showmoresizes"
                  style={{ color: 'var(--service)' }}
                >
                  Показать все{' '}
                  <span style={{ transform: 'rotate(90deg)', display: 'block' }}>{'>'}</span>
                </span>
              </div>
            )}
          </div>
          <div className={styles.catalog_filter}>
            <div
              onClick={() => setIsClothOpen(!isClothOpen)}
              className={styles.catalog_filter_title}
            >
              <h5 className="h5">Утеплитель</h5>
              <FaChevronDown style={{ transform: isClothOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isClothOpen && (
              <div className={styles.catalog_filter_items}>
                {clothes.map((i: any) => (
                  <label>
                    <input type="checkbox" name={i} />
                    <p className="p1">{i}</p>
                  </label>
                ))}
                <span
                  onClick={() => {
                    const showMoreElement =
                      document.querySelector<HTMLSpanElement>('.showmoreclothes')
                    if (showMoreElement) showMoreElement.style.display = 'none'
                    setClothes([...clothes, 'ляляля'])
                  }}
                  className="p2 showmoreclothes"
                  style={{ color: 'var(--service)' }}
                >
                  Показать все{' '}
                  <span style={{ transform: 'rotate(90deg)', display: 'block' }}>{'>'}</span>
                </span>
              </div>
            )}
          </div>
          <div className={styles.catalog_filter}>
            <div
              onClick={() => setIsLengthOpen(!isLengthOpen)}
              className={styles.catalog_filter_title}
            >
              <h5 className="h5">Диапазон длинны</h5>
              <FaChevronDown style={{ transform: isLengthOpen ? '' : 'rotate(180deg)' }} />
            </div>
            {isLengthOpen && (
              <div className={styles.catalog_filter_items}>
                {lengths.map((i: any) => (
                  <label>
                    <input type="checkbox" name={i} />
                    <p className="p1">{i}</p>
                  </label>
                ))}
                <span
                  onClick={() => {
                    const showMoreElement =
                      document.querySelector<HTMLSpanElement>('.showmorelengths')
                    if (showMoreElement) showMoreElement.style.display = 'none'
                    setLengths([...lengths, 'ляляля'])
                  }}
                  className="p2 showmorelengths"
                  style={{ color: 'var(--service)' }}
                >
                  Показать все{' '}
                  <span style={{ transform: 'rotate(90deg)', display: 'block' }}>{'>'}</span>
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.catalog_right}>
          <div className={styles.catalog_top}>
            <section className={styles.catalog_top_title}>
              <h1 className="h1">Женщинам</h1>
            </section>
          </div>
          <div className={styles.catalog_wrapper}>
            {recomendations.map(i => (
              <div className={styles.catalog_item}>
                <img src={i.img} alt="" />
                <div className={styles.catalog_item_info}>
                  <div className={styles.catalog_item_top}>
                    <div className={styles.catalog_item_colors}>
                      {i.colors.map((c: string) => (
                        <div
                          style={{ background: `${c}` }}
                          className={styles.catalog_item_color}
                        ></div>
                      ))}
                    </div>
                    <img src={heart} alt="" />
                  </div>
                  <h5 className="h5">{i.title}</h5>
                  <section className={styles.catalog_item_prices}>
                    <NumericFormat
                      displayType="text"
                      className="h5"
                      value={i.price}
                      decimalSeparator="."
                      thousandSeparator=" "
                      suffix=" ₽"
                    />
                  </section>
                  <Link to={''} className="button">
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
    img: item,
    colors: ['#849051', '#EFC7BD'],
    title: 'Женская демисезонная куртка limolady 3279',
    price: 24150,
    sale: false,
  },
  {
    img: item,
    colors: ['#849051', '#EFC7BD'],
    title: 'Женская демисезонная куртка limolady 3279',
    price: 24150,
    sale: false,
  },
  {
    img: item,
    colors: ['#849051', '#EFC7BD'],
    title: 'Женская демисезонная куртка limolady 3279',
    price: 24150,
    sale: true,
  },
  {
    img: item,
    colors: ['#849051', '#EFC7BD'],
    title: 'Женская демисезонная куртка limolady 3279',
    price: 24150,
    sale: true,
  },
  {
    img: item,
    colors: ['#849051', '#EFC7BD'],
    title: 'Женская демисезонная куртка limolady 3279',
    price: 24150,
    sale: false,
  },
  {
    img: item,
    colors: ['#849051', '#EFC7BD'],
    title: 'Женская демисезонная куртка limolady 3279',
    price: 24150,
    sale: true,
  },
]

const categories = [
  { link: ROUTER_PATHS.MEN, title: 'Мужчинам', category: 'men' },
  { link: ROUTER_PATHS.WOMEN, title: 'Женщинам', category: 'women' },
  { link: ROUTER_PATHS.ACS, title: 'Аксессуары', category: 'acs' },
]

const seasons = ['Весна/лето', 'Демисезон', 'Зима']

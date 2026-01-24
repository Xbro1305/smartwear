/* eslint-disable react/jsx-key */
/* eslint-disable max-lines */
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { Link, useSearchParams } from 'react-router-dom'
import { FaChevronDown } from 'react-icons/fa'
import banner from '@/assets/images/catalogBanner.svg'
import heart from '@/assets/images/homeHeart.svg'
import styles from './catalog-category.module.scss'
import axios from 'axios'
import { IoMdSwitch } from 'react-icons/io'
import { HiOutlineSwitchVertical } from 'react-icons/hi'
import { CustomSelect } from '@/widgets/customSelect/select'

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

  return (
    <div className="flex gap-2 text-sm">
      {categories?.map((item, index) => {
        return (
          <span key={item?.id} className="flex items-center gap-2">
            <a href={item?.slug} className="text-blue-600 hover:underline">
              {item?.name}
            </a>
            {index < categories?.length - 1 && <span>&gt;</span>}
          </span>
        )
      })}
    </div>
  )
}

export const CatalogCategory: React.FC<Props> = ({ data }) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [category, setCategory] = useState<any>([])
  const [filters, setFilters] = useState<any>([])
  const [isSaled, setIsSaled] = useState<boolean>(false)
  const [colorIds, setColorIds] = useState<any>()
  const [sizeIds, setSizeIds] = useState<any>()
  const [items, setItems] = useState<any>([])
  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [minPrice, setMinPrice] = useState<number>(0)

  const toggleFilter = (id: number) =>
    setClosedFilters(prev =>
      prev?.includes(id) ? prev.filter(n => n != id) : [...(prev || []), id]
    )

  const toggleFilterValue = (id: number) =>
    setFilterIds(prev => (prev?.includes(id) ? prev.filter(n => n != id) : [...(prev || []), id]))

  const [filterIds, setFilterIds] = useState<number[]>()
  const [price, setPrice] = useState<number>(100000)
  const [debouncedPrice, setDebouncedPrice] = useState(price)
  const [closedFilters, setClosedFilters] = useState<number[]>()
  const [sort, setSort] = useState<string>()
  const [stores, setStores] = useState<any>()

  const url = window.location.pathname

  // Get attribute ids from query

  useEffect(() => {
    const ids = searchParams.get('attributeIds')

    if (!ids) return

    const parsed = ids.split(',').map(Number).filter(Boolean)

    setFilterIds(parsed)
  }, [])

  // set attribute ids to query

  useEffect(() => {
    const params = new URLSearchParams(searchParams)

    if (filterIds?.length) {
      params.set('attributeIds', filterIds.join(','))
    } else {
      params.delete('attributeIds')
    }

    params.set('priceTo', price.toString())

    setSearchParams(params, { replace: true })
  }, [filterIds, price])

  // parsing price

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPrice(price)
    }, 500)

    return () => clearTimeout(timer)
  }, [price])

  // getting by filters

  useEffect(() => {
    if (!category) return

    const query = filterIds?.length ? `&attributeValueIds=${filterIds.join(',')}` : ''
    const sizesQuery = sizeIds?.length ? `&sizeIds=${sizeIds.join(',')}` : ''
    const colorsQuery = colorIds?.length ? `&colorIds=${colorIds.join(',')}` : ''
    const saled = isSaled ? '&isDiscounted=true' : ''

    axios
      .get(
        `${import.meta.env.VITE_APP_API_URL}/catalog/products?category=${url}${saled}${query}&priceTo=${debouncedPrice}${sizesQuery}${colorsQuery}`
      )
      .then(res => {
        setItems(res.data.items)
      })
  }, [filterIds, debouncedPrice, category, sizeIds, colorIds, isSaled])

  // sorting by price/ date

  useEffect(() => {
    if (!category) return

    const newItems = [...items]

    if (sort === 'price_down') {
      newItems.sort((a, b) => b.price - a.price)
    } else if (sort === 'price_up') {
      newItems.sort((a, b) => a.price - b.price)
    } else if (sort === 'new_first') {
      newItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sort === 'old_first') {
      newItems.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }
    setItems(newItems)
  }, [sort])

  // getting category information, attributes

  useEffect(() => {
    window.scrollTo(0, 0)

    axios(`${import.meta.env.VITE_APP_API_URL}/categories/by-slug?slug=${url}`).then(res => {
      setCategory(res.data)
      const title = res.data.current.metaTitle
      document.title = title
    })

    setMaxPrice(data.facets.price.max)
    setPrice(data.facets.price.max)
    setMinPrice(data.facets.price.min)

    setItems(data.items)

    axios(`${import.meta.env.VITE_APP_API_URL}/attributes`)
      .then(res => {
        const attrs: any = res.data
        const available = data?.facets?.available

        const availableAttributes = attrs
          .filter((attr: any) => attr.name != 'Коллекция')
          .filter((attr: any) => available.some((a: any) => a.attributeId === attr.id))
          .map((attr: any) => {
            const availableAttr = available.find((a: any) => a.attributeId === attr.id)

            return {
              ...attr,
              values: attr.values.filter((v: any) => availableAttr?.valueIds.includes(v.id)),
            }
          })

        setFilters(availableAttributes)
      })
      .catch(err => console.log(err))

    axios(`${import.meta.env.VITE_APP_API_URL}/stores`)
      .then(res => {
        setStores(res.data)
      })
      .catch(err => console.log(err))
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
          {filters.slice(0, 2).map((attr: any) => (
            <div key={attr.id}>
              <FilterBlock
                title={attr.name}
                isOpen={!closedFilters?.includes(attr.id)}
                toggle={() => toggleFilter(attr.id)}
              >
                {attr.values.map((i: any) => (
                  <label key={i.id}>
                    <input
                      type="checkbox"
                      checked={filterIds?.includes(i.id)}
                      onChange={() => toggleFilterValue(i.id)}
                    />
                    <p className="p1">{i.value}</p>
                  </label>
                ))}
              </FilterBlock>
            </div>
          ))}
          <FilterBlock title="Цена" isOpen>
            <section className={styles.catalog_filter_price}>
              <span className="p2" style={{ color: 'var(--service)' }}>
                от <NumericFormat value={minPrice} displayType="text" thousandSeparator=" " />
              </span>
              <span className="p2" style={{ color: 'var(--service)' }}>
                до <NumericFormat value={price} displayType="text" thousandSeparator=" " />
              </span>
            </section>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={100}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className={styles.catalog_filter_price_slider}
            />
            <label>
              <input type="checkbox" checked={isSaled} onChange={() => setIsSaled(!isSaled)} />
              <p className="p1">Со скидкой</p>
            </label>
          </FilterBlock>
          <FilterBlock
            title="Размеры"
            isOpen={!closedFilters?.includes(-2)}
            toggle={() => toggleFilter(-2)}
          >
            {data.facets.sizes
              .sort((a: any, b: any) => a.orderNum - b.orderNum)
              .map((i: any) => (
                <label key={i.id}>
                  <input
                    type="checkbox"
                    checked={sizeIds?.includes(i.id)}
                    onChange={() =>
                      setSizeIds((prev: any) =>
                        prev?.includes(i.id)
                          ? prev.filter((n: any) => n != i.id)
                          : [...(prev || []), i.id]
                      )
                    }
                  />
                  <p className="p1">{i.value}</p>
                </label>
              ))}
          </FilterBlock>{' '}
          <FilterBlock
            title="Цвет изделия"
            isOpen={!closedFilters?.includes(-2)}
            toggle={() => toggleFilter(-2)}
          >
            {data.facets.colors.map((i: any) => (
              <label key={i.id}>
                <input
                  type="checkbox"
                  checked={colorIds?.includes(i.id)}
                  onChange={() => {
                    setColorIds((prev: any) =>
                      prev?.includes(i.id)
                        ? prev.filter((n: any) => n != i.id)
                        : [...(prev || []), i.id]
                    )
                  }}
                />
                <p className="p1">{i.value}</p>
              </label>
            ))}
          </FilterBlock>
          {filters.slice(2, filters.length).map((attr: any) => (
            <div key={attr.id}>
              <FilterBlock
                title={attr.name}
                isOpen={!closedFilters?.includes(attr.id)}
                toggle={() => toggleFilter(attr.id)}
              >
                {attr.values.map((i: any) => (
                  <label key={i.id}>
                    <input
                      type="checkbox"
                      checked={filterIds?.includes(i.id)}
                      onChange={() => toggleFilterValue(i.id)}
                    />
                    <p className="p1">{i.value}</p>
                  </label>
                ))}
              </FilterBlock>
            </div>
          ))}
          <FilterBlock
            title="Наличие в магазинах"
            isOpen={!closedFilters?.includes(-1)}
            toggle={() => toggleFilter(-1)}
          >
            {stores
              ?.map((s: any) => ({ name: s.name, id: s.id, address: s.address }))
              .map((i: any) => (
                <label key={i.id}>
                  <input type="checkbox" />
                  <p className="p1">
                    {i.name} - {i.address}
                  </p>
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
                <p className="p1">{items.length} товара(ов)</p>
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

              <CustomSelect
                options={[
                  {
                    id: '',
                    value: 'Популярное',
                  },
                  {
                    id: 'price_down',
                    value: 'Пo убыванию цены',
                  },
                  {
                    id: 'price_up',
                    value: 'По возрастанию цены',
                  },
                  {
                    id: 'new_first',
                    value: 'Сначала новые',
                  },
                  {
                    id: 'old_first',
                    value: 'Сначала старые',
                  },
                ]}
                onSelect={(option: any) => setSort(option.id)}
              />
            </div>
            <div className={styles.catalog_right_top_brands}>
              {category?.descendants
                ?.filter((c: any) => c.parentId == category.current?.id)
                ?.map((b: any) => (
                  <p key={b.id} className="p1">
                    <Link to={b.slug}>{b.name}</Link>
                  </p>
                ))}
            </div>
          </div>
          <div className={styles.catalog_wrapper}>
            {items.map((i: any) => {
              const imageUrl = i.media.find((m: any) => m.kind === 'cover')?.url || ''

              const colors = Object.values(
                i.variants.reduce((acc: any, variant: any) => {
                  const color = variant.colorAttrValue
                  if (!color) return acc

                  acc[color.id] = color
                  return acc
                }, {})
              )

              return (
                <Link
                  to={`/${i.seoSlug}`}
                  state={{ breadcrumbs: [...(category?.ancestors || []), category?.current] }}
                  className={styles.catalog_item}
                  key={i.name}
                >
                  <img src={imageUrl} alt="" />
                  <div className={styles.catalog_item_info}>
                    <div className={styles.catalog_item_top}>
                      <div className={styles.catalog_item_colors}>
                        {colors?.map((c: any) => (
                          <div
                            key={c.id}
                            className={styles.catalog_item_color}
                            style={{ background: c.meta.colorCode || '#eee' }}
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
                      {i.oldPrice > 0 && (
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
                            value={-((i.oldPrice * 100) / i.price - 100).toFixed(0)}
                            displayType="text"
                            thousandSeparator=" "
                            suffix=" %"
                          />
                        </>
                      )}
                    </div>

                    <Link
                      className="button"
                      to={`/${i.seoSlug}`}
                      state={{ breadcrumbs: [...(category?.ancestors || []), category?.current] }}
                    >
                      Подробнее
                    </Link>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

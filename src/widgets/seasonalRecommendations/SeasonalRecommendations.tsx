import { useEffect, useRef, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { Link } from 'react-router-dom'
import { IoFlame } from 'react-icons/io5'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'

const API_URL = import.meta.env.VITE_APP_API_URL

type Product = {
  id: number
  name: string
  price: string | number
  oldPrice?: string | number
  seoSlug?: string
  media?: { url: string; kind: string }[]
  variants?: { colorAttrValue?: { meta?: { colorCode?: string } } }[]
}

const cover = (p: Product) => p.media?.find(m => m.kind === 'cover')?.url || p.media?.[0]?.url || ''
const productColors = (p: Product) => {
  const seen = new Set<string>()
  ;(p.variants || []).forEach(v => {
    const c = v.colorAttrValue?.meta?.colorCode
    if (c) seen.add(c)
  })
  return [...seen].slice(0, 4)
}

const SIDE = 'px-[var(--sides-padding)]'

type Props = {
  /** заголовок блока */
  title?: string
  /** добавлять горизонтальные отступы страницы (для главной), false — если родитель уже с паддингом */
  withSide?: boolean
  /** сколько товаров показывать (главная/о-нас — 6, карточка товара — 3) */
  limit?: number
  /** доп. параметры фильтра к /products (напр. пол/сезон для карточки товара) */
  queryParams?: string
}

/**
 * Блок «Сезонные рекомендации» — последние добавленные товары.
 * ≥1025px — сетка 3 в ряд; ≤1024px (планшет/моб.) — карусель со стрелками (ТЗ 10, п.12/23).
 * Карточки одинаковой высоты, кнопки «Подробнее» выровнены в один уровень.
 */
export const SeasonalRecommendations = ({
  title = 'Сезонные рекомендации',
  withSide = true,
  limit = 6,
  queryParams = '',
}: Props) => {
  const [products, setProducts] = useState<Product[]>([])
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollBy = (dir: -1 | 1) =>
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })

  useEffect(() => {
    fetch(`${API_URL}/products?page=1&limit=${limit}${queryParams}`)
      .then(r => r.json())
      .then(d => setProducts(Array.isArray(d) ? d.slice(0, limit) : []))
      .catch(() => setProducts([]))
  }, [limit, queryParams])

  return (
    <section className={`flex flex-col gap-[24px] ${withSide ? SIDE : ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="h2">{title}</h2>
        {/* стрелки — только в режиме карусели (≤1024px) */}
        <div className="flex gap-[10px] min-[1025px]:hidden">
          <button
            aria-label="Назад"
            onClick={() => scrollBy(-1)}
            className="flex h-[44px] w-[44px] items-center justify-center text-[20px] hover:bg-[#F5F5F5]"
          >
            <BsChevronLeft />
          </button>
          <button
            aria-label="Вперёд"
            onClick={() => scrollBy(1)}
            className="flex h-[44px] w-[44px] items-center justify-center text-[20px] hover:bg-[#F5F5F5]"
          >
            <BsChevronRight />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="grid grid-cols-3 gap-[24px] max-[1024px]:flex max-[1024px]:snap-x max-[1024px]:gap-[14px] max-[1024px]:overflow-x-auto max-[1024px]:overflow-y-hidden max-[1024px]:scroll-smooth max-[1024px]:pb-[6px] max-[1024px]:[scrollbar-width:none] max-[1024px]:[&::-webkit-scrollbar]:hidden"
      >
        {products.map(p => {
          const colors = productColors(p)
          const hasSale = Number(p.oldPrice) > Number(p.price)
          return (
            <Link
              key={p.id}
              to={`/${p.seoSlug ?? ''}`}
              className="flex h-full flex-col no-underline max-[1024px]:w-[260px] max-[1024px]:shrink-0 max-[1024px]:snap-start"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-[#F5F5F5]">
                {cover(p) && (
                  <img src={cover(p)} alt={p.name} className="h-full w-full object-cover" />
                )}
                {hasSale && (
                  <span className="absolute left-[10px] top-[10px] rounded-[16px] bg-white px-[10px] py-[4px] p2 text-[var(--red)_!important] flex items-center gap-[4px] shadow-sm">
                    <IoFlame /> Распродажа
                  </span>
                )}
              </div>
              {/* точки цветов слева — под фото */}
              <div className="mt-[10px] flex items-center justify-between">
                <div className="flex gap-[6px]">
                  {colors.map((c, i) => (
                    <span
                      key={i}
                      className="h-[16px] w-[16px] md:h-[32px] md:w-[32px] rounded-full border border-[#E5E5E5]"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
              {/* максимум 3 строки, дальше многоточие — одинаковая высота карточек */}
              <h5 className="mt-[10px] h5 leading-[22px] text-[#4D4E50] line-clamp-3">{p.name}</h5>
              <div className="mt-[8px] flex items-center gap-[8px]">
                <NumericFormat
                  className="h5 text-[#1A1A1A]"
                  value={p.price}
                  displayType="text"
                  thousandSeparator=" "
                  suffix=" ₽"
                />
                {hasSale && (
                  <NumericFormat
                    className="text-[15px] text-[#B0B7BF] line-through"
                    value={p.oldPrice}
                    displayType="text"
                    thousandSeparator=" "
                    suffix=" ₽"
                  />
                )}
              </div>
              {/* mt-auto прижимает кнопку к низу — во всех карточках на одном уровне */}
              <div className="mt-auto pt-[12px]">
                <span className="button w-fit">Подробнее</span>
              </div>
            </Link>
          )
        })}
        {products.length === 0 && (
          <p className="p1 text-[var(--service)]">Товары скоро появятся</p>
        )}
      </div>
    </section>
  )
}

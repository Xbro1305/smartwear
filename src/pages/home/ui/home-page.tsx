/* eslint-disable max-lines */
import { useEffect, useRef, useState, type RefObject } from 'react'
import { NumericFormat } from 'react-number-format'
import { Link } from 'react-router-dom'
import { BsGrid, BsTag, BsStars, BsTruck } from 'react-icons/bs'

import { useGetArticlesBySectionQuery } from '@/entities/article'
import { Section } from '@/entities/article/article.types'

// ── Ассеты (src/assets/home) ──
import banner1 from '@/assets/home/banner-1.png'
import banner2 from '@/assets/home/banner-2.png'
import banner3 from '@/assets/home/banner-3.png'
import banner4 from '@/assets/home/banner-4.png'
import banner5 from '@/assets/home/banner-5.png'
import banner6 from '@/assets/home/banner-6.png'
import banner7 from '@/assets/home/banner-7.png'
import brands from '@/assets/home/brands.png'
import catWomen from '@/assets/home/cat-women.png'
import catMen from '@/assets/home/cat-men.png'
import catAccessories from '@/assets/home/cat-accerssories.png'
import catSale from '@/assets/home/cat-sales.png'
import saleBanner from '@/assets/home/sale-women.png'
import tileClimate from '@/assets/home/tile-climate.png'
import tileWash from '@/assets/home/tile-wash.png'
import tileMaterials from '@/assets/home/tile-materials.png'
import tileDelivery from '@/assets/home/tile-delivery.png'
import infoShop from '@/assets/home/info-shop.svg'
import infoDelivery from '@/assets/home/info-delivery.svg'
import infoRepair from '@/assets/home/info-repair.svg'
import infoPay from '@/assets/home/info-pay.svg'
import { IoFlame } from 'react-icons/io5'

const API_URL = import.meta.env.VITE_APP_API_URL
const BANNER_MS = 30000

const bannerImages = [banner1, banner2, banner3, banner4, banner5, banner6, banner7]

// 6.3 — программный блок категорий
const bigCats = [
  { label: 'Женщинам', to: '/women', img: catWomen },
  { label: 'Мужчинам', to: '/men', img: catMen },
]
const smallCats = [
  {
    label: 'Аксессуары',
    note: 'Мужские и женские тёплые аксессуары',
    to: '/accessories',
    img: catAccessories,
  },
  { label: 'Распродажа?', note: 'Скидки на товары прошлых сезонов', to: '/sale', img: catSale },
]
const quickIcons = [
  { icon: <BsGrid />, label: 'Каталог', to: '/catalog' },
  { icon: <BsTag />, label: 'Скидки', to: '/sale' },
  { icon: <BsStars />, label: 'Новинки', to: '/new' },
  { icon: <BsTruck />, label: 'Доставка', to: '/delivery' },
]

// 6.6 — плитки статей о важном
const tiles = [
  { title: 'Климат-контроль', to: '/climate-control', img: tileClimate, scale: 1.5 },
  { title: 'Как стирать', to: '/kak-stirat-odezhdu-s-klimat-kontrolem', img: tileWash, scale: 1.1 },
  { title: 'Материалы', to: '/autojack-m', img: tileMaterials, scale: 1 },
  { title: 'Условия доставки', to: '/delivery', img: tileDelivery, scale: 1.1 },
]

// 6.8 — инфо-блок
const advs = [
  {
    img: infoShop,
    title: 'Онлайн шопинг или поход в магазин',
    content: 'У нас несколько точек в Санкт-Петербурге',
  },
  { img: infoDelivery, title: 'Бесплатная доставка', content: 'Доставим в любую точку России' },
  {
    img: infoRepair,
    title: 'Починим куртку даже через 2 года',
    content: 'Гарантия от производителя',
  },
  {
    img: infoPay,
    title: 'Оплатите при получении, после примерки',
    content: 'Чтобы для вас все было идеально',
  },
]

type Store = {
  id: number
  name: string
  address?: string
  full_address?: string
  fullAddress?: string
  city?: string
  phone: string
  latitude?: number | string
  longitude?: number | string
}
const storeAddress = (s: Store) => s.full_address || s.fullAddress || s.address || ''

type Product = {
  id: number
  name: string
  price: string | number
  oldPrice?: string | number
  discountPercent?: number
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

export const HomePage = () => {
  // 6.2 карусель баннеров
  const [banner, setBanner] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setBanner(p => (p + 1) % bannerImages.length), BANNER_MS)
    return () => clearInterval(t)
  }, [])

  // 6.5 — 6 последних товаров
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    fetch(`${API_URL}/products?page=1&limit=6`)
      .then(r => r.json())
      .then(d => setProducts(Array.isArray(d) ? d.slice(0, 6) : []))
      .catch(() => setProducts([]))
  }, [])

  // 6.7 — новости (свежая слева)
  const { data: news } = useGetArticlesBySectionQuery(Section.NEWS)
  const sortedNews = [...(news || [])].sort(
    (a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  )
  const newsRef = useRef<HTMLDivElement>(null)
  const tilesRef = useRef<HTMLDivElement>(null)
  const scrollBy = (ref: RefObject<HTMLDivElement>, dir: -1 | 1) =>
    ref.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })

  // 6.9 — магазины + карта (одна карта с двумя точками)
  const [stores, setStores] = useState<Store[]>([])
  useEffect(() => {
    fetch(`${API_URL}/stores`)
      .then(r => r.json())
      .then(d => setStores(Array.isArray(d) ? d : []))
      .catch(() => setStores([]))
  }, [])
  // координаты магазинов [lon, lat] (в /stores координат нет — задаём по известным точкам)
  const storeCoords = (s: Store): [number, number] | null => {
    if (s.longitude && s.latitude) return [Number(s.longitude), Number(s.latitude)]
    const byId: Record<number, [number, number]> = {
      2: [30.434, 59.9327], // Заневский пр., 67к2
      3: [30.3226, 60.0506], // пр. Энгельса, 154
    }
    return byId[s.id] || null
  }
  const points = stores.map(storeCoords).filter(Boolean) as [number, number][]
  const center =
    points.length > 0
      ? [
          points.reduce((a, p) => a + p[0], 0) / points.length,
          points.reduce((a, p) => a + p[1], 0) / points.length,
        ]
      : [30.379, 59.99]
  const mapSrc =
    points.length > 0
      ? `https://yandex.ru/map-widget/v1/?ll=${center[0].toFixed(4)},${center[1].toFixed(4)}&z=10&pt=${points
          .map(p => `${p[0]},${p[1]},pm2rdm`)
          .join('~')}`
      : ''

  return (
    <div className="flex flex-col gap-[48px] bg-[var(--white)] pb-[48px] text-[var(--dark)] max-lg:gap-[28px]">
      {/* SEO: единственный H1 на странице */}
      <h1 className="sr-only">Мембранная одежда с климат-контролем</h1>

      {/* ═══ 6.2 БАННЕРЫ ═══ */}
      <div className="flex flex-col items-center gap-[16px]">
        <section className="relative h-[clamp(320px,38vw,560px)] w-full overflow-hidden">
          {bannerImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700"
              style={{ opacity: i === banner ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div
            className={`relative z-[2] flex h-full flex-col justify-center gap-[14px] ${SIDE} max-lg:px-[16px]`}
          >
            <p className="h1 !text-[#fff] !font-[500] max-w-[560px] max-lg:!text-[30px] max-lg:!leading-[34px]">
              Твой личный климат-контроль.
            </p>
            <p className="p1 !text-[#fff] max-w-[460px] max-lg:!text-[15px]">
              Куртка адаптируется к температуре за окном. Забудь о многослойности.
            </p>
            <div className="mt-[6px] flex flex-wrap items-center gap-[16px]">
              <Link className="button" to="/catalog">
                В каталог
              </Link>
              <Link
                to="/climate-control"
                className="flex items-center gap-[6px] text-[14px] font-[500] text-[#fff] no-underline"
              >
                Подробнее о климат-контроле <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>
        </section>
        {/* точки — по центру под баннером */}
        <div className="flex gap-[8px]">
          {bannerImages.map((_, i) => (
            <button
              key={i}
              aria-label={`Баннер ${i + 1}`}
              onClick={() => setBanner(i)}
              className="h-[8px] rounded-full transition-all"
              style={{
                width: i === banner ? 22 : 8,
                background: i === banner ? 'var(--red)' : '#D9D9D9',
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══ Быстрые иконки (только мобилка) ═══ */}
      <section className={`grid grid-cols-4 gap-[8px] ${SIDE} lg:hidden`}>
        {quickIcons.map(q => (
          <Link
            key={q.label}
            to={q.to}
            className="flex flex-col items-center gap-[6px] no-underline"
          >
            <div className="flex h-[64px] w-full items-center justify-center rounded-[16px] bg-[#F2F2F2] text-[24px] text-[var(--red)]">
              {q.icon}
            </div>
            <span className="text-[12px] font-[500] text-[var(--dark)]">{q.label}</span>
          </Link>
        ))}
      </section>

      {/* ═══ 6.3 КАТЕГОРИИ — мобильный список (до Brands) ═══ */}
      <section className={`flex flex-col gap-[12px] ${SIDE} lg:hidden`}>
        {[...bigCats, ...smallCats].map(c => (
          <Link
            key={c.to}
            to={c.to}
            className="flex items-center overflow-hidden rounded-[12px] no-underline shadow-[0px_2px_10px_0px_#6969691A]"
          >
            <div className="h-[88px] w-[88px] shrink-0 overflow-hidden">
              <img src={c.img} alt={c.label} className="h-full w-full object-cover" />
            </div>
            <span className="flex-1 px-[18px] text-[17px] font-[500]">{c.label}</span>
            <span className="mr-[18px] text-[20px] text-[#9B9B9B]">›</span>
          </Link>
        ))}
      </section>

      {/* ═══ Лента брендов (полноширинная полоса, как в макете) ═══ */}
      <section className="w-full">
        <img src={brands} alt="Бренды" className="block w-full object-cover" />
      </section>

      {/* ═══ 6.3 КАТЕГОРИИ — десктоп сетка ═══ */}
      <section className={`hidden flex-col gap-[24px] ${SIDE} lg:flex`}>
        <h2 className="h2">Категории</h2>
        <div className="grid grid-cols-[1fr_1fr_0.92fr] gap-[16px]">
          {bigCats.map(c => (
            <Link
              key={c.to}
              to={c.to}
              className="group relative flex h-[420px] items-end justify-center overflow-hidden rounded-[14px]"
            >
              <img
                src={c.img}
                alt={c.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="relative z-[1] mb-[20px] min-w-[150px] rounded-[8px] bg-[var(--red)] px-[clamp(28px,3vw,56px)] py-[12px] text-center text-[15px] font-[600] text-[#fff] transition-colors group-hover:bg-[#282B32] xl:text-[16px]">
                {c.label}
              </span>
            </Link>
          ))}
          <div className="flex flex-col gap-[16px]">
            {smallCats.map(c => (
              <Link
                key={c.to}
                to={c.to}
                className="group relative flex h-[202px] flex-col justify-center gap-[6px] overflow-hidden rounded-[14px] p-[24px]"
              >
                <img src={c.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <p className="relative z-[1] text-[20px] font-[600] text-[#fff]">{c.label}</p>
                <p className="relative z-[1] max-w-[200px] text-[13px] leading-[17px] text-[#E5E5E5]">
                  {c.note}
                </p>
                <span className="relative z-[1] mt-[6px] flex w-fit items-center gap-[6px] text-[14px] text-[#fff] transition-colors group-hover:text-[var(--red)]">
                  Перейти <span aria-hidden>↗</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6.4 SALE-БАННЕР (кликабелен целиком) ═══ */}
      <Link
        to="/sale"
        className="group relative flex h-[clamp(240px,26vw,360px)] items-center overflow-hidden"
      >
        <img src={saleBanner} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 to-transparent" />
        <div className={`relative z-[1] flex flex-col gap-[16px] ${SIDE} max-lg:px-[16px]`}>
          <div className="text-[#fff]">
            <span className="block text-[clamp(34px,5vw,64px)] font-[600] leading-[1]">
              Скидки до 50%
            </span>
            <span className="block text-[clamp(20px,3vw,40px)] font-[400]">
              на куртки и ветровки
            </span>
          </div>
          <span className="button w-fit transition-colors group-hover:!bg-[#282B32]">Перейти</span>
        </div>
      </Link>

      {/* ═══ 6.5 СЕЗОННЫЕ РЕКОМЕНДАЦИИ (6 последних товаров) ═══ */}
      <section className={`flex flex-col gap-[24px] ${SIDE}`}>
        <h2 className="h2">Сезонные рекомендации</h2>
        <div className="grid grid-cols-3 gap-[24px] max-lg:grid-cols-2 max-lg:gap-[14px]">
          {products.map(p => {
            const colors = productColors(p)
            const hasSale = Number(p.oldPrice) > Number(p.price)
            return (
              <Link key={p.id} to={`/${p.seoSlug ?? ''}`} className="flex flex-col no-underline">
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
                {/* точки слева, сердце справа — под фото */}
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
                  {/* <BsHeart className="text-[20px] text-[var(--red)]" /> */}
                </div>
                <h5 className="mt-[10px] h5 leading-[22px] text-[#4D4E50]">{p.name}</h5>
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
                <span className="button mt-[12px] w-fit">Подробнее</span>
              </Link>
            )
          })}
          {products.length === 0 && (
            <p className="p1 text-[var(--service)]">Товары скоро появятся</p>
          )}
        </div>
      </section>

      {/* ═══ 6.6 ПЛИТКИ СТАТЕЙ ═══ */}
      <section
        ref={tilesRef}
        className="grid grid-cols-4 gap-0 max-lg:flex max-lg:snap-x max-lg:gap-[10px] max-lg:overflow-x-auto max-lg:px-[16px] max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden"
      >
        {tiles.map(t => (
          <Link
            key={t.to}
            to={t.to}
            className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden p-[22px] max-lg:aspect-auto max-lg:h-[300px] max-lg:w-[240px] max-lg:shrink-0 max-lg:snap-start max-lg:rounded-[10px]"
          >
            <img
              src={t.img}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                transform: `scale(${t.scale || 1})`,
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
            {/* небольшой чёрный градиент сверху — как в макете */}
            <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-black/55 to-transparent" />
            <p className="relative z-[1] max-w-[150px] h3 leading-[26px] text-[#fff_!important]">{t.title}</p>
            <span className="button relative z-[1] w-fit transition-colors group-hover:!bg-[#282B32]">
              Узнать
            </span>
          </Link>
        ))}
      </section>

      {/* ═══ 6.7 НОВОСТИ ═══ */}
      <section className={`flex flex-col gap-[20px] ${SIDE}`}>
        <div className="flex items-center justify-between">
          <h2 className="h2">Новости</h2>
          <div className="flex gap-[10px]">
            <button
              aria-label="Назад"
              onClick={() => scrollBy(newsRef, -1)}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#C8CDD3] text-[20px] hover:bg-[#F5F5F5]"
            >
              ‹
            </button>
            <button
              aria-label="Вперёд"
              onClick={() => scrollBy(newsRef, 1)}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#C8CDD3] text-[20px] hover:bg-[#F5F5F5]"
            >
              ›
            </button>
          </div>
        </div>
        <div
          ref={newsRef}
          className="flex gap-[20px] overflow-x-auto scroll-smooth pb-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sortedNews.map((n: any) => (
            <Link
              key={n.id}
              to={`/${n.keyword}`}
              className="flex w-[300px] shrink-0 flex-col gap-[10px] no-underline max-lg:w-[240px]"
            >
              <div className="aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-[#F5F5F5]">
                {n.imageUrl && (
                  <img src={n.imageUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <span className="p2 !text-[13px] text-[var(--service)]">
                {n.createdAt &&
                  new Date(n.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
              </span>
              <h5 className="text-[16px] font-[600] leading-[20px]">{n.title}</h5>
              {n.description && (
                <div
                  className="line-clamp-3 text-[13px] leading-[18px] text-[var(--service)]"
                  dangerouslySetInnerHTML={{ __html: n.description }}
                />
              )}
            </Link>
          ))}
          {sortedNews.length === 0 && <p className="p1 text-[var(--service)]">Новостей пока нет</p>}
        </div>
      </section>

      {/* ═══ 6.8 ИНФО-БЛОК ═══ */}
      <section className={`grid grid-cols-4 gap-[24px] ${SIDE} max-lg:grid-cols-1`}>
        {advs.map(a => (
          <div
            key={a.title}
            className="flex max-w-[240px] flex-col items-center gap-[8px] justify-self-center text-center"
          >
            <img src={a.img} alt="" className="h-[40px]" />
            <p className="h5 leading-[18px] text-[var(--dark)]">{a.title}</p>
            <p className="p1 leading-[16px] text-[var(--service)]">{a.content}</p>
          </div>
        ))}
      </section>

      {/* ═══ 6.9 КОНТАКТЫ + КАРТА ═══ */}
      <section className={`flex gap-[40px] ${SIDE} max-lg:flex-col max-lg:gap-[20px]`}>
        <div className="flex flex-1 flex-col gap-[20px]">
          <h2 className="h2">Контакты</h2>
          {stores.map(s => (
            <div key={s.id} className="flex flex-col gap-[6px]">
              <p className="text-[20px] font-[600]">{s.name}</p>
              <p className="p2 !text-[15px] text-[var(--dark)]">{storeAddress(s)}</p>
              <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`} className="button mt-[4px] w-fit">
                {s.phone}
              </a>
            </div>
          ))}
        </div>
        <div className="h-[420px] w-[42%] overflow-hidden rounded-[14px] max-lg:h-[300px] max-lg:w-full">
          {mapSrc && (
            <iframe
              title="Карта магазинов"
              src={mapSrc}
              className="h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
            />
          )}
        </div>
      </section>
    </div>
  )
}

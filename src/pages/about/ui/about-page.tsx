/* eslint-disable max-lines */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { useGetArticlesBySectionQuery } from '@/entities/article'
import { Section } from '@/entities/article/article.types'
import { StoresMap } from '@/widgets/storesMap/StoresMap'

// TODO: заменить на реальный hero-баннер «О нас» (about-hero.jpg), когда пришлёшь
import aboutHero from '@/assets/home/banner-8.png'
import brandsGrid from '@/assets/home/brands-grid.png'
import tileClimate from '@/assets/home/tile-climate.png'
import tileWash from '@/assets/home/tile-wash.png'
import tileMaterials from '@/assets/home/tile-materials.png'
import tileDelivery from '@/assets/home/tile-delivery.png'
import infoShop from '@/assets/home/info-shop.svg'
import infoDelivery from '@/assets/home/info-delivery.svg'
import infoRepair from '@/assets/home/info-repair.svg'
import infoPay from '@/assets/home/info-pay.svg'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'

const API_URL = import.meta.env.VITE_APP_API_URL
const SIDE = 'px-[var(--sides-padding)]'

// «Наши бренды» — нарезка одной hi-res ленты (3236×170) по координатам логотипов
const STRIP_W = 3236
const STRIP_H = 170
const RH = 88 // высота логотипа при отрисовке
const S = RH / STRIP_H
const brandRanges: [number, number][] = [
  [42, 295], // LimoLady
  [611, 866], // AutoJack
  [1193, 1435], // nordwind
  [1759, 2019], // NorthBloom
  [2336, 2593], // WestBloom
  [2924, 3153], // Запорожец
]

const tiles = [
  { title: 'Климат-контроль', to: '/climate-control-stirka', img: tileClimate, scale: 1.5 },
  { title: 'Как стирать', to: '/kak-stirat-odezhdu-s-klimat-kontrolem', img: tileWash, scale: 1.1 },
  { title: 'Материалы', to: '/autojack-m', img: tileMaterials, scale: 1 },
  { title: 'Условия доставки', to: '/delivery', img: tileDelivery, scale: 1.1 },
]

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

// Карусель со стрелками (Статьи / Новости)
const Carousel = ({ title, items }: { title: string; items: any[] }) => {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: -1 | 1) => ref.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })
  return (
    <section className={`flex flex-col gap-[20px] ${SIDE}`}>
      <div className="flex items-center justify-between">
        <h2 className="h2">{title}</h2>
        <div className="flex gap-[10px]">
          <button
            aria-label="Назад"
            onClick={() => scroll(-1)}
            className="flex h-[44px] w-[44px] text-[14px] items-center justify-center text-[20px] hover:bg-[#F5F5F5]"
          >
            <BsChevronLeft />
          </button>
          <button
            aria-label="Вперёд"
            onClick={() => scroll(1)}
            className="flex h-[44px] w-[44px] items-center justify-center text-[20px] hover:bg-[#F5F5F5]"
          >
            <BsChevronRight />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-[24px] overflow-x-auto scroll-smooth pb-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((n: any) => (
          <Link
            key={n.id}
            to={`/${n.keyword}`}
            className="flex w-[300px] shrink-0 flex-col gap-[10px] no-underline max-lg:w-[240px]"
          >
            <div className="aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-[#F5F5F5]">
              {n.imageUrl && <img src={n.imageUrl} alt="" className="h-full w-full object-cover" />}
            </div>
            <span className="text-[13px] text-[var(--service)]">
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
        {items.length === 0 && <p className="p1 text-[var(--service)]">Пока пусто</p>}
      </div>
    </section>
  )
}

export const AboutPage = () => {
  const { data: articles } = useGetArticlesBySectionQuery(Section.USER)
  const { data: news } = useGetArticlesBySectionQuery(Section.NEWS)
  const sortByDate = (arr: any[]) =>
    [...(arr || [])].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )

  const [stores, setStores] = useState<Store[]>([])
  useEffect(() => {
    fetch(`${API_URL}/stores`)
      .then(r => r.json())
      .then(d => setStores(Array.isArray(d) ? d : []))
      .catch(() => setStores([]))
  }, [])
  const storeCoords = (s: Store): [number, number] | null => {
    if (s.longitude && s.latitude) return [Number(s.longitude), Number(s.latitude)]
    const byId: Record<number, [number, number]> = {
      2: [30.437617, 59.933032], // ТРК «Заневский Каскад», Заневский пр., 67к2
      3: [30.335068, 60.059095], // ТРК «Гранд Каньон», пр. Энгельса, 154
    }
    return byId[s.id] || null
  }
  const points = stores.map(storeCoords).filter(Boolean) as [number, number][]

  return (
    <div className="flex flex-col gap-[56px] bg-[var(--white)] pb-[48px] text-[var(--dark)] max-lg:gap-[32px]">
      {/* ═══ HERO ═══ */}
      <section className="relative h-[clamp(300px,32vw,460px)] w-full overflow-hidden">
        <img
          src={aboutHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div
          className={`relative z-[1] flex h-full max-w-[795px] w-[60%] flex-col justify-center gap-[16px] ${SIDE} max-lg:px-[16px]`}
        >
          {/* Единственный H1 страницы */}
          <h1 className="h1 !text-[#fff] !font-[500] max-lg:!text-[30px] max-lg:!leading-[34px]">
            Умная одежда
          </h1>
          <p className="p1 !leading-[21px] text-[#fff_!important]">
            За долгие годы работы на рынке верхней одежды в Санкт-Петербурге мы сотрудничали со
            многими производителями и старались отобрать самые качественные, созданные с учётом
            разнообразных потребностей модели, для того чтобы лучшие из них представить покупателю.
          </p>
          <Link className="button w-fit" to="/catalog">
            В каталог
          </Link>
        </div>
      </section>

      {/* ═══ НАШИ БРЕНДЫ ═══ */}
      <section className={`flex flex-col gap-[24px] ${SIDE}`}>
        <div className="flex flex-col gap-[8px]">
          <h2 className="h2">Наши бренды</h2>
          <p className="p1 text-[var(--service)] max-w-[50%]">
            Мы сотрудничаем с компаниями, предлагающими технологичную и стильную городскую верхнюю
            одежду
          </p>
        </div>
        <div className="grid grid-cols-3 items-center justify-items-center gap-x-[24px] gap-y-[40px] py-[12px] max-sm:grid-cols-2 max-lg:grid-cols-2">
          {brandRanges.map(([x0, x1], i) => (
            <div
              key={i}
              aria-label="Бренд"
              style={{
                width: (x1 - x0) * S,
                height: RH,
                backgroundImage: `url(${brandsGrid})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${STRIP_W * S}px ${STRIP_H * S}px`,
                backgroundPosition: `-${x0 * S}px center`,
              }}
            />
          ))}
        </div>
      </section>

      {/* ═══ ПЛИТКИ СТАТЕЙ ═══ */}
      <section className="grid grid-cols-4 gap-0 max-lg:flex max-lg:snap-x max-lg:gap-[10px] max-lg:overflow-x-auto max-lg:px-[16px] max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden">
        {tiles.map(t => (
          <Link
            key={t.to}
            to={t.to}
            className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden p-[22px] max-lg:aspect-auto max-lg:h-[220px] max-lg:w-[240px] max-lg:shrink-0 max-lg:snap-start max-lg:rounded-[10px]"
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
            <p className="relative z-[1] max-w-[150px] h4 leading-[26px] text-[#fff_!important] whitespace-nowrap">
              {t.title}
            </p>
            <span className="button relative z-[1] w-fit transition-colors group-hover:!bg-[#282B32]">
              Узнать
            </span>
          </Link>
        ))}
      </section>

      {/* ═══ СТАТЬИ ═══ */}
      <Carousel title="Статьи" items={sortByDate(articles || [])} />

      {/* ═══ НОВОСТИ ═══ */}
      <Carousel title="Новости" items={sortByDate(news || [])} />

      {/* ═══ ИНФО-БЛОК ═══ */}
      <section className={`flex flex-col gap-[24px] ${SIDE}`}>
        <h2 className="h2">Умная одежда — для вас</h2>
        <div className="grid grid-cols-4 gap-[24px] max-sm:grid-cols-1 max-lg:grid-cols-2">
          {advs.map(a => (
            <div key={a.title} className="flex flex-col gap-[8px] xl:flex-row xl:items-center xl:gap-[16px]">
              <img src={a.img} alt="" className="h-[56px] w-[56px] shrink-0 object-contain" />
              <div>
                <p className="h5 leading-[18px]">{a.title}</p>
                <p className="p1 leading-[16px] text-[var(--service)]">{a.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ КОНТАКТЫ + КАРТА ═══ */}
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
          {/* points у нас [lon, lat] → Leaflet ждёт [lat, lon] */}
          <StoresMap points={points.map(([lon, lat]) => [lat, lon] as [number, number])} />
        </div>
      </section>
    </div>
  )
}

/* eslint-disable max-lines */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsGrid, BsTag, BsStars, BsTruck, BsChevronLeft, BsChevronRight } from 'react-icons/bs'

import { useGetArticlesBySectionQuery } from '@/entities/article'
import { Section } from '@/entities/article/article.types'
import { SeasonalRecommendations } from '@/widgets/seasonalRecommendations/SeasonalRecommendations'
import { ArticleTiles } from '@/widgets/articleTiles/ArticleTiles'
import { ContactsBlock } from '@/widgets/contactsBlock/ContactsBlock'
import { HOME_CONTACT_STORES } from '@/shared/config/stores'

// ── Ассеты (src/assets/home) ──
// import banner1 from '@/assets/home/banner-1.png'
import banner2 from '@/assets/home/banner-2.png'
import banner3 from '@/assets/home/banner-3.png'
import banner4 from '@/assets/home/banner-4.png'
// import banner5 from '@/assets/home/banner-5.png'
import banner6 from '@/assets/home/banner-6.png'
import banner7 from '@/assets/home/banner-7.png'
import brands from '@/assets/home/brands.png'
import catWomen from '@/assets/home/cat-women.png'
import catMen from '@/assets/home/cat-men.png'
import catAccessories from '@/assets/home/cat-accerssories.png'
import catSale from '@/assets/home/cat-sales.png'
import saleBanner from '@/assets/home/sale-women.png'
import infoShop from '@/assets/home/info-shop.svg'
import infoDelivery from '@/assets/home/info-delivery.svg'
import infoRepair from '@/assets/home/info-repair.svg'
import infoPay from '@/assets/home/info-pay.svg'

const BANNER_MS = 30000

const bannerImages = [banner2, banner3, banner4, banner6, banner7]

// 6.3 — программный блок категорий
const bigCats = [
  { label: 'Женщинам', to: '/women', img: catWomen },
  { label: 'Мужчинам', to: '/men', img: catMen },
]
const smallCats = [
  {
    label: 'Аксессуары',
    note: 'Мужские и женские тёплые аксессуары',
    to: '/aksessuary',
    img: catAccessories,
  },
  { label: 'Распродажа?', note: 'Скидки на товары прошлых сезонов', to: '/sale', img: catSale },
]
// На мобильных — только 3 категории без «Распродажи» (ТЗ 10, п.12)
const mobileCats = [
  { label: 'Мужчинам', to: '/men', img: catMen },
  { label: 'Женщинам', to: '/women', img: catWomen },
  { label: 'Аксессуары', to: '/aksessuary', img: catAccessories },
]
const quickIcons = [
  { icon: <BsGrid />, label: 'Каталог', to: '/catalog' },
  { icon: <BsTag />, label: 'Скидки', to: '/sale' },
  { icon: <BsStars />, label: 'Новинки', to: '/new' },
  { icon: <BsTruck />, label: 'Доставка', to: '/delivery' },
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

const SIDE = 'px-[var(--sides-padding)]'

// Карусель статей/новостей (одинаковый дизайн — ТЗ 10 п.12: «статьи каруселью как новости»)
const ArticleCarousel = ({
  title,
  items,
  emptyText,
}: {
  title: string
  items: any[]
  emptyText: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const scrollBy = (dir: -1 | 1) =>
    ref.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })
  return (
    <section className={`flex flex-col gap-[20px] ${SIDE}`}>
      <div className="flex items-center justify-between">
        <h2 className="h2">{title}</h2>
        {/* стрелки: справа сверху на десктопе, снизу по центру на ≤1024 */}
        <div className="hidden gap-[10px] min-[1025px]:flex">
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
        ref={ref}
        className="flex snap-x snap-mandatory gap-[20px] overflow-x-auto overflow-y-hidden scroll-smooth pb-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((n: any) => (
          <Link
            key={n.id}
            to={`/${n.keyword}`}
            className="flex w-[300px] shrink-0 snap-start flex-col gap-[10px] no-underline max-lg:w-[240px]"
          >
            <div className="aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-[#F5F5F5]">
              {n.imageUrl && <img src={n.imageUrl} alt="" className="h-full w-full object-cover" />}
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
        {items.length === 0 && <p className="p1 text-[var(--service)]">{emptyText}</p>}
      </div>
      {/* стрелки снизу по центру — на ≤1024 */}
      <div className="flex justify-center gap-[10px] min-[1025px]:hidden">
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
    </section>
  )
}

export const HomePage = () => {
  // 6.2 карусель баннеров
  const [banner, setBanner] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setBanner(p => (p + 1) % bannerImages.length), BANNER_MS)
    return () => clearInterval(t)
  }, [])

  // Новости (свежие слева)
  const { data: news } = useGetArticlesBySectionQuery(Section.NEWS)
  const sortedNews = [...(news || [])].sort(
    (a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  )

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
              className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700"
              style={{ opacity: i === banner ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div
            className={`relative z-[2] flex h-full flex-col justify-center gap-[14px] ${SIDE} max-lg:px-[16px] max-[1024px]:justify-end max-[1024px]:pb-[40px] max-[1024px]:max-w-[750px]`}
          >
            <p className="h1 !text-[#fff] !font-[500] max-w-[560px] max-[1024px]:max-w-full max-lg:!text-[30px] max-lg:!leading-[34px]">
              Твой личный климат-контроль.
            </p>
            <p className="p1 !text-[#fff] max-w-[460px] max-[1024px]:max-w-full max-lg:!text-[15px]">
              Куртка адаптируется к температуре за окном.
              <br /> Забудь о многослойности.
            </p>
            <div className="mt-[6px] flex flex-wrap items-center gap-[16px]">
              {/* кнопка баннера — чёрная */}
              <Link className="button !bg-[#282B32]" to="/catalog">
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
        {mobileCats.map(c => (
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

      {/* ═══ Лента брендов — выше и листается пальцем на мобильных/планшете (ТЗ 10 п.12) ═══ */}
      <section className="w-full max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <img
          src={brands}
          alt="Бренды"
          className="block w-full object-cover max-lg:h-[84px] max-lg:w-auto max-lg:max-w-none"
        />
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
                <span className="relative z-[1] mt-[6px] flex w-fit items-center gap-[6px] text-[14px] text-[#fff] transition-colors">
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
        <img
          src={saleBanner}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
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

      {/* ═══ 6.5 СЕЗОННЫЕ РЕКОМЕНДАЦИИ (последние товары) ═══ */}
      <SeasonalRecommendations />

      {/* ═══ 6.6 СТАТЬИ — плитки (десктоп) / карусель как новости (мобилка) ═══ */}
      <ArticleTiles />

      {/* ═══ 6.7 НОВОСТИ ═══ */}
      <ArticleCarousel title="Новости" items={sortedNews} emptyText="Новостей пока нет" />

      {/* ═══ 6.8 ИНФО-БЛОК — 4 в ряд (вкл. 1024), 2×2 ниже 768, 1 колонка ≤500 ═══ */}
      <section
        className={`grid grid-cols-4 gap-[24px] ${SIDE} max-md:grid-cols-2 max-[500px]:grid-cols-1`}
      >
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
      <ContactsBlock stores={HOME_CONTACT_STORES} className={SIDE} />
    </div>
  )
}

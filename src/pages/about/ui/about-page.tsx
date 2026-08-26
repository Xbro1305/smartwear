/* eslint-disable max-lines */
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { useGetArticlesBySectionQuery } from '@/entities/article'
import { Section } from '@/entities/article/article.types'
import { ContactsBlock } from '@/widgets/contactsBlock/ContactsBlock'
import { ArticleTiles } from '@/widgets/articleTiles/ArticleTiles'
import { HOME_CONTACT_STORES } from '@/shared/config/stores'

// TODO: заменить на реальный hero-баннер «О нас» (about-hero.jpg), когда пришлёшь
import aboutHero from '@/assets/home/banner-8.png'
import brandsGrid from '@/assets/home/brands-grid.png'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'

const SIDE = 'px-[var(--sides-padding)]'

// «Наши бренды» — нарезка одной hi-res ленты (3236×170) по координатам логотипов
const STRIP_W = 3236
const STRIP_H = 170
const RH = 120 // высота логотипа при отрисовке (крупнее — «Наши бренды» шире, по макету)
const S = RH / STRIP_H
const brandRanges: [number, number][] = [
  [42, 295], // LimoLady
  [611, 866], // AutoJack
  [1193, 1435], // nordwind
  [1759, 2019], // NorthBloom
  [2336, 2593], // WestBloom
  [2924, 3153], // Запорожец
]

// Карусель со стрелками (Статьи / Новости)
const Carousel = ({ title, items }: { title: string; items: any[] }) => {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: -1 | 1) => ref.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })
  useEffect(() => {
    document.title =
      'О компани | MaxisComfort'
  }, [])
  return (
    <section className={`flex flex-col gap-[20px] ${SIDE}`}>
      <div className="flex items-center justify-between">
        <h2 className="h2">{title}</h2>
        {/* стрелки: справа сверху на десктопе, снизу по центру на ≤1024 */}
        <div className="hidden gap-[10px] min-[1025px]:flex">
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
        className="flex snap-x snap-mandatory gap-[24px] overflow-x-auto overflow-y-hidden scroll-smooth pb-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
      {/* стрелки снизу по центру — на ≤1024 */}
      <div className="flex justify-center gap-[10px] min-[1025px]:hidden">
        <button
          aria-label="Назад"
          onClick={() => scroll(-1)}
          className="flex h-[44px] w-[44px] items-center justify-center text-[20px] hover:bg-[#F5F5F5]"
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

  return (
    <div className="flex flex-col gap-[56px] bg-[var(--white)] pb-[48px] text-[var(--dark)] max-lg:gap-[32px]">
      {/* ═══ HERO ═══
          ≥1025 — текст поверх фото (оверлей); ≤1024 — фото сверху, текст блоком под ним на всю ширину */}
      <section className="w-full min-[1025px]:relative min-[1025px]:h-[clamp(300px,32vw,460px)] min-[1025px]:overflow-hidden">
        <img
          src={aboutHero}
          alt=""
          className="block w-full object-cover object-center h-[clamp(300px,52vw,480px)] min-[1025px]:absolute min-[1025px]:inset-0 min-[1025px]:h-full"
        />
        {/* градиент — только для десктопного оверлея */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-black/70 via-black/40 to-transparent min-[1025px]:block" />
        <div
          className={`flex flex-col gap-[16px] ${SIDE} max-[1024px]:px-[16px] max-[1024px]:py-[24px] min-[1025px]:absolute min-[1025px]:inset-0 min-[1025px]:z-[1] min-[1025px]:h-full min-[1025px]:w-[60%] min-[1025px]:max-w-[795px] min-[1025px]:justify-center`}
        >
          {/* Единственный H1 страницы */}
          <h1 className="h1 !font-[500] min-[1025px]:!text-[#fff] max-[1024px]:!text-[28px] max-[1024px]:!leading-[32px]">
            Умная одежда
          </h1>
          <p className="p1 !leading-[21px] text-[var(--service)] min-[1025px]:!text-[#fff] max-[1024px]:!text-[15px] max-[1024px]:!leading-[20px]">
            За долгие годы работы на рынке верхней одежды в Санкт-Петербурге мы сотрудничали со
            многими производителями и старались отобрать самые качественные, созданные с учётом
            разнообразных потребностей модели, для того чтобы лучшие из них представить покупателю.
          </p>
          <Link className="button w-fit !bg-[#282B32]" to="/catalog">
            В каталог
          </Link>
        </div>
      </section>

      {/* ═══ НАШИ БРЕНДЫ ═══ */}
      <section className={`flex flex-col gap-[24px] ${SIDE}`}>
        <div className="flex flex-col gap-[8px]">
          <h2 className="h2">Наши бренды</h2>
          <p className="p1 text-[var(--service)] lg:max-w-[50%]">
            Мы сотрудничаем с компаниями, предлагающими технологичную и стильную городскую верхнюю
            одежду
          </p>
        </div>
        <div className="grid grid-cols-3 items-center justify-items-center gap-x-[24px] gap-y-[40px] py-[12px] max-sm:grid-cols-2">
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

      {/* ═══ ПЛИТКИ СТАТЕЙ — тёмные плитки (десктоп) / аккордеон вопросов (мобилка) ═══ */}
      <ArticleTiles mobileVariant="accordion" />

      {/* ═══ СТАТЬИ ═══ */}
      <Carousel title="Статьи" items={sortByDate(articles || [])} />

      {/* ═══ НОВОСТИ ═══ */}
      <Carousel title="Новости" items={sortByDate(news || [])} />

      {/* ═══ КОНТАКТЫ + КАРТА ═══ */}
      <ContactsBlock stores={HOME_CONTACT_STORES} className={SIDE} />
    </div>
  )
}

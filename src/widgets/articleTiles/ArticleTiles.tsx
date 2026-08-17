import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsChevronLeft, BsChevronRight, BsChevronDown } from 'react-icons/bs'

import tileClimate from '@/assets/home/tile-climate.png'
import tileWash from '@/assets/home/tile-wash.png'
import tileMaterials from '@/assets/home/tile-materials.png'
import tileDelivery from '@/assets/home/tile-delivery.png'

const SIDE = 'px-[var(--sides-padding)]'

// Плитки статей. `question` — заголовок для мобильного аккордеона на «О нас».
const tiles = [
  {
    title: 'Климат-контроль',
    question: 'Что такое технология климат-контроля?',
    to: '/climate-control',
    img: tileClimate,
    scale: 1.5,
  },
  {
    title: 'Как стирать',
    question: 'Как правильно стирать?',
    to: '/kak-stirat-odezhdu-s-klimat-kontrolem',
    img: tileWash,
    scale: 1.1,
  },
  {
    title: 'Материалы',
    question: 'Из каких материалов делают одежду с климат-контролем?',
    to: '/autojack-m',
    img: tileMaterials,
    scale: 1,
  },
  {
    title: 'Условия доставки',
    question: 'Какие условия доставки?',
    to: '/delivery',
    img: tileDelivery,
    scale: 1.1,
  },
]

type Props = {
  /** мобильный вид: 'cards' — карусель карточек (главная); 'accordion' — аккордеон вопросов («О нас») */
  mobileVariant?: 'cards' | 'accordion'
  /** заголовок мобильной карусели (для 'cards') */
  mobileTitle?: string
  showMobileHeader?: boolean
}

// ── Тёмные плитки (десктоп) ──
const DarkTiles = ({ className }: { className: string }) => (
  <section className={className}>
    {tiles.map(t => (
      <Link
        key={t.to}
        to={t.to}
        className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden p-[22px]"
      >
        <img
          src={t.img}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: `scale(${t.scale || 1})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-black/55 to-transparent" />
        <p className="relative z-[1] max-w-[160px] h4 leading-[26px] text-[#fff_!important] lg:-nowrap">
          {t.title}
        </p>
        <span className="button relative z-[1] w-fit transition-colors group-hover:!bg-[#282B32]">
          Узнать
        </span>
      </Link>
    ))}
  </section>
)

// ── Аккордеон вопросов (мобилка «О нас») ──
const AccordionRow = ({ question, to }: { question: string; to: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-[12px] bg-[#F2F2F2]">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-[12px] px-[18px] py-[16px] text-left"
      >
        <span className="text-[15px] font-[500] leading-[20px] text-[var(--dark)]">{question}</span>
        <BsChevronDown
          className={`shrink-0 text-[16px] text-[#9B9B9B] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-[18px] pb-[16px]">
          <Link to={to} className="button w-fit">
            Читать статью
          </Link>
        </div>
      )}
    </div>
  )
}

export const ArticleTiles = ({
  mobileVariant = 'cards',
  mobileTitle = 'Статьи',
  showMobileHeader = true,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: -1 | 1) => ref.current?.scrollBy({ left: dir * 250, behavior: 'smooth' })

  // Вариант «О нас»: плитки (4-в-ряд) остаются до 500px, ниже 500 — аккордеон вопросов
  if (mobileVariant === 'accordion') {
    return (
      <>
        <DarkTiles className="hidden grid-cols-4 gap-0 min-[500px]:grid" />
        <section className={`flex flex-col gap-[12px] min-[500px]:hidden ${SIDE}`}>
          {tiles.map(t => (
            <AccordionRow key={t.to} question={t.question} to={t.to} />
          ))}
        </section>
      </>
    )
  }

  // Вариант главной: плитки остаются до 500px (2×2 на планшете), ниже 500 — карусель карточек
  return (
    <>
      <DarkTiles className="hidden grid-cols-4 gap-0 min-[500px]:grid max-lg:grid-cols-2" />
      <section className={`flex flex-col gap-[20px] min-[500px]:hidden ${SIDE}`}>
        {showMobileHeader && <h2 className="h2">{mobileTitle}</h2>}
        <div
          ref={ref}
          className="flex gap-[16px] overflow-x-auto overflow-y-hidden scroll-smooth pb-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tiles.map(t => (
            <Link
              key={t.to}
              to={t.to}
              className="flex w-[240px] shrink-0 flex-col gap-[10px] no-underline"
            >
              <div className="aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-[#F5F5F5]">
                <img src={t.img} alt="" className="h-full w-full object-cover" />
              </div>
              <h5 className="text-[16px] font-[600] leading-[20px]">{t.title}</h5>
            </Link>
          ))}
        </div>
        {showMobileHeader && (
          <div className="flex justify-center gap-[10px]">
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
        )}
      </section>
    </>
  )
}

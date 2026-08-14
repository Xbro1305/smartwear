import { StoresMap } from '@/widgets/storesMap/StoresMap'
import type { ContactStore } from '@/shared/config/stores'

type Props = {
  stores: ContactStore[]
  /** заголовок блока; null — без заголовка (если у страницы свой H1) */
  title?: string | null
  className?: string
}

/**
 * Единый блок контактов: список магазинов + карта (Leaflet, красные метки).
 * Используется на главной, «О нас» и «Контактах» (ТЗ 10, п.10–11).
 */
export const ContactsBlock = ({ stores, title = 'Контакты', className = '' }: Props) => {
  const points = stores.map(s => s.coords)

  return (
    <section
      className={`flex gap-[40px] max-[1024px]:flex-col max-[1024px]:gap-[20px] ${className}`}
    >
      <div className="flex flex-1 flex-col gap-[20px]">
        {title !== null && <h2 className="h2">{title}</h2>}
        {stores.map(s => (
          <div key={s.id} className="flex flex-col gap-[6px]">
            <p className="text-[20px] font-[600]">{s.name}</p>
            {/* единый размер шрифта во всех адресах (ТЗ 10, п.11) */}
            <p className="p2 !text-[15px] text-[var(--dark)]">
              {s.addressLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < s.addressLines.length - 1 && <br />}
                </span>
              ))}
            </p>
            <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`} className="button mt-[4px] w-fit">
              {s.phone}
            </a>
          </div>
        ))}
      </div>
      <div className="h-[420px] w-[42%] overflow-hidden rounded-[14px] max-[1024px]:h-[300px] max-[1024px]:w-full">
        <StoresMap points={points} />
      </div>
    </section>
  )
}

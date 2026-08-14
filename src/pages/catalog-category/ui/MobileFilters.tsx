import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

type Props = {
  open: boolean
  onClose: () => void
  filters: any[]
  filterIds?: number[]
  availableAttributes?: number[]
  toggleFilterValue: (id: number) => void
  minPrice: number
  maxPrice: number
  price?: number
  setPrice: (v: number) => void
  priceFrom?: number
  setPriceFrom: (v: number) => void
  isSaled: boolean
  setIsSaled: (v: boolean) => void
  colors?: any[]
  colorCodeById?: Record<number, string>
  colorIds?: number[]
  availableColors?: number[]
  setColorIds: (fn: any) => void
  sizes?: any[]
  sizeIds?: number[]
  availableSizes?: number[]
  setSizeIds: (fn: any) => void
  lengths: any[]
  lengthIds?: number[]
  availableLengths?: number[]
  setLengthIds: (fn: any) => void
}

type Opt = { id: number; label: string; selected: boolean; disabled: boolean; colorCode?: string }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-[14px]">
    <p className="text-[15px] font-[600] text-[var(--dark)]">{title}</p>
    {children}
  </div>
)

/** Пилюли (Сезон / Размер / Длина) */
const Pills = ({ options, onToggle }: { options: Opt[]; onToggle: (id: number) => void }) => (
  <div className="flex flex-wrap gap-[10px]">
    {options.map(o => (
      <button
        key={o.id}
        type="button"
        disabled={o.disabled}
        onClick={() => onToggle(o.id)}
        className={`rounded-[22px] border px-[18px] py-[10px] text-[14px] transition-colors ${
          o.selected
            ? 'border-[var(--red)] bg-white text-[var(--dark)]'
            : 'border-transparent bg-[#F2F2F2] text-[var(--dark)]'
        } ${o.disabled ? 'opacity-40' : ''}`}
      >
        {o.label}
      </button>
    ))}
  </div>
)

/** Чекбоксы с «Показать все» (Бренды / Цвет / Утеплитель) */
const CheckboxGroup = ({ options, onToggle }: { options: Opt[]; onToggle: (id: number) => void }) => {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? options : options.slice(0, 4)
  return (
    <div className="flex flex-col gap-[14px]">
      {visible.map(o => (
        <label key={o.id} className="flex cursor-pointer items-center gap-[10px]">
          <input
            type="checkbox"
            checked={o.selected}
            disabled={o.disabled}
            onChange={() => onToggle(o.id)}
            className="h-[20px] w-[20px] shrink-0 accent-[var(--red)]"
          />
          {o.colorCode && (
            <span
              className="h-[20px] w-[20px] shrink-0 rounded-full border border-[#E5E5E5]"
              style={{ background: o.colorCode }}
            />
          )}
          <span className={`text-[15px] ${o.disabled ? 'text-[var(--service)]' : 'text-[var(--dark)]'}`}>
            {o.label}
          </span>
        </label>
      ))}
      {options.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll(v => !v)}
          className="mt-[2px] flex items-center justify-center gap-[6px] text-[14px] text-[var(--dark)]"
        >
          {showAll ? 'Свернуть' : 'Показать все'}
          <FaChevronDown className={showAll ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </button>
      )}
    </div>
  )
}

const toggleIn = (setFn: (fn: any) => void, id: number) =>
  setFn((prev: any) => (prev?.includes(id) ? prev.filter((n: any) => n != id) : [...(prev || []), id]))

/**
 * Мобильная панель фильтра по макету (ТЗ 10): пилюли для Сезон/Размер/Длина,
 * чекбоксы с «Показать все» для Брендов/Цвета/Утеплителя, цена «от/до», «Отмена»/«Применить».
 * Значения применяются сразу (фетч завязан на state), «Применить» просто закрывает панель.
 */
export const MobileFilters = ({
  open,
  onClose,
  filters,
  filterIds,
  availableAttributes,
  toggleFilterValue,
  minPrice,
  maxPrice,
  price,
  setPrice,
  priceFrom,
  setPriceFrom,
  isSaled,
  setIsSaled,
  colors,
  colorCodeById,
  colorIds,
  availableColors,
  setColorIds,
  sizes,
  sizeIds,
  availableSizes,
  setSizeIds,
  lengths,
  lengthIds,
  availableLengths,
  setLengthIds,
}: Props) => {
  if (!open) return null

  const attrEnabled = (id: number) => !!availableAttributes?.includes(id) || !!filterIds?.includes(id)

  const attrOptions = (attr: any): Opt[] =>
    (attr.values || []).map((v: any) => ({
      id: v.id,
      label: v.value,
      selected: !!filterIds?.includes(v.id),
      disabled: !attrEnabled(v.id),
    }))

  const isSeason = (name: string) => /сезон/i.test(name || '')

  return (
    <div className="fixed inset-0 z-[999] flex flex-col bg-white lg:hidden">
      {/* Шапка */}
      <div className="flex items-center justify-between border-b border-[#F0F0F0] px-[16px] py-[16px]">
        <span className="w-[64px]" />
        <p className="text-[17px] font-[600] text-[var(--dark)]">Фильтры</p>
        <button
          type="button"
          onClick={onClose}
          className="w-[64px] text-right text-[15px] text-[var(--red)]"
        >
          Отмена
        </button>
      </div>

      {/* Прокручиваемое содержимое */}
      <div className="flex flex-1 flex-col gap-[26px] overflow-y-auto px-[16px] py-[20px]">
        {/* Сезон и прочие атрибуты-пилюли */}
        {filters.filter((a: any) => isSeason(a.attributeName)).map((attr: any) => (
          <Section key={attr.attributeId} title={attr.attributeName}>
            <Pills options={attrOptions(attr)} onToggle={toggleFilterValue} />
          </Section>
        ))}

        {/* Бренды и другие атрибуты — чекбоксы */}
        {filters.filter((a: any) => !isSeason(a.attributeName)).map((attr: any) => (
          <Section key={attr.attributeId} title={attr.attributeName}>
            <CheckboxGroup options={attrOptions(attr)} onToggle={toggleFilterValue} />
          </Section>
        ))}

        {/* Цена */}
        <Section title="Цена">
          <div className="flex items-center gap-[12px]">
            <div className="flex flex-1 items-center gap-[6px] rounded-[8px] border border-[#E5E5E5] px-[12px] py-[10px]">
              <span className="text-[13px] text-[var(--service)]">от</span>
              <input
                type="number"
                inputMode="numeric"
                value={priceFrom ?? ''}
                placeholder={String(minPrice || '')}
                onChange={e => setPriceFrom(Number(e.target.value))}
                className="w-full bg-transparent text-[15px] outline-none"
              />
            </div>
            <div className="flex flex-1 items-center gap-[6px] rounded-[8px] border border-[#E5E5E5] px-[12px] py-[10px]">
              <span className="text-[13px] text-[var(--service)]">до</span>
              <input
                type="number"
                inputMode="numeric"
                value={price ?? ''}
                placeholder={String(maxPrice || '')}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-transparent text-[15px] outline-none"
              />
            </div>
          </div>
        </Section>

        {/* Со скидкой */}
        <label className="flex cursor-pointer items-center gap-[10px]">
          <input
            type="checkbox"
            checked={isSaled}
            onChange={() => setIsSaled(!isSaled)}
            className="h-[20px] w-[20px] shrink-0 accent-[var(--red)]"
          />
          <span className="text-[15px] text-[var(--dark)]">Со скидкой</span>
        </label>

        {/* Цвет */}
        {!!colors?.length && (
          <Section title="Цвет">
            <CheckboxGroup
              options={colors.map((c: any) => ({
                id: c.id,
                label: c.value,
                selected: !!colorIds?.includes(c.id),
                disabled: !availableColors?.includes(c.id) && !colorIds?.includes(c.id),
                // реальный код цвета берём из вариантов товаров, потом — из самого объекта
                colorCode:
                  colorCodeById?.[c.id] || c.meta?.colorCode || c.colorCode || c.hex || '#D9D9D9',
              }))}
              onToggle={id => toggleIn(setColorIds, id)}
            />
          </Section>
        )}

        {/* Размер одежды */}
        {!!sizes?.length && (
          <Section title="Размер одежды">
            <Pills
              options={[...sizes]
                .sort((a: any, b: any) => a.orderNum - b.orderNum)
                .map((s: any) => ({
                  id: s.id,
                  label: s.value,
                  selected: !!sizeIds?.includes(s.id),
                  disabled: !availableSizes?.includes(s.id) && !sizeIds?.includes(s.id),
                }))}
              onToggle={id => toggleIn(setSizeIds, id)}
            />
          </Section>
        )}

        {/* Диапазон длины */}
        {!!lengths?.length && (
          <Section title="Диапазон длины">
            <Pills
              options={lengths.map((l: any) => ({
                id: l.id,
                label: l.name,
                selected: !!lengthIds?.includes(l.id),
                disabled: !availableLengths?.includes(l.id) && !lengthIds?.includes(l.id),
              }))}
              onToggle={id => toggleIn(setLengthIds, id)}
            />
          </Section>
        )}
      </div>

      {/* Применить */}
      <div className="border-t border-[#F0F0F0] p-[16px]">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-[10px] bg-[#282B32] py-[16px] text-center text-[16px] font-[600] text-white"
        >
          Применить
        </button>
      </div>
    </div>
  )
}

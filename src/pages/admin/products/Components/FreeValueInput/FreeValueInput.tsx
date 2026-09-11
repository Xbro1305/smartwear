interface FreeValueInputProps {
  className?: string
  onChange: (value: string) => void
  placeholder: string
  value: string
  values: { id: number; value: string }[]
}

/**
 * Атрибут с «произвольным значением» (Правки 5, п.7): вместо выпадающего списка —
 * строка ввода, а заранее заданные значения — серые плашки, которые подставляются
 * в поле по клику и дальше редактируются.
 */
export const FreeValueInput = ({
  className,
  onChange,
  placeholder,
  value,
  values,
}: FreeValueInputProps) => (
  <div className={`flex flex-col gap-[10px] ${className || ''}`}>
    <input
      className={'admin-input w-full'}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      type={'text'}
      value={value}
    />
    {values.length > 0 && (
      <div className={'flex flex-wrap gap-[8px]'}>
        {[...values]
          .sort((a, b) => a.value.localeCompare(b.value, 'ru'))
          .map(item => (
            <button
              className={`p-[4px_16px] cursor-pointer rounded-xl text-[13px] select-none ${
                item.value.trim().toLowerCase() === value.trim().toLowerCase()
                  ? 'bg-[#E02844] text-white'
                  : 'bg-[#F2F3F5]'
              }`}
              key={item.id}
              onClick={() => onChange(item.value)}
              type={'button'}
            >
              {item.value}
            </button>
          ))}
      </div>
    )}
  </div>
)

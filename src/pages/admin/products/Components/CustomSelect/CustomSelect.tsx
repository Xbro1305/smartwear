import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

interface SelectProps {
  data: { id: number; value: string }[]
  onChange: (id: number, value?: string) => void
  value: { id: number; value: string } | null
  placeholder: string
  showSuggestions?: boolean
  className?: string
}

export const CustomSelect: React.FC<SelectProps> = ({
  data,
  onChange,
  value,
  placeholder,
  showSuggestions = true,
  className,
}) => {
  const [opened, setOpened] = useState(false)
  return (
    <div className={`relative ${className}`}>
      <label className="w-full cursor-pointer px-[15px] h-[40px] border-[1px] flex items-center justify-between border-solid border-[#BDBFC7] rounded-xl">
        <p className={`text-[14px] ${value?.id == 0 && 'text-[#20222460]'}`}>
          {value?.id != 0 ? value?.value : placeholder}
        </p>
        <button onClick={() => setOpened(!opened)}>
          <FaChevronDown className="text-[#E02844] font-[12px]" />
        </button>
      </label>
      <div
        className={`absolute shadow rounded-xl bottom bg-white w-full flex flex-col transition transition-all duration-300 ease h-fit ${opened ? 'max-h-[400px] overflow-auto' : 'max-h-0 overflow-hidden'}`}
      >
        {data.map(item => (
          <div
            key={item.id}
            onClick={() => {
              onChange(item.id, item?.value)
              setTimeout(() => setOpened(false), 200)
            }}
            className="p-[15px] bg-white z-40 hover:bg-[#eee] cursor-pointer"
          >
            {item.value}
          </div>
        ))}
      </div>

      {showSuggestions && (
        <div className="flex flex-wrap gap-[8px] mt-[10px]">
          {data.slice(0, 5).map(item => (
            <div
              key={item.id}
              onClick={() => {
                onChange(item.id, item?.value)
                setOpened(false)
              }}
              className="p-[4px_16px] cursor-pointer bg-[#F2F3F5] rounded-xl"
            >
              {item.value}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

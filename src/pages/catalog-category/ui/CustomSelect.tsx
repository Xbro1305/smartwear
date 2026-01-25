import React from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { HiOutlineSwitchVertical } from 'react-icons/hi'

interface Options {
  value: string
  id: string | number
}

interface CustomSelectProps {
  options?: Options[]
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const selectedOption = options?.find(option => option.id === value) || options?.[0]

  return (
    <div
      className={`bg-white cursor-pointer relative ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'} ${className || ''}`}
    >
      <div
        className={`flex ml-auto lg:w-full items-center lg:justify-between gap-[10px] lg:gap-[0px] px-[16px] py-[8px] rounded-[8px] lg:border-solid lg:border-[1px] ${isOpen ? 'lg:border-red' : 'md:border-service'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <HiOutlineSwitchVertical className="flex lg:hidden text-red" />
        <p className="">
          {selectedOption ? selectedOption.value : placeholder || 'Select an option'}
        </p>
        <FaChevronDown
          className={`transition-[0.3s] transition-all hidden lg:flex ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
      {isOpen && (
        <div
          className={`absolute mt-[4px] bg-white top-[47px] border border-service flex flex-col rounded-[8px] z-10 max-h-[250px] overflow-y-auto ${className}`}
        >
          {options?.map(option => (
            <div
              key={option.id}
              className="px-[16px] py-[8px] hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange && onChange(option.id)
                setIsOpen(false)
              }}
            >
              {option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

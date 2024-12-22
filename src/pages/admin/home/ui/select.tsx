import './select.css'
import chart_line from '@/assets/images/chart-line.svg'
import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

interface Option {
  value: string
  image: any
}

export const Select = () => {
  const [selectedOption, setSelectedOption] = useState<Option | null>({
    value: 'chart',
    image: chart_line,
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option: Option) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  const options: Option[] = [{ value: 'chart', image: chart_line }]

  return (
    <div className="custom-select">
      <div className="select-selected" onClick={() => setIsOpen(prev => !prev)}>
        {selectedOption ? (
          <div className="select-item">
            <img src={selectedOption.image} /> <FaChevronDown />
          </div>
        ) : (
          'Select an option '
        )}
      </div>
      {isOpen && (
        <div className="select-items">
          {options.map(option => (
            <div key={option.value} className="select-item" onClick={() => handleSelect(option)}>
              <img src={option.image} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

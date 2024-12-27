import './select.css'
import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

interface Option {
  options: any
}

export const Select: React.FC<Option> = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState<any>(options[0])
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option: Option) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

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
          {options?.map((option: any) => (
            <div key={option.value} className="select-item" onClick={() => handleSelect(option)}>
              <img src={option.image} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const MonthsSelect: React.FC<Option> = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState<any>(options[0])
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option: Option) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  return (
    <div className="custom-months-select">
      <div className="select-selected" onClick={() => setIsOpen(prev => !prev)}>
        {selectedOption ? (
          <div className="select-item">
            {selectedOption.value}
            <FaChevronDown />
          </div>
        ) : (
          'Select an option '
        )}
      </div>
      {isOpen && (
        <div className="select-items">
          {options?.map((option: any) => (
            <div key={option.value} className="select-item" onClick={() => handleSelect(option)}>
              {option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

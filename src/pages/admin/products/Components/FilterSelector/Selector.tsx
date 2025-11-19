import { useState } from 'react'
import styles from './Selector.module.scss'
import { FaChevronDown } from 'react-icons/fa'

interface SelectorProps {
  isEmpty: boolean
  title?: string
  options: any[]
  value: any
  onChange: (value: any) => void
  className?: string
}

export const FilterSelector: React.FC<SelectorProps> = ({
  options,
  title,
  isEmpty,
  value,
  className,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOptionClick = (option: any) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div className={`${className} ${styles.selector}`}>
      <h2 className={styles.selector_title}>{title}</h2>
      <div className={styles.selector_value}>
        <p onClick={() => setIsOpen(!isOpen)}>{isEmpty ? 'Не выбрано' : value?.title}</p>
        <section className={styles.selector_changeIcons}>
          {!isEmpty && (
            <p
              onClick={() => handleOptionClick({ title: '', id: null })}
              style={{ borderRight: '1px solid #DFE2EB', fontSize: '20px' }}
            >
              &times;
            </p>
          )}
          <p
            onClick={() => setIsOpen(!isOpen)}
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}
          >
            <FaChevronDown />
          </p>
        </section>
      </div>

      {isOpen && (
        <div className={styles.selector_options}>
          <ul className={styles.selector_options_list}>
            {options.map((option, index) => (
              <li
                className={`${value?.title == option?.title && styles.selector_options_active}`}
                key={index}
                onClick={() => handleOptionClick(option)}
              >
                {option?.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

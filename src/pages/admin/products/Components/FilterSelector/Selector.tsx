import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Selector.module.scss'
import { FaChevronDown } from 'react-icons/fa'

interface SelectorProps {
  isEmpty: boolean
  title?: string
  options: any[]
  value: any
  onChange: (value: any) => void
  className?: string
  isOpen?: boolean
  onClick?: () => void
}

export const FilterSelector: React.FC<SelectorProps> = ({
  options,
  title,
  isEmpty,
  value,
  className,
  onChange,
  isOpen: propIsOpen,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(!!propIsOpen)
  const selectorRef = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
  })

  const handleOptionClick = (option: any) => {
    onChange(option)
    setIsOpen(false)
  }

  // синхронизация с пропсом
  useEffect(() => {
    if (typeof propIsOpen === 'boolean') {
      setIsOpen(propIsOpen)
    }
  }, [propIsOpen])

  // считаем позицию dropdown
  useLayoutEffect(() => {
    if (!isOpen || !selectorRef.current) return

    const rect = selectorRef.current.getBoundingClientRect()

    setCoords({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    })
  }, [isOpen])

  // click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node

      if (
        selectorRef.current &&
        !selectorRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <div ref={selectorRef} className={`${className ?? ''} ${styles.selector}`} onClick={onClick}>
        {title && <h2 className={styles.selector_title}>{title}</h2>}

        <div className={styles.selector_value}>
          <p onClick={() => setIsOpen(prev => !prev)}>{isEmpty ? 'Не выбрано' : value?.title}</p>

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
              onClick={() => setIsOpen(prev => !prev)}
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: '0.3s',
              }}
            >
              <FaChevronDown />
            </p>
          </section>
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.selector_options}
            style={{
              position: 'absolute',
              top: coords.top,
              left: coords.left,
              width: coords.width,
              zIndex: 9999,
            }}
          >
            <ul className={styles.selector_options_list}>
              {options.map((option, index) => (
                <li
                  key={index}
                  className={value?.title === option?.title ? styles.selector_options_active : ''}
                  onClick={() => handleOptionClick(option)}
                >
                  {option?.title}
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </>
  )
}

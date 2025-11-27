// CustomSelect.tsx
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { FaChevronDown } from 'react-icons/fa'

interface ItemType {
  id: number
  value: string
}

interface SelectProps {
  data: ItemType[]
  onChange: (id: number, value?: string) => void
  value: ItemType | null
  placeholder: string
  showSuggestions?: boolean
  className?: string
  onClick?: () => void
}

function getScrollParents(node: HTMLElement | null): (Window | HTMLElement)[] {
  const res: (Window | HTMLElement)[] = []
  if (!node) return res

  let parent: HTMLElement | null = node.parentElement
  while (parent) {
    const style = getComputedStyle(parent)
    const overflow = `${style.overflow}${style.overflowY}${style.overflowX}`
    if (/(auto|scroll|overlay)/.test(overflow)) res.push(parent)
    parent = parent.parentElement
  }
  res.push(window)
  return res
}

export const CustomSelect: React.FC<SelectProps> = ({
  data,
  onChange,
  value,
  placeholder,
  showSuggestions = true,
  className,
  onClick,
}) => {
  const [opened, setOpened] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const scrollParentsRef = useRef<(Window | HTMLElement)[]>([])

  // вычислить позицию триггера
  const updatePosition = () => {
    const el = triggerRef.current
    if (!el) return setCoords(null)
    const rect = el.getBoundingClientRect()
    setCoords({ top: rect.bottom, left: rect.left, width: rect.width })
  }

  // при открытии — найдем все скролл-паренты и подпишемся на событие
  useEffect(() => {
    if (!opened) return

    // обновляем позицию сразу
    updatePosition()

    // определяем парентов, на которых нужно слушать скролл
    scrollParentsRef.current = getScrollParents(wrapperRef.current)

    const onScrollOrResize = () => {
      // throttle минимально через rAF
      requestAnimationFrame(updatePosition)
    }

    // подписываемся
    scrollParentsRef.current.forEach(sp => {
      if (sp instanceof Window) {
        sp.addEventListener('resize', onScrollOrResize, { passive: true })
        sp.addEventListener('scroll', onScrollOrResize, { passive: true })
      } else {
        sp.addEventListener('scroll', onScrollOrResize, { passive: true })
      }
    })

    // клик вне: закрыть
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(target)) {
        setTimeout(() => {
          setOpened(false)
        }, 100)
      }
    }
    document.addEventListener('mousedown', onDocClick)

    return () => {
      // cleanup
      scrollParentsRef.current.forEach(sp => {
        if (sp instanceof Window) {
          sp.removeEventListener('resize', onScrollOrResize)
          sp.removeEventListener('scroll', onScrollOrResize)
        } else {
          sp.removeEventListener('scroll', onScrollOrResize)
        }
      })
      document.removeEventListener('mousedown', onDocClick)
    }
  }, [opened])

  // если изменился value или data, можно обновить позицию
  useLayoutEffect(() => {
    if (opened) updatePosition()
  }, [value, data, opened])

  return (
    <div ref={wrapperRef} className={`relative ${className || ''}`} onClick={onClick}>
      <button
        ref={triggerRef}
        type="button"
        className="w-full gap-[10px] cursor-pointer px-[15px] h-[40px] border-[1px] flex items-center justify-between border-solid border-[#BDBFC7] rounded-xl bg-white"
        onClick={e => {
          e.stopPropagation()
          setOpened(s => !s)
        }}
      >
        <p
          className={`text-[14px] whitespace-nowrap max-w-[calc(100%-10px)] ${!value || value.id === 0 ? 'text-[#20222460]' : ''}`}
        >
          {value && value.id !== 0 ? value.value : placeholder}
        </p>

        <FaChevronDown
          className={`text-[#E02844] text-[12px] transition-transform duration-200 ${opened ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Встроенные подсказки (внутри документа, не в portal) */}
      {showSuggestions && data.length > 0 && (
        <div className="flex flex-wrap gap-[8px] mt-[10px]">
          {data.slice(0, 5).map(item => (
            <div
              key={item.id}
              onClick={e => {
                e.stopPropagation()
                onChange(item.id, item.value)
                setOpened(false)
              }}
              className="p-[4px_16px] whitespace-nowrap cursor-pointer bg-[#F2F3F5] rounded-xl text-[13px] select-none"
            >
              {item.value}
            </div>
          ))}
        </div>
      )}

      {/* Portal dropdown: fixed позиционирование по viewport */}
      {opened &&
        coords &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: coords.top, // позиция относительно viewport
              left: coords.left,
              width: coords.width,
              zIndex: 9999,
            }}
          >
            <div className="bg-white shadow-lg rounded-xl max-h-[300px] overflow-auto">
              {data.length === 0 ? (
                <div className="p-[12px_15px] text-[#777]">Нет данных</div>
              ) : (
                data.map(item => (
                  <div
                    key={item.id}
                    onClick={e => {
                      e.stopPropagation()
                      onChange(item.id, item.value)
                      setOpened(false)
                    }}
                    className="p-[12px_15px] hover:bg-[#F2F3F5] cursor-pointer text-[14px] whitespace-nowrap select-none"
                  >
                    {item.value}
                  </div>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default CustomSelect

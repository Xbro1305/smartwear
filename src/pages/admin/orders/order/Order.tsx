import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as types from './types'
import axios from 'axios'
import {
  BsCalendar,
  BsChevronDown,
  BsChevronUp,
  BsCopy,
  BsTrash,
  BsChevronLeft,
  BsChevronRight,
} from 'react-icons/bs'
import { PatternFormat } from 'react-number-format'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_APP_API_URL

const statusLabels: Record<string, string> = {
  NEW: 'Принят',
  PROCESSING: 'В обработке',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
}

const paymentLabels: Record<string, string> = {
  OFFLINE: 'Сдэк',
  ONLINE: 'Онлайн',
  CASH: 'Наличными',
  CARD: 'Картой',
}

const deliveryStatusLabels: Record<string, string> = {
  NOT_DELIVERED: 'не вручен',
  DELIVERED: 'вручен',
  RETURNED: 'возврат',
}

// ─── Utilities ────────────────────────────────────────────────────────────────

const addWorkingDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return result
}

const formatDate = (date?: Date | string | null): string => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatMoney = (value?: string | number | null): string => {
  if (value === undefined || value === null || value === '') return '-'
  return Number(value).toLocaleString('ru-RU')
}

const copyText = (value?: string | null) => navigator.clipboard.writeText(value || '')

// ─── DatePicker ────────────────────────────────────────────────────────────────

const MONTHS_RU = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]
const DAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

type DatePickerProps = {
  value: Date | null
  onChange: (date: Date) => void
  onClose: () => void
}

const DatePicker = ({ value, onChange, onClose }: DatePickerProps) => {
  const today = new Date()
  const [viewDate, setViewDate] = useState(value || today)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  return (
    <div
      className="absolute z-50 mt-[4px] rounded-[16px] border border-[#DDE1E6] bg-white p-[16px] shadow-xl"
      style={{ minWidth: 280 }}
    >
      <div className="mb-[12px] flex items-center justify-between">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="rounded-[8px] p-[4px] hover:bg-[#F5F5F5]"
        >
          <BsChevronLeft className="text-[14px]" />
        </button>
        <p className="text-[14px] font-[700] text-[#4D4E50]">
          {MONTHS_RU[month]} {year}
        </p>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="rounded-[8px] p-[4px] hover:bg-[#F5F5F5]"
        >
          <BsChevronRight className="text-[14px]" />
        </button>
      </div>

      <div className="mb-[8px] grid grid-cols-7 gap-[4px]">
        {DAYS_RU.map(d => (
          <p key={d} className="text-center text-[12px] font-[600] text-[#8B8F97]">
            {d}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[4px]">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />
          const cellDate = new Date(year, month, day)
          const isSelected = value && isSameDay(cellDate, value)
          const isToday = isSameDay(cellDate, today)
          return (
            <button
              key={day}
              onClick={() => {
                onChange(new Date(year, month, day))
                onClose()
              }}
              className={`h-[32px] w-[32px] rounded-[8px] text-[13px] font-[600] transition-colors ${
                isSelected
                  ? 'bg-[#EF2D4F] text-white'
                  : isToday
                    ? 'border border-[#EF2D4F] text-[#EF2D4F] hover:bg-[#FFF0F2]'
                    : 'text-[#4D4E50] hover:bg-[#F5F5F5]'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>

      <button
        onClick={onClose}
        className="mt-[12px] w-full rounded-[10px] bg-[#F5F5F5] py-[8px] text-[13px] font-[600] text-[#4D4E50] hover:bg-[#DDE1E6]"
      >
        Закрыть
      </button>
    </div>
  )
}

// ─── DateField ────────────────────────────────────────────────────────────────

type DateFieldProps = {
  label: string
  displayValue: string
  onCalendarClick: () => void
}

const DateField = ({ label, displayValue, onCalendarClick }: DateFieldProps) => (
  <div className="flex flex-col gap-[8px]">
    {label ? <p className="text-[14px] font-medium">{label}</p> : <div className="h-[21px]" />}
    <div className="flex h-[40px] w-full items-center justify-between rounded-[12px] bg-[#F5F5F5] px-[12px]">
      <p className="truncate text-[14px]">{displayValue || '-'}</p>
      <button onClick={onCalendarClick} className="ml-[8px] shrink-0">
        <BsCalendar className="text-[16px] text-[#8B8F97]" />
      </button>
    </div>
  </div>
)

// ─── CopyField ────────────────────────────────────────────────────────────────

type CopyFieldProps = {
  label: string
  value?: string | null
  onCopy: () => void
  renderValue?: (value?: string | null) => ReactNode
  isCopyable?: boolean
  rightIcon?: ReactNode
}

const CopyField = ({
  label,
  value,
  onCopy,
  renderValue,
  isCopyable = true,
  rightIcon,
}: CopyFieldProps) => (
  <div className="flex flex-col gap-[8px]">
    {label ? <p className="text-[14px] font-medium">{label}</p> : <div className="h-[21px]" />}
    <div className="flex h-[40px] w-full items-center justify-between rounded-[12px] bg-[#F5F5F5] px-[12px]">
      {renderValue ? renderValue(value) : <p className="truncate text-[14px]">{value || '-'}</p>}
      {rightIcon}
      {isCopyable && (
        <button onClick={onCopy} className="ml-[8px] shrink-0">
          <BsCopy className="rotate-[270deg] text-[16px] text-[#8B8F97]" />
        </button>
      )}
    </div>
  </div>
)

// ─── InfoPill ─────────────────────────────────────────────────────────────────

const InfoPill = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-[40px] items-center rounded-[12px] bg-[#F5F5F5] px-[12px] text-[14px] leading-[16px]">
    {children}
  </div>
)

// ─── Divider ──────────────────────────────────────────────────────────────────

const Divider = () => <div className="w-full border border-[#DDE1E6]" />

// ─── OrderItemCard ────────────────────────────────────────────────────────────

type OrderItemCardProps = {
  item: types.AdminOrderItem
  onSaveMarking: (itemId: number, markingCode: string) => Promise<void>
  onDeleteItem: (itemId: number) => void
  isSingleItemInInvoice: boolean
  onDeleteInvoice: () => void
  promoDetails: any
  // totalItemsCount: number
}

const OrderItemCard = ({
  item,
  onSaveMarking,
  onDeleteItem,
  isSingleItemInInvoice,
  onDeleteInvoice,
  promoDetails,
  // totalItemsCount,
}: OrderItemCardProps) => {
  const [markingCode, setMarkingCode] = useState(item.markingCode || '')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const product = item.variant.product
  const size = item.variant.sizeValue?.name
  const color = item.colorAlias || item.variant.colorAttrValue?.value
  const status = deliveryStatusLabels[item.deliveryStatus] || item.deliveryStatus
  const isDelivered = item.deliveryStatus === 'DELIVERED'

  const saveMarking = async () => {
    setIsSaving(true)
    await onSaveMarking(item.id, markingCode)
    setIsSaving(false)
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setMarkingCode(item.markingCode || '')
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (isSingleItemInInvoice) {
      onDeleteInvoice()
    } else {
      onDeleteItem(item.id)
    }
  }

  return (
    <div className="rounded-[12px] border border-[#C8CDD3] bg-white p-[14px]">
      {/* Header */}
      <div className="mb-[12px] flex items-center justify-between">
        <h4 className="text-[20px] font-[700] text-[#4D4E50]">Товар {item.quantity}</h4>
        <p className="text-[14px] font-[600]">
          Статус:{' '}
          <span className={isDelivered ? 'text-[#22C55E]' : 'text-[#EF2D4F]'}>{status}</span>
        </p>
      </div>

      {/* Marking code */}
      <p className="mb-[8px] text-[14px] font-[600] text-[#4D4E50]">Код маркировки</p>

      <div
        className={`flex h-[44px] items-center justify-between rounded-[12px] border px-[12px] ${
          isEditing ? 'border-[#EF2D4F] bg-white' : 'border-[#C8CDD3] bg-white'
        }`}
      >
        <input
          value={markingCode}
          readOnly={!isEditing}
          onChange={e => setMarkingCode(e.target.value)}
          placeholder="2132132132323232323"
          className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#B9BDC5]"
        />
        {/* Copy button — only when not editing and has value */}
        {!isEditing && markingCode && (
          <button onClick={() => copyText(markingCode)} className="ml-[8px] shrink-0">
            <BsCopy className="rotate-[270deg] text-[16px] text-[#8B8F97]" />
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-[14px] flex gap-[12px]">
        {isEditing ? (
          <>
            <button
              onClick={cancelEditing}
              className="h-[44px] rounded-[12px] bg-[#4D4E50] px-[18px] text-[14px] font-[600] text-white"
            >
              Отмена
            </button>
            <button
              id="admin-button"
              disabled={isSaving}
              onClick={saveMarking}
              className="h-[44px_!important] rounded-[12px] px-[18px] text-[14px] font-[600] text-white"
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="h-[44px] rounded-[12px] bg-[#A4A6A8] px-[18px] text-[14px] font-[600] text-white"
          >
            Изменить
          </button>
        )}
      </div>

      <div className="my-[14px] h-[1px] bg-[#DDE1E6]" />

      {/* Product info */}
      <div className="grid grid-cols-[96px_1fr] gap-[12px]">
        <img
          src={
            (product.media.find(m => m.kind == 'cover') || product.media[0])?.url ||
            '/placeholder.png'
          }
          alt={product.name}
          className="h-[96px] w-[96px] rounded-[6px] object-cover"
        />
        <div className="min-w-0">
          <p className="line-clamp-2 text-[14px] font-[700] text-[#4D4E50]">{product.name}</p>
          <p className="text-[14px] font-[500] text-[#7A7F87]">
            Цвет: <span className="font-[700] text-[#4D4E50]">{color}</span>
          </p>
          <p className="text-[14px] font-[500] text-[#7A7F87]">
            Размер: <span className="font-[700] text-[#4D4E50]">{size}</span>
          </p>
          <p className="text-[14px] font-[500] text-[#7A7F87]">
            Код товара: <span className="font-[700] text-[#4D4E50]">{product.articul}</span>
          </p>
        </div>
      </div>

      {/* Price */}
      <p className="mt-[12px] text-[14px] font-[700] text-[#4D4E50]">Стоимость</p>
      <div className="mt-[8px] grid grid-cols-[1fr_auto_1.2fr_1.3fr] gap-[10px]">
        <InfoPill>{formatMoney(item.price)}</InfoPill>
        <p className="self-center text-[14px]">Руб.</p>
        <InfoPill>
          Скидка
          {promoDetails?.type === 'PERCENT'
            ? ` ${promoDetails.value}%`
            : ` ${item?.discountAmount} руб.`}
        </InfoPill>
        <InfoPill>
          Размер скидки <br />
          {promoDetails?.type === 'PERCENT'
            ? ` ${formatMoney((Number(item.price) * promoDetails?.value) / 100)} руб.`
            : ` ${item?.discountAmount} руб.`}
        </InfoPill>
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="ml-auto mt-[20px] flex h-[44px] items-center gap-[8px] rounded-[12px] bg-[#FFF0F2] px-[16px] text-[14px] font-[700] text-[#EF2D4F]"
      >
        Удалить товар
        <BsTrash className="text-[20px]" />
      </button>
    </div>
  )
}

// ─── InvoiceCard ──────────────────────────────────────────────────────────────

type InvoiceCardProps = {
  order: types.AdminOrder
  groupIndex: number // 1-based index (for "История (2001/1)")
  totalGroups: number
  items: types.AdminOrderItem[]
  shopAddress: string
  trackingNumber: string
  onTrackingChange: (value: string) => void
  onSaveTracking: () => Promise<void>
  onSaveMarking: (itemId: number, markingCode: string) => Promise<void>
  onDeleteItem: (itemId: number) => void
  onDeleteInvoice: () => void
  totalItemsCount: number
}

const InvoiceCard = ({
  order,
  groupIndex,
  totalGroups,
  items,
  shopAddress,
  trackingNumber,
  onTrackingChange,
  onSaveTracking,
  onSaveMarking,
  onDeleteItem,
  onDeleteInvoice,
  // totalItemsCount,
}: InvoiceCardProps) => {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [savingTracking, setSavingTracking] = useState(false)

  if (!items.length) return null

  const handleSaveTracking = async () => {
    setSavingTracking(true)
    await onSaveTracking()
    setSavingTracking(false)
  }

  // History label: "История (2001/1)" — orderNumber/groupIndex
  const historyLabel =
    totalGroups > 1
      ? `История (${order.orderNumber}/${groupIndex})`
      : `История (${order.orderNumber})`

  return (
    <div className="flex flex-col gap-[16px] rounded-[12px] bg-[#FAFAFA] p-[24px]">
      {/* Invoice number */}
      <div className="flex items-center gap-[8px]">
        <p className="whitespace-nowrap text-[22px] font-[600] text-[#8B8F97]">Накладная №</p>
        <div className="flex h-[40px] w-full items-center justify-between rounded-[12px] border border-[#C8CDD3] bg-white px-[12px]">
          <input
            value={trackingNumber}
            onChange={e => onTrackingChange(e.target.value)}
            onBlur={handleSaveTracking}
            className="w-full bg-transparent text-[14px] font-[600] outline-none"
            placeholder="Введите номер"
          />
          <button
            disabled={savingTracking}
            onClick={handleSaveTracking}
            className="ml-[8px] shrink-0"
          >
            <BsCopy className="rotate-[270deg] text-[16px] text-[#8B8F97]" />
          </button>
        </div>
      </div>

      {/* Shop address */}
      <p className="text-[14px] font-[600] text-[#8B8F97]">
        Адрес отправления{' '}
        <span className="text-[#4D4E50]">{shopAddress || 'Пр-т Ленина, д12'}</span>
      </p>

      {/* Items */}
      <div className="flex flex-col gap-[16px]">
        {items.map(item => (
          <OrderItemCard
            key={item.id}
            item={item}
            onSaveMarking={onSaveMarking}
            onDeleteItem={onDeleteItem}
            isSingleItemInInvoice={items.length === 1}
            onDeleteInvoice={onDeleteInvoice}
            promoDetails={order.promoCode}
            // totalItemsCount={totalItemsCount}
          />
        ))}
      </div>

      {/* Footer: status + history toggle */}
      <div className="flex items-center justify-between">
        <p className="text-[22px] font-[700] text-[#4D4E50]">
          Статус:{' '}
          {items[0].deliveryStatus == 'NOT_DELIVERED'
            ? 'В обработке'
            : items[0].deliveryStatus == 'DELIVERED'
              ? 'Доставлен'
              : 'Отменен'}
        </p>
        <button
          className="flex items-center gap-[8px] text-[18px] font-[700] text-[#4D4E50]"
          onClick={() => setHistoryOpen(v => !v)}
        >
          {historyLabel}
          {historyOpen ? <BsChevronUp /> : <BsChevronDown />}
        </button>
      </div>

      {/* History */}
      {historyOpen && (
        <div className="flex flex-col gap-[12px]">
          {(order?.histories || []).map((row: any, i: number) => (
            <div key={i} className="grid grid-cols-[90px_72px_1fr] items-center gap-[8px]">
              <p className="text-[16px] font-[600] text-[#4D4E50]">{formatDate(row?.changedAt)}</p>
              <div className="h-[1px] bg-[#8B8F97]" />
              <p className="text-[16px] font-[600] text-[#4D4E50]">{row.newMoyskladStatus}</p>
            </div>
          ))}
        </div>
      )}

      {/* Delete invoice */}
      <button
        onClick={onDeleteInvoice}
        className="flex w-fit items-center gap-[8px] text-[14px] font-[700] text-[#EF2D4F]"
      >
        Удалить всю накладную
        <BsTrash className="text-[20px]" />
      </button>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export const OrderAdminPage = () => {
  const [order, setOrder] = useState<types.AdminOrder | null>(null)

  // Tracking numbers per group (key = groupIndex 0/1)
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>(['', ''])

  // Date state
  const [shippingDate, setShippingDate] = useState<Date | null>(null)
  const [deliveryFrom, setDeliveryFrom] = useState<Date | null>(null)
  const [shippingCalOpen, setShippingCalOpen] = useState(false)
  const [deliveryCalOpen, setDeliveryCalOpen] = useState(false)
  const shippingRef = useRef<HTMLDivElement>(null)
  const deliveryRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { id } = useParams()
  const token = localStorage.getItem('token')
  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])
  const navigate = useNavigate()

  // Close calendars on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shippingRef.current && !shippingRef.current.contains(e.target as Node))
        setShippingCalOpen(false)
      if (deliveryRef.current && !deliveryRef.current.contains(e.target as Node))
        setDeliveryCalOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!id) return
    axios(`${API_URL}/orders/admin/${id}`, { headers: authHeaders })
      .then(res => {
        const data: types.AdminOrder = res.data
        setOrder(data)
        // Initialise tracking numbers from API data
        window.document.title = `Заказ №${data?.orderNumber}`
        const groups = groupItemsByShop(data.items)
        setTrackingNumbers(groups.map(g => g[0]?.trackingNumber || data.trackingNumber || ''))
        if (data.deliveryFrom) setShippingDate(new Date(data.deliveryFrom))
        if (data.deliveryFrom) setDeliveryFrom(new Date(data.deliveryFrom))
      })
      .catch(console.error)

    window.scrollTo(0, 0)
  }, [id, authHeaders])

  // ─── Grouping items by shop ──────────────────────────────────────────────

  /**
   * Groups order items by shopId (or some field).
   * If all items come from the same shop → one group → single column layout.
   * If items come from two shops → two groups → two column layout.
   */
  const groupItemsByShop = (items: types.AdminOrderItem[]): types.AdminOrderItem[][] => {
    const map = new Map<string, types.AdminOrderItem[]>()
    for (const item of items) {
      const key = String(item?.storeId || 'default')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    }
    return Array.from(map.values())
  }

  const itemGroups = useMemo(() => (order ? groupItemsByShop(order.items) : []), [order])
  const isMultiShop = itemGroups.length > 1

  // ─── Derived dates ────────────────────────────────────────────────────────

  const deliveryTo = deliveryFrom ? addWorkingDays(deliveryFrom, 2) : null

  const deliveryDaysLabel = (() => {
    if (!deliveryFrom || !deliveryTo) return '-'
    const days = Math.ceil((deliveryTo.getTime() - deliveryFrom.getTime()) / (1000 * 60 * 60 * 24))
    return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}`
  })()

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const updateTrackingNumber = async (groupIdx: number) => {
    if (!order) return
    const tNum = trackingNumbers[groupIdx]
    navigator.clipboard.writeText(tNum)
    // Determine which order id to patch (if split orders, order may have sub-ids)
    const orderId = order.id
    try {
      await axios.patch(
        `${API_URL}/orders/admin/${orderId}/tracking-number`,
        { trackingNumber: tNum },
        { headers: authHeaders }
      )
    } catch (err) {
      console.error(err)
    }
  }

  const updateMarkingCode = async (itemId: number, markingCode: string) => {
    try {
      await axios.patch(
        `${API_URL}/orders/admin/items/${itemId}/marking-code`,
        { markingCode },
        { headers: authHeaders }
      )
      setOrder(prev => {
        if (!prev) return prev
        return {
          ...prev,
          items: prev.items.map(item => (item.id === itemId ? { ...item, markingCode } : item)),
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  const deleteItem = (itemId: number) => {
    setOrder(prev => {
      if (!prev) return prev
      return { ...prev, items: prev.items.filter(i => i.id !== itemId) }
    })
    // TODO: call delete API
  }

  const deleteInvoice = (groupIdx: number) => {
    const group = itemGroups[groupIdx]
    setOrder(prev => {
      if (!prev) return prev
      const ids = new Set(group.map(i => i.id))
      return { ...prev, items: prev.items.filter(i => !ids.has(i.id)) }
    })
    // TODO: call delete invoice API
  }

  // ─── Customer data ────────────────────────────────────────────────────────

  const fullName = [order?.user.surName, order?.user.name, order?.user.middleName]
    .filter(Boolean)
    .join(' ')

  const copyFullName = () => {
    copyText(fullName)

    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current) // защита от повторных кликов
    timeoutRef.current = setTimeout(() => setCopied(false), 10000)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // ─── Render ───────────────────────────────────────────────────────────────

  if (!order) {
    return <div className="w-full p-[40px] text-[16px] font-medium">Загрузка заказа...</div>
  }

  // Status label — can be double for multi-shop orders
  const statusDisplay = isMultiShop
    ? `${statusLabels[order.status] || order.status} / ${statusLabels[order.status] || order.status}`
    : statusLabels[order.status] || order.status

  const handleSubmit = () => {
    // orders/admin/{orderId}/delivery-range

    // PATCH body: { deliveryFrom: string, deliveryTo: string }

    axios
      .patch(
        `${API_URL}/orders/admin/${order.id}/delivery-range`,
        {
          deliveryFrom: deliveryFrom ? deliveryFrom.toISOString() : null,
          deliveryTo: deliveryTo ? deliveryTo.toISOString() : null,
        },
        { headers: authHeaders }
      )
      .then(() => {
        toast.success('Даты успешно обновлены')
        navigate(`/admin/orders`) // Refresh page to get updated data from API
      })
      .catch(console.error)
  }

  return (
    <div className="flex w-full flex-col gap-[48px] p-[40px]">
      {/* ── Header ── */}
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-[4px]">
          <h1 id="h1">Заказ №{order.orderNumber}</h1>
          <p className="p1">от {formatDate(order.createdAt)}</p>
        </div>

        <div className="flex items-center gap-[8px]">
          <h3 id="h3">Статус заказа</h3>
          <p className="p2 w-fit text-[12px_!important]" id="admin-button">
            {statusDisplay}
          </p>
        </div>
      </div>

      {/* ── Customer data ── */}
      <section className="flex w-full flex-col gap-[24px]">
        <div className="flex w-full items-center justify-between">
          <h3 id="h3">Данные покупателя</h3>

          {/* Copies full name only */}
          <button
            id="admin-button"
            onClick={copyFullName}
            className="flex items-center gap-[8px] rounded-[12px] bg-[#4D4E50_!important] px-[22px] py-[10px] text-[14px] font-[600] text-[#FFFFFF]"
          >
            {copied ? 'Скопировано' : 'Скопировать'}
            <BsCopy className="rotate-[270deg] shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-[24px]">
          <CopyField
            label="Фамилия"
            value={order.user.surName}
            onCopy={() => copyText(order.user.surName)}
          />
          <CopyField label="Имя" value={order.user.name} onCopy={() => copyText(order.user.name)} />
          <CopyField
            label="Отчество"
            value={order.user.middleName}
            onCopy={() => copyText(order.user.middleName)}
          />

          <CopyField
            label="Номер телефона"
            value={order.user.phone}
            onCopy={() => copyText(order.user.phone)}
            renderValue={value => (
              <PatternFormat
                value={value || ''}
                format="+# (###) ###-##-##"
                displayType="text"
                className="text-[14px]"
              />
            )}
          />

          <CopyField
            label="E-mail"
            value={order.user.email}
            onCopy={() => copyText(order.user.email)}
          />

          <div />

          <button
            id="admin-button"
            className="col-span-2 flex h-[40px] items-center justify-center gap-[8px] rounded-[12px] bg-[#4D4E50_!important] px-[22px] text-[14px] font-[600] text-white"
            disabled
          >
            Перейти в профиль клиента
          </button>
        </div>
      </section>

      {/* ── Order description ── */}
      <section className="flex w-full flex-col gap-[24px]">
        <h3 id="h3">Описание заказа</h3>
        {/* Delivery address row */}
        <div className="grid grid-cols-[1fr_2fr] gap-[24px]">
          <CopyField
            label="Город"
            value={order.address.city}
            onCopy={() => undefined}
            isCopyable={false}
          />
          {order.address.type === 'PVZ' && (
            <CopyField
              label="Адрес ПВЗ"
              value={order.address.type === 'PVZ' ? order.address.fullAddress : '-'}
              onCopy={() => undefined}
              isCopyable={false}
            />
          )}
          {order.address.type !== 'PVZ' && (
            <CopyField
              label="Адрес доставки"
              value={order.address.type !== 'PVZ' ? order.address.fullAddress : '-'}
              onCopy={() => undefined}
              isCopyable={false}
            />
          )}
        </div>
        <Divider />
        {/* Payment + dates row */}
        <div className="grid grid-cols-4 gap-[24px]">
          <CopyField
            label="Способ оплаты"
            value={order.paymentType ? paymentLabels[order.paymentType] || order.paymentType : '-'}
            onCopy={() => undefined}
            isCopyable={false}
          />

          {/* Дата отправки */}
          <div ref={shippingRef} className="relative">
            <DateField
              label="Дата отправки"
              displayValue={formatDate(order.shipmentDate) || '-'}
              onCalendarClick={() => {
                setDeliveryCalOpen(false)
                setShippingCalOpen(v => !v)
              }}
            />
            {shippingCalOpen && (
              <DatePicker
                value={shippingDate}
                onChange={date => {
                  setShippingDate(date)
                  setShippingCalOpen(false)
                }}
                onClose={() => setShippingCalOpen(false)}
              />
            )}
          </div>

          {/* Желаемая дата доставки — выбираем from, to = from + 2 рабочих дня */}
          <div ref={deliveryRef} className="relative">
            <DateField
              label="Желаемая дата доставки"
              displayValue={
                deliveryFrom && deliveryTo
                  ? `${formatDate(deliveryFrom)} - ${formatDate(deliveryTo)}`
                  : '-'
              }
              onCalendarClick={() => {
                setShippingCalOpen(false)
                setDeliveryCalOpen(v => !v)
              }}
            />
            {deliveryCalOpen && (
              <DatePicker
                value={deliveryFrom}
                onChange={date => {
                  setDeliveryFrom(date)
                  setDeliveryCalOpen(false)
                }}
                onClose={() => setDeliveryCalOpen(false)}
              />
            )}
          </div>

          <CopyField
            label="Срок доставки"
            value={deliveryDaysLabel}
            onCopy={() => undefined}
            isCopyable={false}
          />
        </div>
        <Divider />
        {/* Price row */}
        <div className="grid grid-cols-[1fr_auto_0.6fr_0.8fr_0.7fr] gap-[24px] items-end">
          {/* Общая стоимость */}
          <div className="grid grid-cols-[1fr_auto] gap-[8px]">
            <CopyField
              label="Общая стоимость заказа"
              value={formatMoney(order.totalAmount)}
              onCopy={() => undefined}
              isCopyable={false}
            />
            <p className="self-end pb-[10px] text-[14px]">Руб.</p>
          </div>

          {/* Промокод */}
          <CopyField
            label="Промокод"
            value={order.promoCodeId ? order.promoCode?.code : '-'}
            onCopy={() => undefined}
            isCopyable={false}
          />

          {/* Скидка */}
          <div className="flex flex-col gap-[8px]">
            <div className="h-[21px]" />
            <InfoPill>
              Скидка{' '}
              {order.items.reduce((sum, item) => sum + Number(item.discountAmount || 0), 0) || '0 '}
              {order.promoCode?.type == 'PERCENT' ? '%' : ' руб'}
            </InfoPill>
          </div>

          {/* Размер скидки */}
          <div className="flex flex-col gap-[8px]">
            <div className="h-[21px]" />
            <InfoPill>
              Размер скидки <br />
              {order.promoCode == null
                ? '0'
                : order.promoCode?.type == 'PERCENT'
                  ? `-${Math.round((Number(order.totalAmount) * order.promoCode?.value) / 100)} руб`
                  : `-${order.items.reduce(
                      (sum, item) => sum + Number(item.discountAmount || 0),
                      0
                    )} руб`}
            </InfoPill>
          </div>

          {/* Стоимость доставки — всегда 0 */}
          <CopyField
            label="Стоимость доставки"
            value="0"
            onCopy={() => undefined}
            isCopyable={false}
          />
        </div>{' '}
        <Divider />
        {/* Price row */}
        <div className="grid grid-cols-[1fr] gap-[24px] items-end">
          {/* Стоимость доставки — всегда 0 */}
          <CopyField
            label="Адрес отправителя"
            value={
              `${order.items[0]?.storeName} – ${order.items[0]?.storeAddress}` ||
              order.address.fullAddress ||
              '-'
            }
            onCopy={() => undefined}
            isCopyable={false}
          />
        </div>
      </section>

      {/* ── Order composition ── */}
      <section className="flex w-full flex-col gap-[24px]">
        <h3 id="h3">Состав заказа</h3>

        {/* 1 or 2 columns depending on number of shops */}
        <div className={`grid gap-[24px] ${isMultiShop ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {itemGroups.map((groupItems, groupIdx) => (
            <InvoiceCard
              key={groupIdx}
              totalItemsCount={itemGroups.reduce((sum, g) => sum + g.length, 0)}
              order={order}
              groupIndex={groupIdx + 1}
              totalGroups={itemGroups.length}
              items={groupItems}
              shopAddress={groupItems[0]?.storeAddress || order.address.fullAddress || ''}
              trackingNumber={trackingNumbers[groupIdx] || ''}
              onTrackingChange={val =>
                setTrackingNumbers(prev => {
                  const next = [...prev]
                  next[groupIdx] = val
                  return next
                })
              }
              onSaveTracking={() => updateTrackingNumber(groupIdx)}
              onSaveMarking={updateMarkingCode}
              onDeleteItem={deleteItem}
              onDeleteInvoice={() => deleteInvoice(groupIdx)}
            />
          ))}
        </div>
      </section>

      {/* ── Bottom actions ── */}
      <div className="grid grid-cols-2 gap-[24px]">
        <button className="h-[48px] rounded-[12px] bg-[#4D4E50] text-[14px] font-[600] text-white">
          Отменить
        </button>
        <button
          id="admin-button"
          className="flex h-[48px_!important] items-center justify-center rounded-[12px] text-[14px] font-[600] text-white"
          onClick={handleSubmit}
        >
          Сохранить
        </button>
      </div>
    </div>
  )
}

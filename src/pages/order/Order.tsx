import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ROUTER_PATHS } from '@/shared/config/routes'
import styles from './Order.module.scss'
import handed from './handed.png'
import packing from './packing.png'
import processing from './processing.png'
import shipping from './shipping.png'
import { NumericFormat } from 'react-number-format'
import { toast } from 'react-toastify'
import { FcCancel } from 'react-icons/fc'

const API_URL = import.meta.env.VITE_APP_API_URL

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: number
  orderId: number
  variantId: number
  quantity: number
  price: string
  colorAlias: string | null
  markingCode: string | null
  deliveryStatus: 'NOT_DELIVERED' | 'DELIVERED' | 'RETURNED'
  variant: {
    id: number
    colorAlias: string | null
    sizeValue: { id: number; name: string } | null
    colorAttrValue: {
      id: number
      value: string
      meta?: { colorCode?: string }
    } | null
    product: {
      id: number
      name: string
      articul: string
      imageUrl: string | null
      media: { id: number; url: string; kind: string; colorAttrValueId: number | null }[]
      oldPrice: string | null
    }
  }
}

interface Order {
  promoDiscountAmount: string | number | null | undefined
  id: number
  orderNumber: string
  orderGroup: string
  status: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  adminStatus: string
  totalAmount: string
  promoCodeId: number | null
  paymentType: string
  deliveryFrom: string | null
  deliveryTo: string | null
  trackingNumber: string | null
  trackingUrl: string | null
  invoiceNumber: string | null
  createdAt: string
  address: {
    fullAddress: string
    city: string
    type: 'PVZ' | 'DELIVERY'
  }
  items: OrderItem[]
}

interface User {
  name: string
  middleName: string
  surName: string
  phone: string
  email: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; step: number; color: string }> = {
  NEW: { label: 'В сборке', step: 1, color: '#D42B2B' },
  PROCESSING: { label: 'В сборке', step: 1, color: '#D42B2B' },
  SHIPPED: { label: 'Отправлен', step: 2, color: '#D42B2B' },
  DELIVERED: { label: 'Доставлен', step: 3, color: '#22C55E' },
  CANCELLED: { label: 'Отменён', step: 2, color: '#D42B2B' },
}

const PAYMENT_LABELS: Record<string, string> = {
  OFFLINE: 'Сдэк',
  ONLINE: 'Онлайн',
  CASH: 'Наличными',
  CARD: 'Картой',
}

const { PROFILE } = ROUTER_PATHS

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (date?: string | null) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const fmtMoney = (val?: string | number | null) => {
  if (val === null || val === undefined || val === '') return '—'
  return Number(val).toLocaleString('ru-RU') + ' ₽'
}

const getProductImage = (item: OrderItem): string | null => {
  const media = item.variant.product.media
  // prefer photo matching variant color, then any photo, then cover
  const colorId = item.variant.colorAttrValue?.id
  const match = media.find(m => m.kind === 'cover' && m.colorAttrValueId === colorId)
  const anyPhoto = media.find(m => m.kind === 'photo')
  const cover = media.find(m => m.kind === 'cover')
  return match?.url || cover?.url || anyPhoto?.url || item.variant.product.imageUrl || null
}

// ─── Status Progress Bar ──────────────────────────────────────────────────────

const steps = [
  { label: 'Принят', image: <img src={processing} /> },
  { label: 'В сборке', image: <img src={packing} /> },
  { label: 'Отправлен', image: <img src={shipping} /> },
  { label: 'Доставлен', image: <img src={handed} /> },
]

const StatusBar = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.NEW
  const currentIdx = cfg.step - 1
  const nextStep = currentIdx + 1 < steps.length ? steps[currentIdx + 1] : null

  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-[12px]">
          <div className="h-[30px] min-w-[40px]">{steps[0].image}</div>
          <span className="text-[11px] font-medium whitespace-nowrap text-[#D42B2B]">
            {steps[0].label}
          </span>
        </div>
        <div className="h-[2px] w-full bg-[#D42B2B] mx-auto" />

        <div className="flex items-center gap-[12px]">
          <div className="min-w-[36px]">
            <FcCancel className="text-[36px]" />
          </div>
          <span className="text-[11px] font-medium whitespace-nowrap text-[#D42B2B]">Отменен</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* sm: вертикально */}
      <div className="flex flex-col sm:hidden">
        <div className="flex items-center gap-[12px]">
          <div className="h-[30px] min-w-[40px]">{steps[currentIdx].image}</div>
          <span className="text-[11px] font-medium whitespace-nowrap text-[#D42B2B]">
            {steps[currentIdx].label}
          </span>
        </div>

        {nextStep && (
          <>
            <div className="w-[2px] h-[24px] bg-[#D42B2B] mx-auto" />
            <div className="flex items-center gap-[12px]">
              <div className="h-[30px] min-w-[40px] opacity-35">{nextStep.image}</div>
              <span className="text-[11px] font-medium whitespace-nowrap text-[#9B9B9B]">
                {nextStep.label}
              </span>
            </div>
          </>
        )}
      </div>

      {/* sm → lg: текущий и следующий горизонтально с полоской между */}
      <div className="hidden sm:flex lg:hidden items-center gap-[16px]">
        {/* Текущий */}
        <div className="flex items-center gap-[12px] shrink-0">
          <div className="h-[30px] min-w-[40px]">{steps[currentIdx].image}</div>
          <span className="text-[11px] font-medium whitespace-nowrap text-[#D42B2B]">
            {steps[currentIdx].label}
          </span>
        </div>

        {/* Полоска */}
        {nextStep && (
          <>
            <div className="h-[2px] flex-1 bg-[#D42B2B]" />

            {/* Следующий */}
            <div className="flex items-center gap-[12px] shrink-0">
              <div className="h-[30px] min-w-[40px] opacity-35">{nextStep.image}</div>
              <span className="text-[11px] font-medium whitespace-nowrap text-[#9B9B9B]">
                {nextStep.label}
              </span>
            </div>
          </>
        )}
      </div>

      {/* lg+: все 4 шага горизонтально */}
      <div className="hidden lg:grid grid-cols-4">
        {steps.map((step, i) => {
          const stepNum = i + 1
          const active = cfg.step >= stepNum
          const isLast = i === steps.length - 1
          return (
            <div key={step.label} className="flex items-center gap-[16px]">
              <div className="flex items-center gap-[12px]">
                <div className="h-[30px] min-w-[40px]">{step.image}</div>
                <span
                  className="text-[11px] font-medium whitespace-nowrap transition-colors"
                  style={{ color: active ? '#D42B2B' : '#9B9B9B' }}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className="h-[2px] w-full shrink-1 transition-colors mr-[16px]"
                  style={{ background: cfg.step > stepNum ? '#D42B2B' : '#D9D9D9' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
// ─── Order Item Row ───────────────────────────────────────────────────────────

const OrderItemRow = ({ item }: { item: OrderItem }) => {
  const img = getProductImage(item)
  const color =
    item.colorAlias || item.variant.colorAlias || item.variant.colorAttrValue?.value || '—'
  const size = item.variant.sizeValue?.name || '—'
  const colorCode = item.variant.colorAttrValue?.meta?.colorCode
  const oldPrice = Number(item?.variant.product.oldPrice)
  const price = Number(item.price)

  return (
    <div key={color} className="flex flex-col sm:flex-row gap-[20px]">
      <img src={img || ''} className="w-[120px] aspect-[12/17] object-cover" alt="" />
      <div className="flex flex-row w-full justify-between gap-[16px] md:gap-[24px]">
        <div className="flex flex-col gap-[16px] md:gap-[20px]">
          <h5 className="h5 -mb-[10px] md:mb-0">{item?.variant.product.name}</h5>
          <div className="flex sm:hidden gap-[8px]">
            <NumericFormat
              allowNegative={false}
              value={item.price}
              suffix=" ₽"
              className="h5"
              thousandSeparator=" "
              displayType="text"
            />
            {oldPrice && oldPrice > 0 ? (
              <>
                <NumericFormat
                  allowNegative={false}
                  value={item?.variant.product.oldPrice}
                  suffix=" ₽"
                  className="text-[var(--service)_!important] p1 line-through"
                  thousandSeparator=" "
                  displayType="text"
                />

                <NumericFormat
                  value={Math.round(((oldPrice - price) / oldPrice) * 100)}
                  suffix="%"
                  prefix="-"
                  allowNegative={false}
                  className="text-[var(--red)_!important] p1"
                  thousandSeparator=" "
                  displayType="text"
                />
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-[16px]">
            <p className="p1 text-[15px] md:text-[18px] w-[90px]">Модель:</p>
            <p className="p1 text-[15px] md:text-[18px] w-[90px]">{item.variant.product.articul}</p>
          </div>
          <div className="flex items-center gap-[16px]">
            <p className="p1 text-[15px] md:text-[18px] w-[90px]">Размер:</p>
            <p className="p1 text-[15px] md:text-[18px] w-[90px]">{size}</p>
          </div>
          <div className="flex items-center gap-[16px]">
            <p className="p1 text-[15px] md:text-[18px] w-[90px]">Цвет:</p>
            <p className="p1 text-[15px] md:text-[18px] w-[90px] flex items-center">
              {' '}
              <span
                className="block min-w-[24px] h-[24px] rounded-[50%] mr-[8px]"
                style={{ background: colorCode }}
              ></span>{' '}
              {item.colorAlias ? item.colorAlias : 'Без цвета'}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] align-end justify-between">
          <div className="hidden sm:flex sm:flex-col gap-[8px]">
            <div className="flex items-center justify-end gap-[4px] whitespace-nowrap">
              <NumericFormat
                allowNegative={false}
                value={item.price}
                suffix=" ₽"
                className="h5"
                thousandSeparator=" "
                displayType="text"
              />

              {oldPrice && oldPrice > 0 ? (
                <NumericFormat
                  allowNegative={false}
                  value={Math.round(((oldPrice - price) / oldPrice) * 100)}
                  suffix="%"
                  prefix="-"
                  className="text-[var(--red)_!important] p1"
                  thousandSeparator=" "
                  displayType="text"
                />
              ) : null}
            </div>
            {oldPrice && oldPrice > 0 ? (
              <NumericFormat
                value={oldPrice}
                suffix=" ₽"
                className="text-[var(--service)_!important] p1 line-through ml-auto"
                thousandSeparator=" "
                displayType="text"
                allowNegative={false}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Info Row (label + value) ─────────────────────────────────────────────────

const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex flex-col gap-[12px]">
    <p className="h5 mb-[2px]">{label}</p>
    <p className="p1">{value || '—'}</p>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

export const Order = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      axios.get(`${API_URL}/orders/my/${id}`, { headers }),
      axios.get(`${API_URL}/users/me`, { headers }),
    ])
      .then(([orderRes, userRes]) => {
        setOrder(orderRes.data)
        setUser(userRes.data)
        window.document.title = `Заказ №${orderRes.data.orderNumber}`
      })
      .catch(() => setError('Не удалось загрузить заказ'))
      .finally(() => setLoading(false))

    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-[15px] text-[#9B9B9B]">Загрузка заказа...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-[15px] text-[#D42B2B]">{error || 'Заказ не найден'}</p>
      </div>
    )
  }

  const fullName = [user?.surName, user?.name, user?.middleName].filter(Boolean).join(' ')
  const totalItems = order.items.reduce((acc, i) => acc + i.quantity, 0)

  const cancelOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    axios
      .post(`${API_URL}/orders/my/${order.id}/cancel`, null, { headers })
      .then(() => {
        setOrder({ ...order, status: 'CANCELLED' })
        setIsCancelling(false)
        toast.info('Заказ успешно отменён')
      })
      .catch(() => {
        alert('Не удалось отменить заказ. Пожалуйста, попробуйте снова.')
      })
  }

  return (
    <div className="w-full bg-white flex flex-col gap-[12px] p-[var(--sides-padding)] pt-[48px]">
      <div className="flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[12px]">
          {/* ── Breadcrumb ── */}
          <div className="flex items-center gap-2 text-[12px] text-[#9B9B9B]">
            <Link
              to={`${PROFILE}/orders`}
              className="text-[#D42B2B_!important] transition-colors p1"
            >
              {'<-'} В историю заказов
            </Link>
          </div>
          {/* ── Title ── */}
          <h1 className="h2 font-bold text-[#1A1A1A] leading-tight">
            Заказ №{order.orderNumber}
          </h1>{' '}
          {/* ── Title ── */}
          <h1 className="h5 font-bold text-[#B0B7BF_!important] leading-tight">
            {new Date(order.createdAt).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </h1>
        </div>
        {/* ── Status block ── */}
        <p className="h4 font-semibold text-[#6B6B6B] tracking-wide">Статус заказа</p>{' '}
      </div>
      <div className="flex flex-col lg:flex-row gap-[12px] items-start">
        <div className="flex flex-col gap-[12px] flex-1">
          <div className="rounded-2xl shadow-[0px_4px_16.2px_0px_#0000000D] p-[36px]">
            <StatusBar status={order.status} />
          </div>
          {/* ── Items ── */}
          <div className="shadow-[0px_4px_16.2px_0px_#0000000D] py-[32px] px-[16px] md:px-[32px] rounded-[12px]">
            <h4 className="mb-[40px] h4">Состав заказа</h4>
            {order.items.map(item => (
              <OrderItemRow key={item.id} item={item} />
            ))}
            <div className="my-[40px]">
              <hr className="border-[#F2F2F2]" />
            </div>
            {/* Total */}
            <div className="mt-4 flex items-center justify-between rounded-[12px]">
              <p className="h5">
                Итого ({totalItems}{' '}
                {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'})
              </p>
              <p className="h5">{fmtMoney(order.totalAmount)}</p>
            </div>

            {order.promoCodeId && (
              <div className="mt-4 flex items-center justify-between rounded-[12px]">
                <p className="p1">Промокод</p>
                <p className="p1">{fmtMoney(order.promoDiscountAmount)}</p>
              </div>
            )}

            {order.promoCodeId && (
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[13px] text-[#9B9B9B]">Промокод применён</p>
                <p className="text-[13px] font-semibold text-[#D42B2B]">Скидка применена</p>
              </div>
            )}
          </div>
          {/* ── Order details ── */}
          <div className="shadow-[0px_4px_16.2px_0px_#0000000D] py-[32px] px-[16px] md:px-[32px] rounded-[12px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {/* Customer */}
              <InfoRow label="Покупатель" value={fullName || '—'} />
              <InfoRow
                label="Способ оплаты"
                value={PAYMENT_LABELS[order.paymentType] || order.paymentType}
              />
              <InfoRow label="Контактный телефон" value={user?.phone} />
              <InfoRow label="Статус оплаты" value="Оплата при получении" />
              <InfoRow label="Адрес доставки" value={order.address.fullAddress} />
              {order.address.type !== 'PVZ' && (
                <InfoRow
                  label="Дата доставки"
                  value={
                    order.deliveryFrom && order.deliveryTo
                      ? `${fmt(order.deliveryFrom)} — ${fmt(order.deliveryTo)}`
                      : fmt(order.deliveryFrom)
                  }
                />
              )}
              <InfoRow
                label="Способ получения"
                value={order.address.type === 'PVZ' ? 'Пункт выдачи' : 'Курьер'}
              />
            </div>

            {/* Tracking */}
            {(order.trackingNumber || order.invoiceNumber) && (
              <div className="mt-5 pt-5 border-t border-[#F2F2F2]">
                <p className="mb-2 text-[11px] text-[#9B9B9B] uppercase tracking-wide font-semibold">
                  Номер отслеживания
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[15px] font-bold text-[#1A1A1A]">
                    {order.trackingNumber || order.invoiceNumber}
                  </span>
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-[#D42B2B] px-3 py-1 text-[12px] font-semibold text-white hover:bg-[#B52020] transition-colors"
                    >
                      Отследить →
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {order.status !== 'CANCELLED' && (
          <div className="shadow-[0px_4px_16.2px_0px_#0000000D] rounded-[12px] h-fit px-[24px] py-[32px] flex flex-col w-full lg:w-fit gap-[24px]">
            <button
              id="admin-button"
              className="flex justify-center text-center"
              onClick={() => setIsCancelling(true)}
            >
              Отменить заказ
            </button>
            {/* <button
          id="admin-button"
          className="text-[#282B32_!important] flex justify-center text-center bg-[#FAFAFA_!important] rounded-lg py-3 px-4 font-semibold hover:bg-[#F5F5F5_!important] transition-colors"
        >
          Помощь с заказом
        </button> */}
          </div>
        )}
      </div>

      {isCancelling && (
        <div className={`${styles.modal} flex p-[10px] `}>
          <button
            className="z-40 absolute w-full h-screen opacity-0"
            onClick={() => setIsCancelling(false)}
          ></button>
          <form onSubmit={cancelOrder} className={styles.modal_body}>
            <h2 id="h2">Вы уверены,что хотите отменить заказ?</h2>

            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setIsCancelling(false)}
                className="bg-service text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Да, уверен
              </button>
            </section>
          </form>
        </div>
      )}
    </div>
  )
}

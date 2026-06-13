import { useEffect, useState } from 'react'
import axios from 'axios'
import { FiChevronDown, FiTrash2 } from 'react-icons/fi'

type OrderUser = {
  id: number
  email: string
  name: string | null
  middleName: string | null
  surName: string | null
  phone: string | null
}

type OrderItem = {
  storeName: any
  variant: any
  id: number
  orderId: number
  variantId: number
  quantity: number
  price: string
  colorAlias: string | null
  markingCode: string | null
  deliveryStatus: string
  createdAt: string
}

type OrderAddress = {
  id: number
  fullAddress: string
  city: string | null
  type: string | null
}

type Order = {
  id: number
  orderNumber: string
  orderGroup: string
  userId: number
  addressId: number
  status: string
  adminStatus: string
  totalAmount: string
  promoCodeId: number | null
  paymentType: string
  deliveryFrom: string | null
  deliveryTo: string | null
  comment: string | null
  createdAt: string
  updatedAt: string
  user: OrderUser
  items: OrderItem[]
  address: OrderAddress | null
}

const paymentTypeLabels: Record<string, string> = {
  ONLINE: 'Онлайн',
  OFFLINE: 'Офлайн',
  CASH: 'Наличные',
  CARD: 'Карта',
}

const adminStatusLabels: Record<string, string> = {
  NEW_ORDERS: 'Новый',
  IN_PROGRESS: 'В процессе',
  DELIVERED: 'Доставлен',
  NOT_REDEEMED: 'Не выкуплен',
  RETURNED: 'Возврат',
}

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const formatMoney = (value: string) => {
  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return `${value} ₽`
  }

  return currencyFormatter.format(amount)
}

const formatDate = (value: string | null) => {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('ru-RU').format(new Date(value))
}

const getPaymentLabel = (paymentType: string) => {
  return paymentTypeLabels[paymentType] || paymentType
}

const getStatusLabel = (adminStatus: string) => {
  return adminStatusLabels[adminStatus] || adminStatus
}

export default function NewOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [openedOrderId, setOpenedOrderId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await axios.get<Order[]>(
        `${import.meta.env.VITE_APP_API_URL}/orders/admin`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setOrders(response.data)
    } catch (requestError) {
      setError('Не удалось загрузить новые заказы')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    window.scrollTo(0, 0)
    window.document.title = 'Новые заказы - Умная одежда'
  }, [])

  return (
    <main className="min-h-screen bg-[#FFFFFF] px-[48px] py-[56px] text-[#1F2937]">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-[54px] flex items-center justify-between gap-[24px]">
          <div>
            <h1 id="h1">Новые заказы</h1>
          </div>
        </div>

        <div className="overflow-visible rounded-[14px] border-[1px] border-solid border-[#E5E7EB] bg-[#FFFFFF] pr-[0px]">
          <div className="grid h-[44px] grid-cols-[140fr_122fr_140fr_141fr_106fr_122fr_250fr] items-center border-b-[1px] border-solid border-[#ECEEF2] bg-[#FAFAFB] px-[28px] text-[14px] font-[600] text-[#6B7280]">
            <p className="text-[12px] text-[#717680] text-center">Номер заказа</p>
            <p className="text-[12px] text-[#717680] text-center">Дата</p>
            <p className="text-[12px] text-[#717680] text-center">
              Кол-во позиций <br /> в заказе
            </p>
            <p className="text-[12px] text-[#717680] text-center">Способ оплаты</p>
            <p className="text-[12px] text-[#717680] text-center">Сумма</p>
            <p className="text-[12px] text-[#717680] text-center">Статус</p>
            <p className="text-[12px] text-[#717680] text-center"></p>
          </div>

          {isLoading && (
            <div className="flex h-[260px] items-center justify-center text-[16px] font-[500] text-[#6B7280]">
              Загрузка заказов...
            </div>
          )}

          {!isLoading && error && (
            <div className="flex h-[260px] flex-col items-center justify-center gap-[16px] text-center">
              <p className="text-[17px] font-[600] text-[#EF233C]">{error}</p>
              <button
                type="button"
                className="h-[42px] rounded-[12px] bg-[#4B4B4D] px-[22px] text-[14px] font-[600] text-[#FFFFFF]"
                onClick={fetchOrders}
              >
                Попробовать снова
              </button>
            </div>
          )}

          {!isLoading && !error && orders.length === 0 && (
            <div className="flex h-[260px] items-center justify-center text-[16px] font-[500] text-[#6B7280]">
              Новых заказов пока нет
            </div>
          )}

          {!isLoading &&
            !error &&
            orders.map((order, orderIndex) => {
              const isOpened = openedOrderId === order.id
              const shouldOpenUp = orders.length - orderIndex <= 2

              return (
                <div key={order.id} className="relative">
                  <div className="grid min-h-[74px] grid-cols-[140fr_122fr_140fr_141fr_106fr_122fr_250fr] items-center border-b-[1px] border-solid border-[#ECEEF2] px-[28px] text-[15px] font-[500] text-[#111827]">
                    <p className="text-[14px] text-center">№{order.orderNumber}</p>
                    <p className="text-[14px] text-center">{formatDate(order.createdAt)}</p>

                    <button
                      type="button"
                      className="flex items-center justify-center gap-[8px] text-[16px] font-[600]"
                      onClick={() => setOpenedOrderId(isOpened ? null : order.id)}
                    >
                      {order.items.length}
                      <FiChevronDown
                        className={[
                          'text-[18px] text-[#EF233C] transition',
                          isOpened ? 'rotate-180' : 'rotate-0',
                        ].join(' ')}
                      />
                    </button>

                    <p className="text-[14px] text-center">{getPaymentLabel(order.paymentType)}</p>
                    <p className="text-[14px] text-center">{formatMoney(order.totalAmount)}</p>

                    <div className="h-full">
                      <span
                        className={[
                          'inline-flex h-full min-w-[116px] items-center justify-center rounded-[0px] px-[14px] text-[14px] font-[500]',
                          order.adminStatus === 'NEW_ORDERS'
                            ? 'bg-[#C9FFD0] text-[#1F2937]'
                            : 'bg-[#F2F4F7] text-[#1F2937]',
                        ].join(' ')}
                      >
                        {getStatusLabel(order.adminStatus)}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-[12px] p-[16px] pr-[0px]">
                      <button
                        type="button"
                        className="flex h-[46px] text-[12px] whitespace-nowrap min-w-[150px] items-center justify-center gap-[8px] rounded-[12px] bg-[#4B4B4D] font-[600] text-[#FFFFFF]"
                        onClick={() => window.open(`/admin/orders/${order.id}`, '_blank')}
                      >
                        Просмотр заказа
                      </button>

                      <button
                        type="button"
                        className="flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-[#FFF1F3] text-[22px] text-[#EF233C]"
                        aria-label="Удалить заказ"
                        onClick={() => setDeletingOrderId(order.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {isOpened && (
                    <div
                      className={[
                        'absolute left-[480px] z-[5] w-[510px] overflow-hidden rounded-[8px] bg-[#FFFFFF]',
                        shouldOpenUp ? 'bottom-[58px]' : 'top-[58px]',
                      ].join(' ')}
                    >
                      <div className="grid h-[52px] grid-cols-[1fr_1fr_1fr] items-center bg-[#E7E7E8] px-[22px] text-[14px] font-[500] text-[#5F636B]">
                        <p>Артикул и магазин</p>
                        <p>Цвет</p>
                        <p>Цена</p>
                      </div>

                      {order.items.map(item => (
                        <div
                          key={item.id}
                          className="grid min-h-[64px] grid-cols-[1fr_1fr_1fr] items-center border-t-[1px] border-solid border-[#ECEEF2] px-[22px] text-[15px] font-[500] text-[#222222]"
                        >
                          <p>
                            {item.variant.product.articul}, {item.storeName}
                          </p>
                          <p>{item.colorAlias || '-'}</p>
                          <p>{formatMoney(item.price)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>
      {deletingOrderId && (
        <div className="fixed inset-0 z-[10] flex items-center justify-center bg-[#00000080]">
          <div className="flex w-[680px] flex-col items-center gap-[24px] rounded-[12px] bg-[#FFFFFF] px-[32px] py-[40px] text-center">
            <p className="text-[18px] font-[600] text-left " id="h2">
              Вы уверены, что хотите удалить заказ №
              {orders.find(o => o.id === deletingOrderId)?.orderNumber}?
            </p>

            <div className="flex w-full items-center justify-end gap-[16px]">
              <button
                type="button"
                className="w-fit h-[42px] rounded-[12px] bg-[var(--service)] px-[22px] text-[14px] font-[600] text-[#FFFFFF]"
                onClick={() => setDeletingOrderId(null)}
              >
                Отмена
              </button>

              <button
                type="button"
                className="w-fit h-[42px] rounded-[12px] bg-[#E02844] px-[22px] text-[14px] font-[600] text-[#FFFFFF]"
                onClick={() => {
                  axios(`${import.meta.env.VITE_APP_API_URL}/orders/${deletingOrderId}`, {
                    method: 'DELETE',
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                  })
                    .then(() => {
                      setOrders(prev => prev.filter(o => o.id !== deletingOrderId))
                      setDeletingOrderId(null)
                    })
                    .catch(() => {
                      alert('Не удалось удалить заказ')
                      setDeletingOrderId(null)
                    })
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

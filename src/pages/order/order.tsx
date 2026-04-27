import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { NumericFormat, PatternFormat } from 'react-number-format'
import { Link, useNavigate } from 'react-router-dom'
import { FaChevronRight, FaPlus } from 'react-icons/fa'
import { BsCheck } from 'react-icons/bs'
import { CgChevronRight, CgClose } from 'react-icons/cg'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { setCartCount } from '@/app/store/cartCount'
import PvzMapWidget from './pvz/PvzMapWidget'
import locationMark from './local-two.svg'

type DeliveryType = 'Самовывоз' | 'До пункта выдачи' | 'Курьером'
type PaymentType = 'ONLINE' | 'OFFLINE'

const API_URL = import.meta.env.VITE_APP_API_URL

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

const jsonAuthHeaders = () => ({
  ...authHeaders(),
  'Content-Type': 'application/json',
})

const getAddressText = (address: any) =>
  address?.location?.address_full || address?.location?.address || address?.fullAddress || ''

const normalizeSavedAddress = (address: any) => ({
  ...address,
  location: {
    ...address.location,
    address_full: address.fullAddress || address?.location?.address_full || '',
  },
})

export const Order = () => {
  const [cart, setCart] = useState<any[]>([])
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('Самовывоз')
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [promo, setPromo] = useState('')
  const [user, setUser] = useState<any>(null)
  const [addressModalOpened, setAddressModalOpened] = useState(false)
  const [isAddressSelected, setIsAddressSelected] = useState(false)
  const [isDefaultAddress, setIsDefaultAddress] = useState(false)
  const [payRulesAgreed, setPayRulesAgreed] = useState(false)
  const [personalDataAgreed, setPersonalDataAgreed] = useState(false)
  const [paymentType, setPaymentType] = useState<PaymentType>('OFFLINE')
  const [promoDiscount, setPromoDiscount] = useState<string>()
  const [deliveryDates, setDeliveryDates] = useState<any>([])
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<any>()

  const { CART, ORDER } = ROUTER_PATHS
  const pathname = location.pathname
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isPvz = deliveryType === 'До пункта выдачи'
  const isCourier = deliveryType === 'Курьером'

  const savedAddresses = useMemo(() => user?.addresses || [], [user])
  const filteredAddresses = useMemo(
    () =>
      savedAddresses.filter((address: any) =>
        isPvz ? address.type === 'PVZ' : address.type !== 'PVZ'
      ),
    [savedAddresses, isPvz]
  )

  const totals = useMemo(() => {
    const totalProductsPrice = cart.reduce((sum, item) => {
      const price = item.oldPrice && item.oldPrice > 0 ? item.oldPrice : item.price
      return sum + +price
    }, 0)

    const totalDiscount = cart.reduce((sum, item) => {
      return sum + +(item.oldPrice && item.oldPrice > 0 ? item.oldPrice - item.price : 0)
    }, 0)

    const totalPrice =
      cart.reduce((sum, item) => sum + +item.price, 0) -
      (promoDiscount ? +promoDiscount : 0) +
      (isCourier ? 1000 : 0)

    return { totalProductsPrice, totalDiscount, totalPrice }
  }, [cart, promoDiscount, isCourier])

  useEffect(() => {
    document.title = 'Оформление заказа - Умная одежда'
    window.scrollTo(0, 0)

    const token = localStorage.getItem('token')

    if (!token) {
      const localCart = localStorage.getItem('cart')
      if (localCart) setCart(JSON.parse(localCart))
      return
    }

    axios(`${API_URL}/cart`, { headers: authHeaders() })
      .then(res => {
        setCart(res.data?.items || [])
        localStorage.setItem('cartCount', String(res.data?.items?.length || 0))
      })
      .catch(err => {
        console.error('Error fetching cart:', err)
        setCart([])
      })

    axios(`${API_URL}/users/me`, { headers: authHeaders() }).then(res => {
      setUser(res.data)

      const defaultAddress = res.data.addresses?.find((address: any) => address.isDefault)
      if (!defaultAddress) return

      const normalizedAddress = normalizeSavedAddress(defaultAddress)

      setSelectedAddress(normalizedAddress)
      setDeliveryType(defaultAddress.type === 'PVZ' ? 'До пункта выдачи' : 'Курьером')
      setIsDefaultAddress(true)
      setIsAddressSelected(defaultAddress.type !== 'PVZ')
    })
  }, [])

  useEffect(() => {
    setTimeout(() => document.querySelector('.main-container')?.scrollTo(0, 0), 1)
  }, [pathname])

  useEffect(() => {
    if (deliveryType === 'Курьером' && selectedAddress?.id) {
      axios(`${API_URL}/orders/delivery-dates`, {
        headers: authHeaders(),
        method: 'POST',
        data: {
          addressId: selectedAddress?.id || '',
        },
      })
        .then(res => {
          const dates = res.data

          const addBusinessDays = (date: Date, days: number) => {
            const result = new Date(date)

            while (days > 0) {
              result.setDate(result.getDate() + 1)

              const day = result.getDay()
              if (day !== 0 && day !== 6) {
                days--
              }
            }

            return result
          }

          const formatDate = (date: Date) => date.toISOString().split('T')[0]

          const deliveryFrom = new Date(dates.deliveryFrom)
          const deliveryTo = new Date(dates.deliveryTo)

          const options = [
            {
              deliveryFrom: dates.deliveryFrom,
              deliveryTo: dates.deliveryTo,
            },
            {
              deliveryFrom: formatDate(addBusinessDays(deliveryFrom, 1)),
              deliveryTo: formatDate(addBusinessDays(deliveryTo, 1)),
            },
            {
              deliveryFrom: formatDate(addBusinessDays(deliveryFrom, 2)),
              deliveryTo: formatDate(addBusinessDays(deliveryTo, 2)),
            },
          ]
          setDeliveryDates(options)
        })
        .catch(err => {
          console.error('Error fetching delivery dates:', err)
          setDeliveryDates([])
        })
    }
  }, [deliveryType, selectedAddress])

  useEffect(() => {
    if (!promo) return

    axios(`${API_URL}/cart/apply-promo`, {
      method: 'POST',
      headers: jsonAuthHeaders(),
      data: { code: promo },
    })
      .then(res => {
        toast.success('Промокод применён')
        setPromoDiscount(res.data.discount)
      })
      .catch(err => {
        console.error('Error applying promo code:', err)
        toast.error('Промокод недействителен')
      })
  }, [promo])

  const resetAddress = (type: DeliveryType) => {
    setDeliveryType(type)
    setSelectedAddress(null)
    setIsAddressSelected(false)
    setIsDefaultAddress(false)
    setAddressModalOpened(false)
  }

  const selectSavedAddress = (address: any) => {
    setSelectedAddress(normalizeSavedAddress(address))
    setIsAddressSelected(true)
    setAddressModalOpened(false)
    setIsDefaultAddress(true)
  }

  const createOrder = (addressId: any) => {
    if (!selectedDeliveryDate.deliveryFrom) return

    axios(`${API_URL}/orders`, {
      method: 'POST',
      headers: jsonAuthHeaders(),
      data: {
        addressId: addressId || '',
        paymentType,
        promoCode: promo,
        comment: selectedAddress?.comment || '',
        ...selectedDeliveryDate,
      },
    })
      .then(res => {
        localStorage.removeItem('cart')
        dispatch(setCartCount(0))
        navigate(`${ORDER}/${res.data.id}`)
      })
      .catch(err => {
        console.error('Error creating order:', err)

        if (err.response?.data?.message === 'not enough stock') {
          toast.error('Товара(ов) нет в наличии')
          return
        }

        toast.error('Не удалось создать заказ. Пожалуйста, попробуйте снова.')
      })
  }

  const formatDate = (date?: string) => {
    if (!date) return ''

    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    })
  }

  const handleSubmit = () => {
    if (!payRulesAgreed || !personalDataAgreed) {
      alert('Вы должны согласиться с правилами оплаты и политикой обработки персональных данных')
      return
    }

    if (isDefaultAddress) {
      if (selectedAddress?.id) createOrder(selectedAddress.id)
      return
    }

    const location = selectedAddress?.location || {}

    const address =
      deliveryType === 'Курьером'
        ? {
            city: location.city || '',
            apartment: selectedAddress?.apartment || '',
            entrance: selectedAddress?.entrance || '',
            floor: selectedAddress?.floor || '',
            intercom: selectedAddress?.intercom || '',
            comment: selectedAddress?.comment || '',
            latitude: String(location.latitude || ''),
            longitude: String(location.longitude || ''),
            fullAddress: location.address_full || '',
          }
        : {
            city: location.city || '',
            fullAddress: location.address_full || '',
            latitude: String(location.latitude || ''),
            longitude: String(location.longitude || ''),
          }

    axios(`${API_URL}/users/add-address/${user?.id}`, {
      method: 'POST',
      headers: jsonAuthHeaders(),
      data: {
        ...address,
        type: deliveryType === 'До пункта выдачи' ? 'PVZ' : 'DELIVERY',
      },
    })
      .then(res => createOrder(res.data?.id))
      .catch(err => {
        console.error('Error saving address:', err)
        toast.error('Не удалось сохранить адрес. Пожалуйста, попробуйте снова.')
      })
  }

  const sidebar = (cls: string) => (
    <CartSideBar
      {...totals}
      cart={cart}
      deliveryType={deliveryType}
      promo={promo}
      changePromo={setPromo}
      cls={cls}
      payRulesAgreed={payRulesAgreed}
      setPayRulesAgreed={setPayRulesAgreed}
      personalDataAgreed={personalDataAgreed}
      setPersonalDataAgreed={setPersonalDataAgreed}
      handleSubmit={handleSubmit}
      promoDiscount={promoDiscount}
    />
  )

  return (
    <div className="flex flex-col w-full gap-[16px] lg:gap-[30px] py-[12px] px-[var(--sides-padding)_!important]">
      <div className="hidden py-[30px] lg:flex items-center gap-[20px] text-[var(--service)_!important] text-[22px] w-full">
        <Link to="/" className="cursor-pointer">
          Главная
        </Link>
        <Link to={CART} className="whitespace-nowrap cursor-pointer flex gap-[20px] items-center">
          <FaChevronRight className="text-[18px]" /> <p>Корзина</p>
        </Link>
        <div className="whitespace-nowrap cursor-pointer flex gap-[20px] items-center">
          <FaChevronRight className="text-[18px]" /> <p>Оформление заказа</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-[20px]">
        <div className="flex flex-col gap-[16px] lg:gap-[30px] w-full 2xl:w-[calc(100%-520px)]">
          <div className="flex flex-col gap-[8px] border-b-[var(--gray)] pb-[20px] border-solid border-b-[3px]">
            <h1 className="h2">Оформление заказа</h1>
          </div>
          {cart.length > 0 && <CartPage cart={cart} />}
          <div className="flex flex-col gap-[16px] lg:gap-[30px] pt-[20px]">
            <h3 className="h3">1. Способ доставки</h3>

            <DeliveryOption
              checked={isPvz}
              title="До пункта выдачи"
              description="Бесплатная доставка с примеркой до пункта выдачи СДЭК (ближайшего к адресу, который вы укажете)"
              onChange={() => resetAddress('До пункта выдачи')}
            />

            {isPvz && (
              <AddressSection
                selectedAddress={selectedAddress}
                userHasAddresses={filteredAddresses.length > 0}
                addressModalOpened={addressModalOpened}
                modalTitle="Выберите адрес доставки"
                mapType="PVZ"
                addresses={filteredAddresses}
                onOpen={() => setAddressModalOpened(true)}
                onClose={() => {
                  setIsAddressSelected(false)
                  setAddressModalOpened(false)
                }}
                onChangeAddress={() => {
                  setSelectedAddress(null)
                  setAddressModalOpened(true)
                }}
                onSelectSaved={selectSavedAddress}
                onSelectNew={(pvz: any) => {
                  setSelectedAddress(pvz)
                  setIsAddressSelected(true)
                  setIsDefaultAddress(false)
                }}
              />
            )}

            <DeliveryOption
              checked={isCourier}
              title="Курьером"
              description="Бесплатная доставка курьером СДЭК до дома (с примеркой)"
              onChange={() => resetAddress('Курьером')}
            />

            {isCourier &&
              (isAddressSelected ? (
                <div className="flex flex-col gap-[20px]">
                  <AddressSection
                    selectedAddress={selectedAddress}
                    userHasAddresses={filteredAddresses.length > 0}
                    addressModalOpened={addressModalOpened}
                    modalTitle={
                      filteredAddresses.length ? 'Выберите адрес доставки' : 'Новый адрес доставки'
                    }
                    mapType="DELIVERY"
                    addresses={filteredAddresses}
                    onOpen={() => setAddressModalOpened(true)}
                    onClose={() => {
                      setIsAddressSelected(false)
                      setAddressModalOpened(false)
                    }}
                    onChangeAddress={() => {
                      setSelectedAddress(null)
                      setAddressModalOpened(true)
                    }}
                    onSelectSaved={selectSavedAddress}
                    onSelectNew={(pvz: any) => {
                      setSelectedAddress(pvz)
                      setIsDefaultAddress(false)
                    }}
                  />
                  {deliveryDates.length ? (
                    <>
                      <h2 className="h2">Дата доставки</h2>
                      <div className="flex items-center gap-[8px]">
                        {deliveryDates?.map((d: any, index: number) => (
                          <div
                            key={index}
                            className="p-[12px] rounded-[4px] border-solid border-[1px] border-[var(--service)]"
                            style={{
                              background:
                                selectedDeliveryDate?.deliveryFrom == d?.deliveryFrom
                                  ? 'var(--gray)'
                                  : '',
                            }}
                            onClick={() => setSelectedDeliveryDate(d)}
                          >
                            {formatDate(d.deliveryFrom)}
                            {' - '}
                            {formatDate(d.deliveryTo)}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                <EmptyAddress
                  onClick={() => {
                    setIsAddressSelected(true)
                    setSelectedAddress(null)
                    setAddressModalOpened(true)
                  }}
                />
              ))}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="w-fit h-fit relative">
            {sidebar(
              'hidden 2xl:flex right-[var(--sides-padding)] fixed right-[var(--sides-padding)]'
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[30px]">
        <h3 className="h3">2. Ваши данные</h3>
        <UserForm
          user={user}
          setUser={setUser}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          isCourier={isCourier}
        />
      </div>

      <div className="flex flex-col gap-[16px] lg:gap-[30px]">
        <h3 className="h3">3. Способ оплаты</h3>
        <label className="flex gap-[10px]">
          <input
            type="radio"
            className="radio"
            name="payment"
            checked={paymentType === 'OFFLINE'}
            onChange={() => setPaymentType('OFFLINE')}
          />
          <div className="flex flex-col gap-[10px]">
            <p className="h5">При получении</p>
            <p className="p1">Картой или наличными</p>
          </div>
        </label>
      </div>

      {cart.length > 0 && sidebar('flex 2xl:hidden w-[100%_!important]')}
    </div>
  )
}

const DeliveryOption = ({ checked, title, description, onChange }: any) => (
  <label className="flex gap-[10px]">
    <input type="radio" className="radio" name="delivery" checked={checked} onChange={onChange} />
    <div className="flex flex-col gap-[5px] -mt-[3px]">
      <h5 className="h5">{title}</h5>
      <p className="p1">{description}</p>
    </div>
  </label>
)

const EmptyAddress = ({ onClick }: any) => (
  <div className="flex flex-col gap-[10px] pl-[30px]">
    <div className="flex gap-[10px] items-center mb-[10px] cursor-pointer" onClick={onClick}>
      <img src={locationMark} alt="" />
      <div className="flex flex-col gap-[10px]">
        <h5 className="h5 flex gap-[10px] items-center">Адрес доставки не добавлен</h5>
        <p className="p1 text-[var(--service)_!important]">Нажмите чтобы добавить</p>
      </div>
      <CgChevronRight className="ml-auto text-[24px]" />
    </div>
  </div>
)

const AddressSection = ({
  selectedAddress,
  userHasAddresses,
  addressModalOpened,
  modalTitle,
  mapType,
  addresses,
  onClose,
  onChangeAddress,
  onSelectSaved,
  onSelectNew,
}: any) => {
  if (selectedAddress) {
    return (
      <div className="flex flex-col gap-[10px] pl-[30px]">
        <AddressCard address={selectedAddress} />
        <button
          className="text-[14px] px-[16px] py-[10px] rounded-[12px] bg-[#4D4E50] text-[#fff] w-fit ml-[34px]"
          onClick={onChangeAddress}
        >
          Изменить адрес
        </button>
      </div>
    )
  }

  if (!addressModalOpened) return null

  return (
    <AddressModal title={modalTitle} onClose={onClose}>
      {userHasAddresses ? (
        <>
          <div className="flex flex-col gap-[10px] max-h-[300px] w-full items-center overflow-y-auto">
            {addresses.map((address: any) => (
              <div
                key={address.id}
                className="cursor-pointer border-solid border-[var(--service)] border-[1px] rounded-[12px] p-[10px] max-w-[700px] w-full"
                onClick={() => onSelectSaved(address)}
              >
                <AddressCard address={normalizeSavedAddress(address)} />
              </div>
            ))}
          </div>
          <button
            id="admin-button"
            className="w-[700px] text-center flex justify-center py-[20px_!important] items-center mx-[auto] gap-[10px]"
            onClick={onClose}
          >
            <FaPlus /> Добавить адрес
          </button>
        </>
      ) : (
        <PvzMapWidget onSelect={onSelectNew} type={mapType} />
      )}
    </AddressModal>
  )
}

const AddressModal = ({ title, onClose, children }: any) => (
  <div className="z-[50] flex items-center justify-center fixed top-[0] left-[0] w-full h-screen bg-[#00000080]">
    <div className="flex flex-col gap-[24px] p-[20px] rounded-[12px] bg-[#fff] w-[990px] max-w-[90%]">
      <div className="flex items-center justify-center relative">
        <h2 className="h2 text-center">{title}</h2>
        <button
          className="absolute right-[0] top-[3px] bg-[transparent] border-none"
          onClick={onClose}
        >
          <CgClose className="h2" />
        </button>
      </div>
      {children}
    </div>
  </div>
)

const AddressCard = ({ address }: any) => (
  <div className="flex gap-[10px] items-start mb-[10px]">
    <img src={locationMark} alt="" />
    <div className="flex flex-col gap-[10px]">
      <h5 className="h5 flex gap-[10px] items-center">{getAddressText(address)}</h5>
      <p className="p1 text-[var(--service)_!important]">
        {address?.entrance && `${address.entrance} Подъезд, `}
        {address?.floor && `${address.floor} этаж, `}
        {address?.comment || address?.note || ''}
      </p>
    </div>
  </div>
)

const UserForm = ({ user, setUser, selectedAddress, setSelectedAddress, isCourier }: any) => {
  const updateUser = (key: string, value: string) =>
    setUser((prev: any) => ({ ...prev, [key]: value }))
  const updateAddress = (key: string, value: string) =>
    setSelectedAddress((prev: any) => ({ ...(prev || {}), [key]: value }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[16px]">
      <TextField
        label="Имя"
        value={user?.name || ''}
        onChange={(value: any) => updateUser('name', value)}
      />
      <TextField
        label="Фамилия"
        value={user?.surName || ''}
        onChange={(value: any) => updateUser('surName', value)}
      />
      <TextField
        label="Отчество"
        value={user?.middleName || ''}
        onChange={(value: any) => updateUser('middleName', value)}
      />
      <TextField
        label="Email"
        value={user?.email || ''}
        onChange={(value: any) => updateUser('email', value)}
      />

      <label>
        <p>Телефон</p>
        <PatternFormat
          format="+7 (###) ###-##-##"
          type="text"
          className="border-b-[1px] border-solid border-[var(--service)] w-full outline-none p-[8px]"
          value={user?.phone || ''}
          onChange={e => updateUser('phone', e.target.value)}
        />
      </label>

      <TextField label="Адрес" value={getAddressText(selectedAddress)} readOnly />

      {isCourier && (
        <>
          <TextField
            label="Подъезд"
            value={selectedAddress?.entrance || ''}
            onChange={(value: any) => updateAddress('entrance', value)}
          />
          <TextField
            label="Этаж"
            value={selectedAddress?.floor || ''}
            onChange={(value: any) => updateAddress('floor', value)}
          />
          <TextField
            label="Комментарий"
            value={selectedAddress?.comment || ''}
            onChange={(value: any) => updateAddress('comment', value)}
          />
        </>
      )}
    </div>
  )
}

const TextField = ({ label, value, onChange, readOnly }: any) => (
  <label>
    <p>{label}</p>
    <input
      type="text"
      className="border-b-[1px] border-solid border-[var(--service)] w-full outline-none p-[8px]"
      value={value}
      readOnly={readOnly}
      onChange={e => onChange?.(e.target.value)}
    />
  </label>
)

const CartPage = ({ cart }: any) => (
  <div className="cart flex flex-col lg:flex-row gap-[20px] lg:justify-between">
    <div className="flex flex-col gap-[20px] w-full">
      {cart?.map((item: any, index: number) => <CartItem key={index} item={item} index={index} />)}
    </div>
  </div>
)

const CartSideBar = ({
  totalProductsPrice,
  totalDiscount,
  totalPrice,
  cart,
  deliveryType,
  promo,
  cls,
  changePromo,
  payRulesAgreed,
  setPayRulesAgreed,
  personalDataAgreed,
  setPersonalDataAgreed,
  handleSubmit,
  promoDiscount,
}: any) => {
  const [promoCode, setPromoCode] = useState(promo)

  return (
    <div
      className={`flex flex-col gap-[18px] xl:gap-[30px] w-full lg:w-[34%] bg-[var(--gray)] rounded-[12px] py-[12px] px-[16px] 2xl:p-[45px] h-fit xl:min-w-[408px] lg:min-w-[337px] 2xl:w-[500px] ${cls}`}
    >
      <div className="flex flex-col gap-[16px]">
        <PriceRow label={`Товары (${cart.length})`} value={totalProductsPrice} />
        {totalDiscount > 0 && <PriceRow label="Скидка" value={totalDiscount} prefix="-" />}
        {promoDiscount && <PriceRow label="Промокод" value={promoDiscount} prefix="-" />}

        <div className="flex items-center justify-between">
          <p className="p2">Доставка</p>
          <div className="flex items-center gap-[10px]">
            {deliveryType},{' '}
            {deliveryType === 'Курьером' ? <Money value={1000} /> : <p className="p1">бесплатно</p>}
          </div>
        </div>
      </div>

      <span className="block w-full h-[3px] bg-[#fff]" />

      <div className="flex flex-col gap-[10px]">
        <p className="h5">Промокод</p>
        <div className="flex gap-[10px] items-center">
          <input
            type="text"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
            placeholder="ПРОМОКОД"
            className="w-full p-[12px] h-[40px] rounded-[8px] border-[#00000020] border-solid border-[1px] outline-none bg-[transparent]"
          />
          {promoCode && (
            <button
              className="w-[72px] h-[40px] rounded-[8px] bg-[#000] flex items-center justify-center"
              onClick={() => changePromo(promoCode)}
            >
              <BsCheck className="text-[24px] text-[#fff]" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between py-[10px] xl:py-[20px]">
        <p className="h5">Итого</p>
        <Money value={totalPrice} className="h5" />
      </div>

      <button className="button" onClick={handleSubmit}>
        Оформить заказ
      </button>

      <div className="flex flex-col gap-[15px] xl:gap-[30px]">
        <Agreement
          checked={payRulesAgreed}
          onChange={() => setPayRulesAgreed((prev: boolean) => !prev)}
          text="Я соглашаюсь с"
          linkText="правилами оплаты и возврата"
        />
        <Agreement
          checked={personalDataAgreed}
          onChange={() => setPersonalDataAgreed((prev: boolean) => !prev)}
          text="Я соглашаюсь с"
          linkText="обработкой персональных данных"
        />
      </div>
    </div>
  )
}

const PriceRow = ({ label, value, prefix = '' }: any) => (
  <div className="flex items-center justify-between">
    <p className={prefix ? 'p2' : 'p1'}>{label}</p>
    <Money value={value} prefix={prefix} />
  </div>
)

const Money = ({ value, prefix = '', className = 'p1' }: any) => (
  <NumericFormat
    value={value}
    allowNegative={false}
    suffix=" ₽"
    prefix={prefix}
    className={className}
    thousandSeparator=" "
    displayType="text"
  />
)

const Agreement = ({ checked, onChange, text, linkText }: any) => (
  <label className="flex gap-[10px]">
    <input type="checkbox" className="checkbox" checked={checked} onChange={onChange} />
    <p className="p2">
      {text}&nbsp;
      <a href="#" className="text-[var(--red)]">
        {linkText}
      </a>
    </p>
  </label>
)

const CartItem = ({ item, index }: any) => {
  const hasDiscount = item.oldPrice && item.oldPrice > 0
  const discountPercent = hasDiscount
    ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
    : 0

  return (
    <div key={index} className="flex flex-col sm:flex-row gap-[20px]">
      <img src={item?.imageUrl} className="w-[120px] aspect-[12/17] object-cover" alt="" />

      <div className="flex flex-row w-full justify-between gap-[16px] md:gap-[24px]">
        <div className="flex flex-col gap-[16px] md:gap-[20px]">
          <h5 className="h3 -mb-[10px] md:mb-0">{item?.name}</h5>

          <div className="flex sm:hidden gap-[8px]">
            <Money value={item.price} className="h5" />
            {hasDiscount && (
              <>
                <Money
                  value={item.oldPrice}
                  className="text-[var(--service)_!important] p1 line-through"
                />
                <NumericFormat
                  value={discountPercent}
                  suffix="%"
                  prefix="-"
                  allowNegative={false}
                  className="text-[var(--red)_!important] p1"
                  thousandSeparator=" "
                  displayType="text"
                />
              </>
            )}
          </div>

          <ProductInfo label="Модель:" value={item.articul} />
          <ProductInfo label="Размер:" value={item.size} />
          <div className="flex items-center gap-[16px]">
            <p className="p2 text-[15px] md:text-[18px] w-[90px]">Цвет:</p>
            <p className="p2 text-[15px] md:text-[18px] w-[90px] flex items-center">
              <span
                className="block min-w-[24px] h-[24px] rounded-[50%] mr-[8px]"
                style={{ background: item.colorCode }}
              />
              {item.colorAlias || 'Без цвета'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[8px] align-end justify-between">
          <div className="hidden sm:flex sm:flex-col gap-[8px]">
            <div className="flex items-center justify-end gap-[4px] whitespace-nowrap">
              <Money value={item.price} className="h5" />
              {hasDiscount && (
                <NumericFormat
                  value={discountPercent}
                  suffix="%"
                  prefix="-"
                  allowNegative={false}
                  className="text-[var(--red)_!important] p1"
                  thousandSeparator=" "
                  displayType="text"
                />
              )}
            </div>

            {hasDiscount && (
              <Money
                value={item.oldPrice}
                className="text-[var(--service)_!important] p1 line-through ml-auto"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ProductInfo = ({ label, value }: any) => (
  <div className="flex items-center gap-[16px]">
    <p className="p2 text-[15px] md:text-[18px] w-[90px]">{label}</p>
    <p className="p2 text-[15px] md:text-[18px] w-[90px]">{value}</p>
  </div>
)

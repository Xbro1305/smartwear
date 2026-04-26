import axios from 'axios'
import { useEffect, useState } from 'react'
import { NumericFormat, PatternFormat } from 'react-number-format'
import { Link, useNavigate } from 'react-router-dom'
import { FaChevronRight, FaPlus } from 'react-icons/fa'
import { ROUTER_PATHS } from '@/shared/config/routes'
import PvzMapWidget from './pvz/PvzMapWidget'
import locationMark from './local-two.svg'
import { BsCheck } from 'react-icons/bs'
import { CgChevronRight, CgClose } from 'react-icons/cg'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setCartCount } from '@/app/store/cartCount'

export const Order = () => {
  const [cart, setCart] = useState([])
  const [deliveryType, setDeliveryType] = useState<'Самовывоз' | 'До пункта выдачи' | 'Курьером'>(
    'Самовывоз'
  )
  const [selectedAddress, setSelectedAddress] = useState<any>()
  const [promo, setPromo] = useState<string>('')
  const [user, setUser] = useState<any>(null)
  const [addressModalOpened, setAddressModalOpened] = useState<boolean>(false)
  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false)
  const [isDefaultAddress, setIsDefaultAddress] = useState<boolean>(false)
  const [payRulesAgreed, setPayRulesAgreed] = useState<boolean>(false)
  const [personalDataAgreed, setPersonalDataAgreed] = useState<boolean>(false)
  const [paymentType, setPaymentType] = useState<'ONLINE' | 'OFFLINE'>('OFFLINE')
  const [promoDiscount, setPromoDiscount] = useState<string>()
  const { CART, ORDER } = ROUTER_PATHS
  const pathname = location.pathname
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    document.title = `Оформление заказа - Умная одежда`
    window.scrollTo(0, 0)

    if (!localStorage.getItem('token')) {
      const localCart = localStorage.getItem('cart')
      if (localCart) {
        setCart(JSON.parse(localCart))
      }
      return
    }

    axios(`${import.meta.env.VITE_APP_API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        res.data?.items && setCart(res.data.items)
        localStorage.setItem('cartCount', String(res.data?.items?.length || 0))
      })
      .catch(err => {
        console.error('Error fetching cart:', err)
        setCart([]) // Set cart to empty array on error
      })

    axios(`${import.meta.env.VITE_APP_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => {
      setUser(res.data)
      const defaultAddress = res.data.addresses.find((address: any) => address.isDefault)
      if (defaultAddress) {
        setSelectedAddress({
          ...defaultAddress,
          location: { address_full: defaultAddress.fullAddress },
        })
        defaultAddress.type === 'PVZ'
          ? setDeliveryType('До пункта выдачи')
          : setDeliveryType('Курьером')

        setIsDefaultAddress(true)

        defaultAddress.type !== 'PVZ' && setIsAddressSelected(true)
      }
    })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      document.querySelector('.main-container')?.scrollTo(0, 0)
    }, 1)
  }, [pathname])

  const totalProductsPrice = cart.reduce((sum: number, item: any) => {
    const price = item.oldPrice && item.oldPrice > 0 ? item.oldPrice : item.price
    return sum + +price
  }, 0)

  const totalDiscount = cart.reduce((sum: number, item: any) => {
    return sum + +(item.oldPrice && item.oldPrice > 0 ? item.oldPrice - item.price : 0)
  }, 0)

  const totalPrice =
    cart.reduce((sum: number, item: any) => {
      return sum + +item.price
    }, 0) -
    (promoDiscount ? +promoDiscount : 0) +
    (deliveryType === 'Курьером' ? 1000 : 0)

  const handleSubmit = () => {
    if (!payRulesAgreed || !personalDataAgreed)
      return alert(
        'Вы должны согласиться с правилами оплаты и политикой обработки персональных данных'
      )

    if (!isDefaultAddress) {
      const address =
        deliveryType === 'Курьером'
          ? {
              city: selectedAddress?.location?.city || '',
              apartment: selectedAddress?.apartment || '',
              entrance: selectedAddress?.entrance || '',
              floor: selectedAddress?.floor || '',
              intercom: selectedAddress?.intercom || '',
              comment: selectedAddress?.comment || '',
              latitude: String(selectedAddress?.location?.latitude) || '',
              longitude: String(selectedAddress?.location?.longitude) || '',
              fullAddress: selectedAddress?.location?.address_full || '',
            }
          : {
              city: selectedAddress?.location?.city || '',
              fullAddress: selectedAddress?.location?.address_full || '',
              latitude: String(selectedAddress?.location?.latitude) || '',
              longitude: String(selectedAddress?.location?.longitude) || '',
            }

      return axios(`${import.meta.env.VITE_APP_API_URL}/users/add-address/${user?.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },

        data: {
          ...address,
          type: deliveryType === 'До пункта выдачи' ? 'PVZ' : 'DELIVERY',
        },
      })
        .then(res => {
          console.log('Address saved:', res.data)
          createOrder(res.data?.id)
        })
        .catch(err => {
          console.error('Error saving address:', err)
          toast.error('Не удалось сохранить адрес. Пожалуйста, попробуйте снова.')
        })
    }
    selectedAddress?.id && createOrder(selectedAddress?.id)
  }

  const createOrder = (addressId: any) => {
    const data = {
      addressId: addressId || '',
      paymentType,
      promoCode: promo,
      comment: selectedAddress.comment || '',
    }

    axios(`${import.meta.env.VITE_APP_API_URL}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      data,
    })
      .then(res => {
        console.log('Order created:', res.data)
        localStorage.removeItem('cart')
        dispatch(setCartCount(0))
        navigate(`${ORDER}/${res.data.id}`)
      })
      .catch(err => {
        console.error('Error saving address:', err)
        if (err.response?.data?.message == 'not enough stock')
          toast.error('Товара(ов) нет в наличии')

        toast.error('Не удалось создать заказ. Пожалуйста, попробуйте снова.')
      })
  }

  useEffect(() => {
    if (promo.length === 0) return
    axios(`${import.meta.env.VITE_APP_API_URL}/cart/apply-promo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      data: { code: promo },
    })
      .then(res => {
        toast.success('Промокод применён')
        // discount
        setPromoDiscount(res.data.discount)
      })
      .catch(err => {
        console.error('Error applying promo code:', err)
        toast.error('Промокод недействителен')
      })
  }, [promo])

  const SideBar = ({ cls }: any) => (
    <CartSideBar
      totalProductsPrice={totalProductsPrice}
      totalDiscount={totalDiscount}
      totalPrice={totalPrice}
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
    <div className="flex flex-col w-full gap-[16px] lg:gap-[30px] py-[12px] px-[var(--sides-padding)_!important] w-full">
      <div className="hidden py-[30px] lg:flex items-center gap-[20px] text-[var(--service)_!important] text-[22px] w-full">
        <Link to="/" className="cursor-pointer">
          Главная
        </Link>{' '}
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
          </div>{' '}
          {cart.length > 0 && <CartPage cart={cart} />}
        </div>

        {cart.length > 0 && (
          <div className="w-fit h-fit relative">
            <SideBar cls="hidden 2xl:flex right-[var(--sides-padding)]" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-[16px] lg:gap-[30px] pt-[20px]">
        <h3 className="h3">1. Способ доставки</h3>
        <div className="flex flex-col gap-[16px] lg:gap-[30px] pt-[20px]">
          <label className="flex gap-[10px]">
            <input
              type="radio"
              className="radio"
              name="delivery"
              checked={deliveryType == 'До пункта выдачи'}
              onChange={() => {
                setDeliveryType('До пункта выдачи')
                setSelectedAddress(null)
                setIsAddressSelected(false)
                setAddressModalOpened(false)
              }}
            />
            <div className="flex flex-col gap-[5px] -mt-[3px]">
              <h5 className="h5">До пункта выдачи</h5>
              <p className="p1">
                Бесплатная доставка с примеркой до пункта выдачи СДЭК (ближайшего к адресу, который
                вы укажете)
              </p>
            </div>
          </label>
        </div>
        {deliveryType == 'До пункта выдачи' &&
          (selectedAddress ? (
            <div className="flex flex-col gap-[10px] pl-[30px]">
              <div className="flex gap-[10px] items-start mb-[10px]">
                <img src={locationMark} alt="" />
                <div className="flex flex-col gap-[10px]">
                  <h5 className="h5 flex gap-[10px] items-center">
                    {selectedAddress.location.address_full}
                  </h5>
                  <p className="p1 text-[var(--service)_!important]">{selectedAddress?.note}</p>
                  <button
                    className="text-[14px] px-[16px] py-[10px] rounded-[12px] bg-[#4D4E50] text-[#fff] w-fit"
                    onClick={() => {
                      setSelectedAddress(null)
                      setAddressModalOpened(true)
                    }}
                  >
                    Изменить адрес
                  </button>
                </div>
              </div>
            </div>
          ) : addressModalOpened &&
            user?.addresses?.filter((address: any) => address.type === 'PVZ').length ? (
            <>
              <div className="z-[50] flex items-center justify-center fixed top-[0] left-[0] w-full h-screen bg-[#00000080]">
                <div className="flex flex-col gap-[24px] p-[20px] rounded-[12px] bg-[#fff] w-[990px] max-w-[90%]">
                  <div className="flex items-center justify-center relative">
                    <h2 className="h2 text-center">Выберите адрес доставки</h2>
                    <button className="absolute right-[0] top-[3px] bg-[transparent] border-none">
                      <CgClose
                        className="h2"
                        onClick={() => {
                          setIsAddressSelected(false)
                          setAddressModalOpened(false)
                        }}
                      />
                    </button>
                  </div>
                  <div className="flex flex-col gap-[10px] max-h-[300px] w-full items-centerƒpr overflow-y-auto">
                    {user?.addresses
                      ?.filter((address: any) => address.type === 'PVZ')
                      ?.map((address: any, index: number) => (
                        <>
                          <div
                            key={index}
                            className="flex gap-[10px] mb-[10px] cursor-pointer border-solid border-[var(--service)] border-[1px] rounded-[12px] p-[10px] max-w-[700px] w-full"
                            onClick={() => {
                              setSelectedAddress(address)
                              setIsAddressSelected(true)
                              setAddressModalOpened(false)
                              setIsDefaultAddress(true)
                            }}
                          >
                            <img src={locationMark} alt="" />
                            <div className="flex flex-col gap-[10px]">
                              <h5 className="h5 flex gap-[10px] items-center">
                                {address.fullAddress}
                              </h5>
                              <p className="p1 text-[var(--service)_!important]">
                                {address.entrance && `${address.entrance} Подъезд,`}{' '}
                                {address.floor && `${address.floor} этаж,`}{' '}
                                {address.comment && `${address.comment}`}{' '}
                              </p>
                            </div>
                          </div>
                        </>
                      ))}
                  </div>
                  <button
                    id="admin-button"
                    className="w-[700px] text-center flex justify-center py-[20px_!important] items-center mx-[auto] flex gap-[10px] items-center"
                    onClick={() => setAddressModalOpened(false)}
                  >
                    <FaPlus /> Добавить адрес
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <PvzMapWidget
                onSelect={pvz => {
                  setSelectedAddress(pvz)
                  setIsAddressSelected(true)
                }}
                type="PVZ"
              />
            </>
          ))}
        <label className="flex gap-[10px]">
          <input
            type="radio"
            className="radio"
            name="delivery"
            checked={deliveryType == 'Курьером'}
            onChange={() => {
              setDeliveryType('Курьером')
              setSelectedAddress(null)
              setIsAddressSelected(false)
              setAddressModalOpened(false)
            }}
          />
          <div className="flex flex-col gap-[5px] -mt-[3px]">
            <h5 className="h5">Курьером</h5>
            <p className="p1">Бесплатная доставка курьером СДЭК до дома (с примеркой)</p>
          </div>
        </label>
        {deliveryType == 'Курьером' &&
          (isAddressSelected ? (
            selectedAddress ? (
              <div className="flex flex-col gap-[10px] pl-[30px]">
                <div className="flex gap-[10px] items-start mb-[10px]">
                  <img src={locationMark} alt="" />
                  <div className="flex flex-col gap-[10px]">
                    <h5 className="h5 flex gap-[10px] items-center">
                      {selectedAddress.location.address_full}
                    </h5>
                    <p className="p1 text-[var(--service)_!important]">
                      {selectedAddress?.entrance && `${selectedAddress?.entrance} Подъезд,`}{' '}
                      {selectedAddress?.floor && `${selectedAddress?.floor} этаж,`}{' '}
                      {selectedAddress?.comment && `${selectedAddress?.comment}`}{' '}
                    </p>
                    <button
                      className="text-[14px] px-[16px] py-[10px] rounded-[12px] bg-[#4D4E50] text-[#fff] w-fit"
                      onClick={() => {
                        setSelectedAddress(null)
                        setAddressModalOpened(true)
                      }}
                    >
                      Изменить адрес
                    </button>
                  </div>
                </div>
              </div>
            ) : addressModalOpened &&
              user?.addresses?.filter((address: any) => address.type !== 'PVZ').length ? (
              <>
                <div className="z-[50] flex items-center justify-center fixed top-[0] left-[0] w-full h-screen bg-[#00000080]">
                  <div className="flex flex-col gap-[24px] p-[20px] rounded-[12px] bg-[#fff] w-[990px] max-w-[90%]">
                    <div className="flex items-center justify-center relative">
                      <h2 className="h2 text-center">Выберите адрес доставки</h2>
                      <button className="absolute right-[0] top-[3px] bg-[transparent] border-none">
                        <CgClose
                          className="h2"
                          onClick={() => {
                            setIsAddressSelected(false)
                            setAddressModalOpened(false)
                          }}
                        />
                      </button>
                    </div>
                    <div className="flex flex-col gap-[10px] max-h-[300px] w-full justify-center items-center overflow-y-auto">
                      {user?.addresses
                        ?.filter((address: any) => address.type !== 'PVZ')
                        ?.map((address: any, index: number) => (
                          <>
                            <div
                              key={index}
                              className="flex gap-[10px] items-start mb-[10px] cursor-pointer border-solid border-[var(--service)] border-[1px] rounded-[12px] p-[10px] max-w-[700px] w-full"
                              onClick={() => {
                                setSelectedAddress({
                                  id: address.id,
                                  location: {
                                    address_full: address.fullAddress,
                                  },
                                  entrance: address.entrance,
                                  floor: address.floor,
                                  comment: address.comment,
                                })
                                setIsAddressSelected(true)
                                setAddressModalOpened(false)
                                setIsDefaultAddress(true)
                              }}
                            >
                              <img src={locationMark} alt="" />
                              <div className="flex flex-col gap-[10px]">
                                <h5 className="h5 flex gap-[10px] items-center">
                                  {address.fullAddress}
                                </h5>
                                <p className="p1 text-[var(--service)_!important]">
                                  {address.entrance && `${address.entrance} Подъезд,`}{' '}
                                  {address.floor && `${address.floor} этаж,`}{' '}
                                  {address.comment && `${address.comment}`}{' '}
                                </p>
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                    <button
                      id="admin-button"
                      className="w-[700px] text-center flex justify-center py-[20px_!important] items-center mx-[auto] flex gap-[10px] items-center"
                      onClick={() => setAddressModalOpened(false)}
                    >
                      <FaPlus /> Добавить адрес
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="z-[50] flex items-center justify-center fixed top-[0] left-[0] w-full h-screen bg-[#00000080]">
                  <div className="flex flex-col gap-[24px] p-[20px] rounded-[12px] bg-[#fff] w-[990px] max-w-[90%]">
                    <div className="flex items-center justify-center relative">
                      <h2 className="h2 text-center">Новый адрес доставки</h2>
                      <button className="absolute right-[0] top-[3px] bg-[transparent] border-none">
                        <CgClose
                          className="h2"
                          onClick={() => {
                            setIsAddressSelected(false)
                            setAddressModalOpened(false)
                          }}
                        />
                      </button>
                    </div>
                    <PvzMapWidget
                      onSelect={pvz => {
                        setSelectedAddress(pvz)
                        setIsDefaultAddress(false)
                      }}
                      type="DELIVERY"
                    />
                  </div>
                </div>
              </>
            )
          ) : (
            <>
              <div className="flex flex-col gap-[10px] pl-[30px]">
                <div
                  className="flex gap-[10px] items-center mb-[10px] cursor-pointer"
                  onClick={() => {
                    setIsAddressSelected(true)
                    setSelectedAddress(null)
                    setAddressModalOpened(true)
                  }}
                >
                  <img src={locationMark} alt="" />
                  <div className="flex flex-col gap-[10px]">
                    <h5 className="h5 flex gap-[10px] items-center">Адрес доставки не добавлен</h5>
                    <p className="p1 text-[var(--service)_!important]">Нажмите чтобы добавить</p>
                  </div>
                  <CgChevronRight className="ml-auto text-[24px]" />
                </div>
              </div>
            </>
          ))}
      </div>
      <div className="flex flex-col gap-[30px]">
        <h3 className="h3">2. Ваши данные</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[16px]">
          <label>
            <p>Имя</p>
            <input
              type="text"
              className="border-b-[1px] border-solid border-[var(--service)] w-full outline-none p-[8px]"
              value={user?.name || ''}
              onChange={e => setUser((prev: any) => ({ ...prev, name: e.target.value }))}
            />
          </label>{' '}
          <label>
            <p>Фамилия</p>
            <input
              type="text"
              className="border-b-[1px] border-solid border-[var(--service)] w-full outline-none p-[8px]"
              value={user?.surName || ''}
              onChange={e => setUser((prev: any) => ({ ...prev, surName: e.target.value }))}
            />
          </label>
          <label>
            <p>Отчество</p>
            <input
              type="text"
              className="border-b-[1px] border-solid border-[var(--service)] w-full outline-none p-[8px]"
              value={user?.middleName || ''}
              onChange={e => setUser((prev: any) => ({ ...prev, middleName: e.target.value }))}
            />
          </label>
          <label>
            <p>Email</p>
            <input
              type="text"
              className="border-b-[1px] border-solid border-[var(--service)] w-full outline-none p-[8px]"
              value={user?.email || ''}
              onChange={e => setUser((prev: any) => ({ ...prev, email: e.target.value }))}
            />
          </label>
          <label>
            <p>Телефон</p>
            <PatternFormat
              format="+7 (###) ###-##-##"
              type="text"
              className="border-b-[1px] border-solid border-[var(--service)] w-full outline-none p-[8px]"
              value={user?.phone || ''}
              onChange={e => setUser((prev: any) => ({ ...prev, phone: e.target.value }))}
            />
          </label>
          <label>
            <p>Адрес</p>
            <input
              type="text"
              className="border-b-[1px] border-solid border-[var(--service)] w-full outline-none p-[8px]"
              value={selectedAddress?.location.address || ''}
            />
          </label>{' '}
          {deliveryType === 'Курьером' && (
            <>
              <label>
                <p>Подъезд</p>
                <input
                  type="text"
                  className="border-b-[1px] border-solid border-[var(--service)] w-full outline-none p-[8px]"
                  value={selectedAddress?.entrance || ''}
                  onChange={e =>
                    setSelectedAddress((prev: any) => ({ ...prev, entrance: e.target.value }))
                  }
                />
              </label>
              <label>
                <p>Этаж</p>
                <input
                  type="text"
                  className="border-b-[1px] border-solid border-[var(--service)] w-full outline-none p-[8px]"
                  value={selectedAddress?.floor || ''}
                  onChange={e =>
                    setSelectedAddress((prev: any) => ({ ...prev, floor: e.target.value }))
                  }
                />
              </label>
              <label>
                <p>Комментарий</p>
                <input
                  type="text"
                  className="border-b-[1px] border-solid border-[var(--service)] w-full outline-none p-[8px]"
                  value={selectedAddress?.comment || ''}
                  onChange={e =>
                    setSelectedAddress((prev: any) => ({ ...prev, comment: e.target.value }))
                  }
                />
              </label>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-[16px] lg:gap-[30px]">
        <h3 className="h3">3. Способ оплаты</h3>
        <label className="flex gap-[10px]">
          <input
            type="radio"
            className="radio"
            name="payment"
            checked={paymentType == 'OFFLINE'}
            onChange={() => setPaymentType('OFFLINE')}
          />
          <div className="flex flex-col gap-[10px]">
            <p className="h5">При получении</p>
            <p className="p1">Картой или наличными</p>
          </div>
          {/* </label>{' '}
        <label className="flex gap-[10px]">
          <input
            type="radio"
            className="radio"
            name="payment"
            checked={paymentType == 'ONLINE'}
            onChange={() => setPaymentType('ONLINE')}
          />
          <div className="flex flex-col gap-[10px]">
            <p className="h5">Онлайн</p>
            <p className="p1">Картой на сайте, с помощью платежных систем</p>
          </div> */}
        </label>
      </div>
      {cart.length > 0 && <SideBar cls="flex 2xl:hidden w-[100%_!important]" />}
    </div>
  )
}

const CartPage = ({ cart }: any) => {
  return (
    <div className="cart flex flex-col lg:flex-row gap-[20px] lg:justify-between">
      <div className="flex flex-col gap-[20px] w-full">
        {cart?.map((item: any, index: number) => (
          <CartItem key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  )
}

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
        <div className="flex items-center justify-between pt-[10px] xl:pt-[20px]">
          <p className="p1">Товары ({cart.length})</p>
          <NumericFormat
            value={totalProductsPrice}
            suffix=" ₽"
            className="p1"
            thousandSeparator=" "
            displayType="text"
          />
        </div>

        {totalDiscount > 0 && (
          <div className="flex items-center justify-between">
            <p className="p2">Скидка</p>
            <NumericFormat
              value={totalDiscount}
              allowNegative={false}
              suffix=" ₽"
              prefix="-"
              className="p1"
              thousandSeparator=" "
              displayType="text"
            />
          </div>
        )}

        {promoDiscount && (
          <div className="flex items-center justify-between">
            <p className="p2">Промокод</p>
            <NumericFormat
              value={promoDiscount}
              allowNegative={false}
              suffix=" ₽"
              prefix="-"
              className="p1"
              thousandSeparator=" "
              displayType="text"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="p2">Доставка</p>
          <div className="flex items-center gap-[10px]">
            {deliveryType}
            {', '}
            {deliveryType === 'Курьером' ? (
              <NumericFormat
                value={1000}
                allowNegative={false}
                suffix=" ₽"
                className="p1"
                thousandSeparator=" "
                displayType="text"
              />
            ) : (
              <p className="p1">бесплатно</p>
            )}
          </div>
        </div>
      </div>
      <span className="block w-full h-[3px] bg-[#fff]"></span>
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
      </div>{' '}
      <div className="flex items-center justify-between py-[10px] xl:py-[20px]">
        <p className="h5">Итого</p>
        <NumericFormat
          value={totalPrice}
          suffix=" ₽"
          className="h5"
          thousandSeparator=" "
          displayType="text"
        />
      </div>
      <button className="button" onClick={handleSubmit}>
        Оформить заказ
      </button>
      <div className="flex flex-col gap-[15px] xl:gap-[30px]">
        <label className="flex gap-[10px]">
          <input
            type="checkbox"
            className="checkbox"
            checked={payRulesAgreed}
            onChange={() => setPayRulesAgreed((prev: any) => !prev)}
          />
          <p className="p2">
            Я соглашаюсь с&nbsp;
            <a href="#" className="text-[var(--red)]">
              правилами оплаты и возврата
            </a>
          </p>
        </label>
        <label className="flex gap-[10px]">
          <input
            type="checkbox"
            className="checkbox"
            checked={personalDataAgreed}
            onChange={() => setPersonalDataAgreed((prev: any) => !prev)}
          />
          <p className="p2">
            Я соглашаюсь с&nbsp;
            <a href="#" className="text-[var(--red)]">
              обработкой персональных данных
            </a>
          </p>
        </label>
      </div>
    </div>
  )
}

const CartItem = ({ item, index }: any) => {
  return (
    <div key={index} className="flex flex-col sm:flex-row gap-[20px]">
      <img src={item?.imageUrl} className="w-[120px] aspect-[12/17] object-cover" alt="" />
      <div className="flex flex-row w-full justify-between gap-[16px] md:gap-[24px]">
        <div className="flex flex-col gap-[16px] md:gap-[20px]">
          <h5 className="h3 -mb-[10px] md:mb-0">{item?.name}</h5>
          <div className="flex sm:hidden gap-[8px]">
            <NumericFormat
              allowNegative={false}
              value={item.price}
              suffix=" ₽"
              className="h5"
              thousandSeparator=" "
              displayType="text"
            />
            {item.oldPrice && item.oldPrice > 0 ? (
              <>
                <NumericFormat
                  allowNegative={false}
                  value={item.oldPrice}
                  suffix=" ₽"
                  className="text-[var(--service)_!important] p1 line-through"
                  thousandSeparator=" "
                  displayType="text"
                />

                <NumericFormat
                  value={Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}
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
            <p className="p2 text-[15px] md:text-[18px] w-[90px]">Модель:</p>
            <p className="p2 text-[15px] md:text-[18px] w-[90px]">{item.articul}</p>
          </div>
          <div className="flex items-center gap-[16px]">
            <p className="p2 text-[15px] md:text-[18px] w-[90px]">Размер:</p>
            <p className="p2 text-[15px] md:text-[18px] w-[90px]">{item.size?.name}</p>
          </div>
          <div className="flex items-center gap-[16px]">
            <p className="p2 text-[15px] md:text-[18px] w-[90px]">Цвет:</p>
            <p className="p2 text-[15px] md:text-[18px] w-[90px] flex items-center">
              {' '}
              <span
                className="block min-w-[24px] h-[24px] rounded-[50%] mr-[8px]"
                style={{ background: item.colorCode }}
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

              {item.oldPrice && item.oldPrice > 0 ? (
                <NumericFormat
                  allowNegative={false}
                  value={Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}
                  suffix="%"
                  prefix="-"
                  className="text-[var(--red)_!important] p1"
                  thousandSeparator=" "
                  displayType="text"
                />
              ) : null}
            </div>
            {item.oldPrice && item.oldPrice > 0 ? (
              <NumericFormat
                value={item.oldPrice}
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

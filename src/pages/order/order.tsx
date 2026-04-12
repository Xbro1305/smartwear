import axios from 'axios'
import { useEffect, useState } from 'react'
import { NumericFormat, PatternFormat } from 'react-number-format'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa'
import { ROUTER_PATHS } from '@/shared/config/routes'
import PvzMapWidget from './pvz/PvzMapWidget'
import locationMark from './local-two.svg'
import { BsCheck } from 'react-icons/bs'

export const Order = () => {
  const cart = useSelector((state: any) => state.cart.items)
  const [deliveryType, setDeliveryType] = useState<'Самовывоз' | 'До пункта выдачи' | 'Курьером'>(
    'Самовывоз'
  )
  const [selectedAddress, setSelectedAddress] = useState<any>()
  const [promo, setPromo] = useState('')
  const [user, setUser] = useState<any>(null)
  const { CART } = ROUTER_PATHS

  const pathname = location.pathname

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => {
      setUser(res.data)
      const defaultAddress = res.data.addresses.find((address: any) => address.isDefault)
      if (defaultAddress) {
        setSelectedAddress({
          location: {
            address_full: defaultAddress.fullAddress,
          },
        })
        defaultAddress.type === 'PVZ'
          ? setDeliveryType('До пункта выдачи')
          : setDeliveryType('Курьером')
      }
    })

    document.title = `Оформление заказа - Умная одежда`
    window.scrollTo(0, 0)
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

  const totalPrice = cart.reduce((sum: number, item: any) => {
    return sum + +item.price
  }, 0)

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
        <div className="flex flex-col gap-[16px] lg:gap-[30px] w-full">
          <div className="flex flex-col gap-[8px] border-b-[var(--gray)] pb-[20px] border-solid border-b-[3px]">
            <h1 className="h2">Оформление заказа</h1>
          </div>{' '}
          {cart.length > 0 && <CartPage cart={cart} />}
          <h3 className="h3">1. Способ доставки</h3>
          <div className="flex flex-col gap-[16px] lg:gap-[30px] pt-[20px]">
            <label className="flex gap-[10px]">
              <input
                type="radio"
                className="radio"
                name="delivery"
                checked={deliveryType == 'Самовывоз'}
                onChange={() => {
                  setDeliveryType('Самовывоз')
                  setSelectedAddress(null)
                }}
              />
              <div className="flex flex-col gap-[5px] -mt-[3px]">
                <h5 className="h5">Самовывоз</h5>
                <p className="p1">Самовывоз из нашего магазина</p>
              </div>
            </label>{' '}
            <label className="flex gap-[10px]">
              <input
                type="radio"
                className="radio"
                name="delivery"
                checked={deliveryType == 'До пункта выдачи'}
                onChange={() => {
                  setDeliveryType('До пункта выдачи')
                  setSelectedAddress(null)
                }}
              />
              <div className="flex flex-col gap-[5px] -mt-[3px]">
                <h5 className="h5">До пункта выдачи</h5>
                <p className="p1">
                  Бесплатная доставка с примеркой до пункта выдачи СДЭК (ближайшего к адресу,
                  который вы укажете)
                </p>
              </div>
            </label>
          </div>
        </div>

        {cart.length > 0 && <SideBar cls="hidden xl:flex" />}
      </div>
      <div className="flex flex-col gap-[16px] lg:gap-[30px] pt-[20px]">
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
                    onClick={() => setSelectedAddress(null)}
                  >
                    Изменить адрес
                  </button>
                </div>
              </div>
              {/* <p className="p1">Время работы:</p> */}
              {/* {selectedAddress.work_time_list?.map((time: any, index: number) => (
              <p key={index} className="p1">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][index]}:{' '}
                {time.time.replace('00:00', 'круглосуточно').replace('/', ' - ')}
              </p>
            ))} */}
            </div>
          ) : (
            <PvzMapWidget
              onSelect={pvz => {
                setSelectedAddress(pvz)
                console.log(pvz)
              }}
              type="PVZ"
            />
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
            }}
          />
          <div className="flex flex-col gap-[5px] -mt-[3px]">
            <h5 className="h5">Курьером</h5>
            <p className="p1">Бесплатная доставка курьером СДЭК до дома (с примеркой)</p>
          </div>
        </label>
        {deliveryType == 'Курьером' &&
          (selectedAddress ? (
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
                    onClick={() => setSelectedAddress(null)}
                  >
                    Изменить адрес
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <PvzMapWidget
              onSelect={pvz => {
                console.log(pvz)
                setSelectedAddress(pvz)
              }}
              type="DELIVERY"
            />
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
          <input type="radio" className="radio" name="payment" checked={true} readOnly />
          <div className="flex flex-col gap-[10px]">
            <p className="h5">При получении</p>
            <p className="p1">Картой или наличными</p>
          </div>
        </label>{' '}
        <label className="flex gap-[10px]">
          <input type="radio" className="radio" name="payment" checked={true} readOnly />
          <div className="flex flex-col gap-[10px]">
            <p className="h5">Онлайн</p>
            <p className="p1">Картой на сайте, с помощью платежных систем</p>
          </div>
        </label>
      </div>
      {cart.length > 0 && <SideBar cls="flex xl:hidden w-[100%_!important]" />}
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
}: any) => {
  const [payRulesAgreed, setPayRulesAgreed] = useState(false)
  const [personalDataAgreed, setPersonalDataAgreed] = useState(false)
  const [promoCode, setPromoCode] = useState(promo)

  return (
    <div
      className={`flex flex-col gap-[18px] xl:gap-[30px] w-full lg:w-[34%] bg-[var(--gray)] rounded-[12px] py-[12px] px-[16px] 2xl:p-[45px] h-fit xl:min-w-[408px] lg:min-w-[337px] 2xl:min-w-[500px] ${cls}`}
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
          {deliveryType}
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
      <button className="button">Оформить заказ</button>
      <div className="flex flex-col gap-[15px] xl:gap-[30px]">
        <label className="flex gap-[10px]">
          <input
            type="checkbox"
            className="checkbox"
            checked={payRulesAgreed}
            onChange={() => setPayRulesAgreed(prev => !prev)}
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
            onChange={() => setPersonalDataAgreed(prev => !prev)}
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
                  className="text-[var(--red)_!important] p1"
                  thousandSeparator=" "
                  displayType="text"
                  allowNegative={false}
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
                style={{ background: item.color.meta.colorCode }}
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

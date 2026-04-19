import axios from 'axios'
import { useEffect, useState } from 'react'
import { LuShoppingCart, LuTrash2 } from 'react-icons/lu'
import { NumericFormat } from 'react-number-format'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa'
import { ROUTER_PATHS } from '@/shared/config/routes'

export const Cart = () => {
  const dispatch = useDispatch()
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState<any>(null)
  const { ORDER } = ROUTER_PATHS
  const navigate = useNavigate()

  const pathname = location.pathname

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/categories`)
      .then(res => {
        const data = res?.data?.filter((cat: any) => cat.showInMenu)
        setCategories(data)
      })
      .catch(() => setCategories([]))

    document.title = `Корзина (${cart?.length} товар${cart?.length === 1 ? '' : 'ов'})`
    window.scrollTo(0, 0)

    if (!localStorage.getItem('token')) {
      const localCart = localStorage.getItem('cart')
      if (localCart) {
        setCart(JSON.parse(localCart))
      }
      return
    }

    axios(`${import.meta.env.VITE_APP_API_URL}/cart`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        setCart(res.data?.items || [])
        localStorage.setItem('cartCount', String(res.data?.items?.length || 0))
      })
      .catch(err => console.error('Error fetching cart:', err))
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

  const order = () => {
    navigate(ORDER)
  }

  const removeItem = (itemId: number) => {
    const data = [
      {
        variantId: itemId,
        quantity: 1,
      },
    ]

    axios(`${import.meta.env.VITE_APP_API_URL}/cart`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data,
    })
      .then(() => {
        setCart((prevCart: any) => prevCart.filter((item: any) => item.id !== itemId))
        localStorage.setItem('cartCount', String(cart.length - 1))
        dispatch({ type: 'cartCount/setCartCount', payload: cart.length - 1 })
      })
      .catch(err => console.error('Error removing item from cart:', err))
  }

  return (
    <div className="flex flex-col w-full gap-[20px] py-[12px] px-[var(--sides-padding)_!important]">
      <div className="hidden py-[30px] 2xl:flex items-center gap-[20px] text-[var(--service)_!important] text-[22px]">
        <Link to="/" className="cursor-pointer">
          Главная
        </Link>{' '}
        <FaChevronRight className="text-[18px]" /> <p>Корзина</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-[20px]">
        <div className="flex flex-col gap-[12px] lg:gap-[20px] w-full">
          <div className="flex flex-col gap-[8px] border-b-[var(--gray)] pb-[20px] border-solid border-b-[3px]">
            <h1 className="h1">Корзина</h1>
            {cart.length > 0 && (
              <p className="p2 text-[var(--service)_!important]">{cart.length} товар(a)</p>
            )}
          </div>

          {cart.length > 0 ? (
            <div className="cart flex flex-col lg:flex-row gap-[20px] lg:justify-between">
              <div className="flex flex-col gap-[20px] w-full">
                {cart.map((item: any, index: number) => (
                  <CartItem
                    key={index}
                    item={item}
                    index={index}
                    dispatch={dispatch}
                    removeItem={(variantId: number) => removeItem(variantId)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyCart categories={categories} />
          )}
        </div>

        {cart.length > 0 && (
          <CartSideBar
            order={order}
            totalProductsPrice={totalProductsPrice}
            totalDiscount={totalDiscount}
            totalPrice={totalPrice}
            cart={cart}
          />
        )}
      </div>
    </div>
  )
}

const CartSideBar = ({ totalProductsPrice, totalDiscount, totalPrice, cart, order }: any) => {
  return (
    <div className="flex flex-col gap-[18px] xl:gap-[30px] w-full lg:w-[34%] bg-[var(--gray)] rounded-[12px] py-[12px] px-[16px] 2xl:p-[45px] h-fit xl:min-w-[408px] lg:min-w-[337px]">
      <p className="p2 xl:max-w-[430px] text-center xl:text-left">
        Способ доставки можно выбрать при оформлении заказа
      </p>

      <div className="flex items-center justify-between">
        <h5 className="h5">Ваша корзина</h5>
        <h5 className="h5">{cart.length} товар(а)</h5>
      </div>

      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center justify-between">
          <p className="p2">Товары ({cart.length})</p>
          <NumericFormat
            value={totalProductsPrice}
            suffix=" ₽"
            className="text-[22px] font-medium"
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
              className="text-[22px]"
              thousandSeparator=" "
              displayType="text"
            />
          </div>
        )}
      </div>

      <span className="block w-full h-[3px] bg-[#fff]"></span>

      <div className="flex items-center justify-between">
        <p className="h5">Итого</p>
        <NumericFormat
          value={totalPrice}
          suffix=" ₽"
          className="h5"
          thousandSeparator=" "
          displayType="text"
        />
      </div>

      <button onClick={order} className="button text-center">
        Перейти к оформлению
      </button>
    </div>
  )
}

const CartItem = ({ item, index, removeItem }: any) => {
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
                style={{ background: item?.colorCode }}
              ></span>{' '}
              {item.colorAlias ? item.colorAlias : 'Без цвета'}
            </p>
          </div>
          <div className="flex xl:hidden">
            <p
              className="p2 text-[var(--service)_!important] flex items-center gap-[4px] cursor-pointer mb-[10px] whitespace-nowrap"
              onClick={() => removeItem(item.id)}
            >
              <LuTrash2 />
              Убрать из заказа
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
          <div className="hidden xl:flex">
            <p
              className="p2 text-[var(--service)_!important] flex items-center gap-[4px] cursor-pointer mb-[10px] whitespace-nowrap"
              onClick={() => removeItem(item.id)}
            >
              <LuTrash2 />
              Убрать из заказа
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const EmptyCart = ({ categories }: any) => {
  return (
    <div className="flex flex-col gap-[24px] items-center justify-center w-full">
      <LuShoppingCart className="text-[200px] text-service" />
      <h2 className="h2">В корзине пусто</h2>
      <p className="p1 max-w-[400px] text-center">Добавьте товары из каталога</p>
      <div className="flex items-center gap-[24px]">
        {categories ? (
          categories.slice(0, 2).map((cat: any, index: number) => (
            <a
              key={cat.id}
              href={`${cat.slug}`}
              className={`px-[24px] py-[12px] text-[#fff] ${index % 2 ? 'bg-[#DC2A1F] hover:text-[#282B32]' : 'bg-[#282B32] hover:text-[#282B32]'} rounded-[8px] text-[#333333] hover:bg-[#E0E0E0]`}
            >
              {cat.name}
            </a>
          ))
        ) : (
          <p>Загрузка категорий...</p>
        )}
      </div>
    </div>
  )
}

import axios from 'axios'
import { useEffect, useState } from 'react'
import { LuShoppingCart, LuTrash2 } from 'react-icons/lu'
import { NumericFormat } from 'react-number-format'

export const Cart = () => {
  const [cart, setCart] = useState<any[]>([])
  const [categories, setCategories] = useState<any>(null)

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/categories`)
      .then(res => {
        const data = res?.data?.filter((cat: any) => cat.showInMenu)
        setCategories(data)
      })
      .catch(() => setCategories([]))

    const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(localCart)

    document.title = `Корзина (${cart?.length} товар${cart?.length === 1 ? '' : 'ов'})`
  }, [])

  return (
    <div className=" flex flex-col gap-[30px] py-[12px] px-[16px] lg:p-[50px]">
      <div className="flex flex-col gap-[8px] border-b-[var(--gray)] pb-[20px] border-solid border-b-[3px]">
        <h1 className="h1">Корзина</h1>
        {cart.length ? (
          <p className="p2 text-[var(--service)_!important]">{cart.length} товар(a)</p>
        ) : (
          ''
        )}
      </div>
      {cart.length > 0 ? (
        <div className="flex flex-col xl:flex-row gap-[20px] lg:justify-between">
          <div className="flex flex-col gap-[20px] w-full xl:w-[64%] xl:max-w-[64%]">
            {cart.map((item: any, index: number) => (
              <div key={index} className="flex flex-col sm:flex-row gap-[20px]">
                <img
                  src={item?.imageUrl}
                  className="w-[120px] aspect-[12/17] object-cover"
                  alt=""
                />
                <div className="flex flex-row w-full justify-between gap-[24px]">
                  <div className="flex flex-col gap-[20px]">
                    <h5 className="h5">{item?.name}</h5>
                    <div className="flex sm:hidden gap-[8px]">
                      <NumericFormat
                        allowNegative={false}
                        value={item.price}
                        suffix=" ₽"
                        className="h5"
                        thousandSeparator=" "
                        displayType="text"
                      />
                      {item.oldPrice && (
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
                      )}
                    </div>
                    <div className="flex items-center gap-[16px]">
                      <p className="p1 w-[90px]">Модель:</p>
                      <p className="p1 w-[90px]">{item.articul}</p>
                    </div>
                    <div className="flex items-center gap-[16px]">
                      <p className="p1 w-[90px]">Размер:</p>
                      <p className="p1 w-[90px]">{item.size?.name}</p>
                    </div>
                    <div className="flex items-center gap-[16px]">
                      <p className="p1 w-[90px]">Цвет:</p>
                      <p className="p1 w-[90px] flex items-center">
                        {' '}
                        <span
                          className="block min-w-[24px] h-[24px] rounded-[50%] mr-[8px]"
                          style={{ background: item.color.meta.colorCode }}
                        ></span>{' '}
                        {item.colorAlias ? item.colorAlias : 'Без цвета'}
                      </p>
                    </div>
                    <div className="flex lg:hidden">
                      <p
                        className="p2 text-[var(--service)_!important] flex items-center gap-[4px] cursor-pointer mb-[10px]"
                        onClick={() => {
                          const newCart = cart.filter((_: any, i: number) => i !== index)
                          setCart(newCart)
                          localStorage.setItem('cart', JSON.stringify(newCart))
                        }}
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

                        {item.oldPrice && (
                          <NumericFormat
                            allowNegative={false}
                            value={Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}
                            suffix="%"
                            prefix="-"
                            className="text-[var(--red)_!important] p1"
                            thousandSeparator=" "
                            displayType="text"
                          />
                        )}
                      </div>
                      {item.oldPrice && (
                        <NumericFormat
                          value={item.oldPrice}
                          suffix=" ₽"
                          className="text-[var(--service)_!important] p1 line-through ml-auto"
                          thousandSeparator=" "
                          displayType="text"
                          allowNegative={false}
                        />
                      )}
                    </div>
                    <div className="hidden lg:flex">
                      <p
                        className="p2 text-[var(--service)_!important] flex items-center gap-[4px] cursor-pointer mb-[10px]"
                        onClick={() => {
                          const newCart = cart.filter((_: any, i: number) => i !== index)
                          setCart(newCart)
                          localStorage.setItem('cart', JSON.stringify(newCart))
                        }}
                      >
                        <LuTrash2 />
                        Убрать из заказа
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[18px] xl:gap-[30px] w-full xl:w-[34%] bg-[var(--gray)] rounded-[12px] py-[12px] px-[16px] 2xl:p-[45px] h-fit">
            <p className="p2 max-w-[430px]">Способ доставки можно выбрать при оформлении заказа</p>
            <div className="flex items-center justify-between">
              <h5 className="h5">Ваша корзина</h5>
              <h5 className="h5">{cart.length} товар(а)</h5>
            </div>

            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <p className="p2">Товары ({cart.length})</p>
                <p className="p2">
                  <NumericFormat
                    allowNegative={false}
                    value={cart.reduce((prev: any, acc: any) => {
                      return +prev + +(acc.oldPrice || acc.price)
                    }, 0)}
                    suffix=" ₽"
                    className="text-[22px] font-medium"
                    thousandSeparator=" "
                    displayType="text"
                  />
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="p2">Скидка</p>
                <p className="p2">
                  <NumericFormat
                    allowNegative={false}
                    value={cart.reduce((prev: any, acc: any) => {
                      return +prev + +(acc.oldPrice - acc.price || 0)
                    }, 0)}
                    suffix=" ₽"
                    prefix="-"
                    className="text-[22px]"
                    thousandSeparator=" "
                    displayType="text"
                  />
                </p>
              </div>
            </div>
            <span className="block w-full h-[3px] bg-[#fff]"></span>
            <div className="flex items-center justify-between">
              <p className="h5">Итого</p>
              <p className="h5">
                <NumericFormat
                  allowNegative={false}
                  value={cart.reduce((prev: any, acc: any) => {
                    return +prev + +acc.price
                  }, 0)}
                  suffix=" ₽"
                  className="h5"
                  thousandSeparator=" "
                  displayType="text"
                />
              </p>
            </div>
            <button className="button">Перейти к оформлению</button>
          </div>
        </div>
      ) : (
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
                  className={`px-[24px] py-[12px] text-[#fff] ${index % 2 ? 'bg-[#DC2A1F]' : 'bg-[#282B32]'} rounded-[8px] text-[#333333] hover:bg-[#E0E0E0]`}
                >
                  {cat.name}
                </a>
              ))
            ) : (
              <p>Загрузка категорий...</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

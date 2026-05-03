import { ROUTER_PATHS } from '@/shared/config/routes'
import { useEffect, useState } from 'react'
import { CgChevronDown } from 'react-icons/cg'
import { IoCheckmark } from 'react-icons/io5'
import { MdOutlineLocalPrintshop } from 'react-icons/md'
import { NumericFormat } from 'react-number-format'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from '../articles/ui/Articles.module.scss'
import { useGetArticlesQuery } from '@/entities/article'
import axios from 'axios'

interface Order {
  id: string
  address: string
  deliveryType: string
  paymentType: 'ONLINE' | 'OFFLINE'
  paymentStatus: string
  items: {
    imageUrl: string
    name: string
    articul: string
    size: {
      name: string
    }
    colorCode: string
    colorAlias: string
    price: number
    oldPrice?: number
  }[]
}

export const OrderDetails = () => {
  const [isListOpened, setIsListOpened] = useState<boolean>(true)
  const [order, setOrder] = useState<Order>()
  const { data: articles, isLoading } = useGetArticlesQuery()
  const { PROFILE } = ROUTER_PATHS
  const { id } = useParams()

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => setOrder(res.data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div className="flex flex-col w-full gap-[16px] lg:gap-[30px] py-[32px] md:py-[60px] px-[var(--sides-padding)_!important] w-full">
      <div className="flex items-center justify-center flex-col gap-[12px] lg:gap-[24px] w-full">
        <div className="rounded-[50%] bg-[#E9AFAF] text-[#fff] aspect-square flex items-center justify-center sm:text-[64px] md:text-[96px] w-[46px] sm:w-[96px] md:w-[144px]">
          <IoCheckmark />
        </div>
        <h2 className="h2">Спасибо за покупку</h2>
      </div>
      <div className="flex flex-col gap-[16px] pb-[16px] lg:pb-[30px]  border-b-solid border-b-[2px] border-b-[var(--gray)]">
        <h3 className="h3">Детали заказа №{id}</h3>
        <div className="flex items-center gap-[5px]">
          <h5 className="h5">Способ получения:</h5>
          <p className="p1">
            {order?.deliveryType == 'PVZ' ? 'В пункте выдачи заказов' : 'Курьером'}
          </p>
        </div>
        <div className="flex items-center gap-[5px]">
          <h5 className="h5">
            Адрес {order?.deliveryType == 'PVZ' ? 'пункта выдачи' : 'доставки'}:
          </h5>
          <p className="p1">{order?.address}</p>
        </div>
      </div>{' '}
      <div className="flex flex-col gap-[16px] pb-[16px] lg:pb-[30px]  border-b-solid border-b-[2px] border-b-[var(--gray)]">
        <div className="flex items-center gap-[5px]">
          <h5 className="h5">Способ оплаты:</h5>
          <p className="p1">{order?.paymentType == 'ONLINE' ? 'Онлайн' : 'При получении заказа'}</p>
        </div>
        <div className="flex items-center gap-[5px]">
          <h5 className="h5">Статус оплаты:</h5>
          <p className="p1">Не оплачено</p>
        </div>
        <button className="bg-[transparent] border-none p-[10px] cursor-pointer p1 flex items-center gap-[5px]">
          <MdOutlineLocalPrintshop />
          <span className="border-b-solid border-b-[1px] border-[#000]">Распечатать чек</span>
        </button>
      </div>
      <div className="flex flex-col gap-[30px]">
        <h4
          className="h4 flex items-center gap-[4px] cursor-pointer"
          onClick={() => setIsListOpened(prev => !prev)}
        >
          Состав заказа{' '}
          <CgChevronDown style={{ transform: !isListOpened ? 'rotate(180deg)' : '' }} />
        </h4>
        {isListOpened &&
          order?.items?.map((i: any, index: number) => <CartItem item={i} index={index} />)}
      </div>
      <div className="flex flex-col gap-[24px] lg:gap-[48px] items-center">
        <Link
          to={PROFILE}
          id="admin-button"
          className="w-full max-w-[526px] flex items-center justify-center"
        >
          На страницу заказов
        </Link>

        <p className="p1 text-center">
          Вы можете отследить ваш заказ <br /> в{' '}
          <Link to={PROFILE} className="border-solid border-b-[1px] border-[#000]">
            личном кабинете
          </Link>
        </p>
      </div>
      {isLoading ? (
        <>Загрузка статей...</>
      ) : (
        <div>
          <h2 className="h2">Статьи</h2>
          <div className={styles.articles_list_items}>
            {articles?.map((a: any, index: number) => <Article article={a} index={index} />)}
          </div>
        </div>
      )}
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
            <p className="p2 text-[15px] md:text-[18px] w-[90px]">{item.size}</p>
          </div>
          <div className="flex items-center gap-[16px]">
            <p className="p2 text-[15px] md:text-[18px] w-[90px]">Цвет:</p>
            <p className="p2 text-[15px] md:text-[18px] w-[90px] flex items-center">
              {' '}
              <span
                className="block min-w-[24px] h-[24px] rounded-[50%] mr-[8px]"
                style={{ background: item.colorCode }}
              ></span>{' '}
              {item.color ? item.color : 'Без цвета'}
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

const Article = ({ article, index }: any) => {
  const navigate = useNavigate()
  return (
    <div
      className={styles.articles_list_item}
      key={index}
      onClick={() => navigate(`/article/${article.keyword}`)}
    >
      <img alt={''} src={article.imageUrl || ''} />
      <span className="p2">
        {article.createdAt &&
          new Date(article.createdAt.toString()).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
      </span>
      <h5 className={'h5'}>{article.title}</h5>
      <div dangerouslySetInnerHTML={{ __html: article.description }} />
      <section className={styles.articles_list_item_tags}>
        {article.tags?.map((tag: any) => <span key={tag}>{tag}</span>)}
      </section>
    </div>
  )
}

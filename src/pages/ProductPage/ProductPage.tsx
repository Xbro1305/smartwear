import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import img1 from '@/assets/images/homeAcs.png'
import { HiThumbUp } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { CgClose, CgRuler } from 'react-icons/cg'
import { BsHeart, BsQuestionCircle } from 'react-icons/bs'
import styles from '@/pages/home/home.module.scss'
import heart from '@/assets/images/homeHeart.svg'
import catalog from '@/assets/images/homeCatalog.jpeg'
import Slider from 'react-slick'
import top from './assets/top.png'
import center from './assets/center.png'
import bottom from './assets/bottom.png'
import mobile from './assets/mobile.png'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/app/store/cart'

interface Media {
  url: string
  kind: 'photo' | 'lining' | 'cover' | 'video'
  id: number
  colorAttrValueId: number
}

interface Color {
  value: string
  id: number
  meta: { colorCode: string }
  alias: string
}

interface Size {
  id: number
  name: string
  orderNum: number
}

interface ProductPageProps {
  data: any
}

interface Breadcrumb {
  id?: number
  name: string
  slug: string
}

interface LocationState {
  breadcrumbs?: Breadcrumb[]
}

export const ProductPage: React.FC<ProductPageProps> = ({ data }) => {
  const [item, setItem] = useState<any>()
  const [selectedPhoto, setSelectedPhoto] = useState<any>()
  const [media, setMedia] = useState<Media[]>()
  const [selectedColor, setSelectedColor] = useState<Color | null>()
  const [selectedSize, setSelectedSize] = useState<Size | undefined>()
  const [colors, setColors] = useState<Color[] | null>()
  const [sizes, setSizes] = useState<Size[] | undefined>()
  const [stores, setStores] = useState<Size[] | undefined>()
  const [isTableOpened, setIsTableOpened] = useState(false)
  const [selectedInfo, setSelectedInfo] = useState<'features' | 'info' | 'shops' | 'care' | ''>(
    'features'
  )
  const [sizeTable, setSizeTable] = useState<any>({})

  const dispatch = useDispatch()

  useEffect(() => {
    if (!data) return

    setItem(data)

    // 1. Уникальные размеры по name
    const sizesMap = new Map()
    data.variants.forEach((v: any) => {
      // аналогично с цветами

      const size = v.sizeValue
      if (!sizesMap.has(size.name)) {
        sizesMap.set(size.name, size)
      }
    })
    const sizes = Array.from(sizesMap.values()) as Size[]

    document.title = data.metaTitle

    let meta = document.querySelector('meta[name="description"]')

    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }

    meta.setAttribute('content', data.metaDescription)

    // 2. Уникальные цвета по value
    const colorsMap = new Map()
    data.variants.forEach((v: any) => {
      const color = v.colorAttrValue
      // if (!colorsMap.has(color.value)) {
      //   colorsMap.set(color.value, { ...color, alias: v.colorAlias })
      // }

      // Исправлено: уникальные цвета по id и по alias

      const key = `${color.id}-${v.colorAlias}`
      if (!colorsMap.has(key)) {
        colorsMap.set(key, { ...color, alias: v.colorAlias })
      }
    })

    const colors = Array.from(colorsMap.values()) as Color[]

    setSizes(sizes)
    setColors(colors)
    // Найти первый цвет, для которого есть хотя бы один размер в наличии
    const availableColor =
      colors.find(color =>
        sizes.some(size =>
          data.variants.some(
            (v: any) =>
              v.colorAttrValueId === color.id &&
              v.sizeValueId === size.id &&
              v.colorAlias === color.alias &&
              v.codes.some((code: any) =>
                code.stocks?.some((stock: any) => (stock.quantity || 0) > 0)
              )
          )
        )
      ) || colors[0]

    setSelectedColor(availableColor)

    // Найти первый размер для выбранного цвета, который есть в наличии
    const availableSize =
      sizes.find(size =>
        data.variants.some(
          (v: any) =>
            v.colorAttrValueId === availableColor.id &&
            v.sizeValueId === size.id &&
            v.colorAlias === availableColor.alias &&
            v.codes.some((code: any) =>
              code.stocks?.some((stock: any) => (stock.quantity || 0) > 0)
            )
        )
      ) || sizes[0]

    setSelectedSize(availableSize)

    axios(`${import.meta.env.VITE_APP_API_URL}/media/${data.id}`)
      .then(res => {
        setMedia(
          res.data.sort((a: Media, b: Media) => {
            if (a.kind === 'cover' && b.kind !== 'cover') return -1
            if (a.kind !== 'cover' && b.kind === 'cover') return 1
            return a.id - b.id
          })
        )
        setSelectedPhoto(res.data.find((i: any) => i.kind == 'cover') || res.data[0])
      })
      .catch(err => console.log(err))

    axios(`${import.meta.env.VITE_APP_API_URL}/stores`)
      .then(res => setStores(res.data))
      .catch(err => console.log(err))

    axios(`${import.meta.env.VITE_APP_API_URL}/sizes/tables`)
      .then(res => {
        const itemBrandId = data.attributeValues?.find(
          (i: any) => i.attributeValue?.attribute?.name == 'Бренд'
        )?.attributeValue?.id
        const table = res.data.find((t: any) => t.brandId == itemBrandId)
        setSizeTable(table)
      })
      .catch(err => console.log(err))
  }, [data])

  const oldPrice =
    item?.colorPrices?.find((p: any) => p.colorAttrValueId == selectedColor?.id)?.oldPrice ||
    item?.oldPrice ||
    0

  const price =
    item?.colorPrices?.find((p: any) => p.colorAttrValueId == selectedColor?.id)?.price ||
    item?.price ||
    0

  const isSizeAvailableForColor = (sizeId: number) => {
    if (!selectedColor) return true

    // return item.variants?.some(
    //   (v: any) => v.colorAttrValueId === selectedColor.id && v.sizeValueId === sizeId
    // )

    // Исправлено: проверка наличия размера для выбранного цвета по alias

    return item.variants?.some(
      (v: any) =>
        v.colorAttrValueId === selectedColor.id &&
        v.sizeValueId === sizeId &&
        v.colorAlias === selectedColor.alias
    )
  }

  const checkStockForSize = (sizeId: number): number => {
    if (!selectedColor) return 0

    const variant = item.variants?.find(
      (v: any) =>
        v.colorAttrValueId === selectedColor.id &&
        v.sizeValueId === sizeId &&
        v.colorAlias === selectedColor.alias
    )

    if (!variant) return 0

    const stock = variant.codes.reduce((total: number, code: any) => {
      const codeStock =
        code.stocks?.reduce((sum: number, stock: any) => sum + (stock.quantity || 0), 0) || 0

      return total + codeStock
    }, 0)

    return stock
  }

  useEffect(() => {
    if (!selectedColor || !sizes?.length) return

    const firstAvailableSize = sizes.find(size =>
      item.variants?.some(
        (v: any) =>
          v.colorAttrValueId === selectedColor.id &&
          v.sizeValueId === size.id &&
          checkStockForSize(size.id)
      )
    )

    if (firstAvailableSize) {
      setSelectedSize(firstAvailableSize)
    } else {
      setSelectedSize(undefined)
    }
  }, [selectedColor])

  useEffect(() => {
    const handleClick = () => setSelectedInfo('')

    document.addEventListener('click', handleClick)

    return () => document.removeEventListener('click', handleClick)
  }, [])

  const getQty = (store: any) => {
    const variant = item?.variants
      .filter((v: any) => v.colorAttrValueId == selectedColor?.id)
      .find((v: any) => v.sizeValueId == selectedSize?.id)

    if (!variant) return 0

    const qty = variant.codes.reduce((acc: any, cur: { stocks: any[] }) => {
      const stock = cur.stocks.find((s: any) => s?.storeId == store?.id)
      return acc + (stock?.quantity || 0)
    }, 0)

    return qty
  }

  const location = useLocation()
  const state = location.state as LocationState
  const breadcrumbs = state?.breadcrumbs || []

  const addCart = () => {
    if (checkStockForSize(selectedSize?.id ?? 0) <= 0) return

    const product = {
      id: data.id,
      name: data.name,
      price,
      oldPrice,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      colorAlias: selectedColor?.alias,
      imageUrl:
        (
          media?.find(
            (m: Media) => m.kind === 'cover' || m.colorAttrValueId === selectedColor?.id
          ) || media?.[0]
        )?.url || '',
      articul: data.articul,
    }

    dispatch(addToCart(product))
  }
  return (
    <div className="flex flex-col p-[15px] xl:p-[100px]">
      {item && (
        <div className="flex flex-col gap-xl">
          {sizeTable && isTableOpened && (
            <SizeTable size={sizeTable} onClose={() => setIsTableOpened(false)} />
          )}
          <div className="flex items-center gap-[5px]">
            <span className="text-[16px] text-[#B0B7BF]">
              <Link to="/">Главная</Link> {'>'}
            </span>
            {breadcrumbs.map(cat => (
              <span
                className="text-[16px] text-[#B0B7BF] flex items-center gap-[5px]"
                key={cat.id || cat.slug}
              >
                <Link to={cat.slug} className="hover:underline">
                  {cat.name}
                </Link>
                <span className="text-[16px] text-[#B0B7BF]">{'>'}</span>
              </span>
            ))}
            <span className="text-[16px] text-[#B0B7BF]">{item.articul}</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-xl">
            <div className="lg:hidden flex flex-col gap-[20px]">
              <p className="text-base text-dark">Модель: {item.articul}</p>
              <h3 className="h1">{item.name}</h3>
              <div
                className="p1 bg-[#fff_!important] product_description"
                dangerouslySetInnerHTML={{ __html: item.description }}
              ></div>
              <p className="p1 flex items-center gap-[5px]">
                <HiThumbUp className="text-red" />
                Купили более 100 раз
              </p>
            </div>
            <div className="lg:w-[60%] w-full flex sm:flex-row flex-col gap-[10px] sm:max-h-screen lg:max-h-none ">
              <div className="lg:hidden col-span-full w-full">
                <img
                  className="object-cover w-full h-full aspect-[3/4]"
                  src={selectedPhoto?.url || img1}
                  alt={item?.name}
                />
                {/* <img className="object-cover w-full h-full aspect-[3/4]" src={img1} alt="" /> */}
              </div>
              <div className="sm:grid lg:grid-cols-2 flex flex-row gap-[10px] xl:gap-[20px] w-full max-h-[200px] h-[200px] sm:h-auto sm:max-h-full lg:max-h-none overflow-y-auto lg:overflow-initial sm:w-[40%] lg:w-full">
                {(media?.find((m: Media) => m.colorAttrValueId == selectedColor?.id)
                  ? media.filter((m: Media) => m.colorAttrValueId == selectedColor?.id)
                  : media || []
                ).map(m => (
                  <img
                    key={m.id}
                    className="object-cover w-auto sm:w-full sm:h-auto h-full aspect-[3/4]"
                    onClick={() => setSelectedPhoto(m)}
                    src={m.url || img1}
                    alt={item.name}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-[32px] w-full lg:w-[40%]">
              <div className="flex-col hidden lg:flex">
                <h1 className="h1">{item.name}</h1>
                <div
                  dangerouslySetInnerHTML={{ __html: item.description }}
                  className="bg-[#fff_!important] product_description text-[22px]"
                ></div>
              </div>
              <div className="hidden lg:flex flex-col gap-[10px]">
                <div className="flex flex-row items-end gap-[20px]">
                  <NumericFormat
                    value={price}
                    suffix=" ₽"
                    className="text-red text-[48px] font-medium"
                    thousandSeparator=" "
                    displayType="text"
                  />
                  {oldPrice && oldPrice != 0 && (
                    <>
                      <NumericFormat
                        value={oldPrice}
                        suffix=" ₽"
                        className="text-[#777777] text-[32px] font-medium line-through mb-[10px]"
                        thousandSeparator=" "
                        displayType="text"
                      />
                      <NumericFormat
                        value={Math.round(((oldPrice - price) / oldPrice) * 100)}
                        suffix="%"
                        prefix="-"
                        className="text-red text-[24px] font-medium mb-[12px]"
                        thousandSeparator=" "
                        displayType="text"
                        allowNegative={false}
                      />
                    </>
                  )}
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('info')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-[20px] text-[19px] py-[10px] flex items-center gap-[10px] bg-[#FAFAFA] rounded-[30px] w-fit cursor-pointer"
                >
                  Подробнее о модели <FaChevronRight />
                </button>
              </div>
              <div className="flex flex-col gap-[20px]">
                <div className="hidden lg:flex items-center justify-between">
                  <p className="text-[22px]">Модель: {item.articul}</p>
                  <p className="p1 flex items-center gap-[10px]">
                    <HiThumbUp className="text-red" />
                    Купили более 100 раз
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[22px]">Производитель: </p>
                  <div className="flex items-center gap-[10px]">
                    <Link
                      className="p1 flex items-center gap-[10px] underline"
                      to={
                        item?.attributeValues?.find(
                          (i: any) => i.attributeValue?.attribute?.name == 'Бренд'
                        )?.attributeValue?.meta.seoSlug
                      }
                    >
                      {
                        item?.attributeValues?.find(
                          (i: any) => i.attributeValue?.attribute?.name == 'Бренд'
                        )?.attributeValue?.value
                      }
                    </Link>
                    <BsQuestionCircle className="font-medium text-[#B0B7BF] cursor-pointer" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[22px]">В наличии: </p>
                  <p className="p1 flex items-center gap-[10px]">
                    <div className="flex items-center gap-[5px]">
                      <span
                        className="block w-[12px] h-[16px] rounded-[5px]"
                        style={{
                          backgroundColor: data.quantity >= 1 ? '#DC2A1F' : '#B0B7BF',
                        }}
                      />
                      <span
                        className="block w-[12px] h-[16px] rounded-[5px]"
                        style={{
                          backgroundColor: data.quantity >= 8 ? '#DC2A1F' : '#B0B7BF',
                        }}
                      />
                      <span
                        className="block w-[12px] h-[16px] rounded-[5px]"
                        style={{
                          backgroundColor: data.quantity >= 16 ? '#DC2A1F' : '#B0B7BF',
                        }}
                      />
                    </div>

                    <span>
                      {data.quantity == 0
                        ? 'Нет в наличии'
                        : data.quantity < 8
                          ? 'Мало'
                          : data.quantity < 16
                            ? 'Достаточно'
                            : 'Много'}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <p className="text-[22px]">Выберите цвет: </p>
                    <p className="p1 flex items-center gap-[10px]">{selectedColor?.alias}</p>
                  </div>
                  <div className="flex gap-[10px]">
                    {colors?.map(color => (
                      <span
                        key={color.id}
                        className={`block w-[27px] h-[27px] rounded-[50%] cursor-pointer`}
                        style={{
                          background: color.meta.colorCode,
                          border:
                            selectedColor?.id == color.id && selectedColor.alias == color.alias
                              ? '1px solid black'
                              : '',
                        }}
                        onClick={() => setSelectedColor(color)}
                      ></span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <p className="text-[22px]">Выберите размер: </p>
                    {sizeTable && (
                      <>
                        <p
                          className="p1 flex items-center gap-[10px] text-[#DC2A1F_!important] cursor-pointer"
                          onClick={() => setIsTableOpened(true)}
                        >
                          <CgRuler />
                          Таблица размеров
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-[10px]">
                    {sizes
                      ?.sort((a, b) => a.orderNum - b.orderNum)
                      ?.map(size => {
                        const isAvailable = isSizeAvailableForColor(size.id)

                        const stock = checkStockForSize(size.id)

                        return isAvailable ? (
                          <div
                            key={size.id}
                            className={`
                              relative text-[23px] p-[10px] cursor-pointer
                              ${!stock ? 'text-[#00000060] cursor-not-allowed' : ''}
                              ${selectedSize?.id === size.id ? 'bg-[#F2F2F2]' : ''}
                            `}
                            onClick={() => {
                              if (!isAvailable) return
                              setSelectedSize(size)
                            }}
                          >
                            {size.name}

                            {!stock && (
                              <span className="absolute block border-b border-[1px] border-[#00000060] top-[50%] left-[0] rotate-[45deg] w-full" />
                            )}
                          </div>
                        ) : null
                      })}
                  </div>
                </div>
                <div className="flex lg:hidden justify-center flex-row items-end gap-[20px] -mb-[10px]">
                  <NumericFormat
                    value={price}
                    suffix=" ₽"
                    className="text-red text-[36px] font-medium"
                    thousandSeparator=" "
                    displayType="text"
                  />
                  {oldPrice && oldPrice != 0 && (
                    <>
                      <NumericFormat
                        value={oldPrice}
                        suffix=" ₽"
                        className="text-[#777777] text-[24px] font-medium line-through mb-[5px]"
                        thousandSeparator=" "
                        displayType="text"
                      />
                      <NumericFormat
                        value={Math.round(((oldPrice - price) / oldPrice) * 100)}
                        suffix="%"
                        prefix="-"
                        className="text-red text-[18px] font-medium mb-[7px]"
                        thousandSeparator=" "
                        displayType="text"
                        allowNegative={false}
                      />
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-center lg:justify-start gap-[10px]">
                    <button
                      className=" text-white rounded-[8px] w-[300px] px-[18px] h-[40px] lg:h-[60px] flex items-center justify-center"
                      style={{
                        backgroundColor:
                          checkStockForSize(selectedSize?.id ?? 0) > 0 ? '#DC2A1F' : '#B0B7BF',
                      }}
                      onClick={addCart}
                    >
                      {checkStockForSize(selectedSize?.id ?? 0) > 0
                        ? 'Добавить в корзину'
                        : 'Нет в наличии'}{' '}
                    </button>
                    <button className="w-[40px] lg:w-[60px] h-[40px] lg:h-[60px] flex items-center lg:text-xl justify-center text-red bg-[#F2F2F2] rounded-[8px]">
                      <BsHeart />
                    </button>
                  </div>
                  <p className="text-[#B0B7BF_!important] p2 text-center lg:text-left">
                    Цвет изделия может незначительно отличаться от цвета на вашем устройстве
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[12px] max-w-full lg:max-w-[60%]" id="info">
            <div className="flex flex-col md:grid grid-cols-4 gap-[12px]">
              <p
                className="py-[20px] flex md:items-center md:justify-center px-[20px] flex-col gap-[20px] rounded-[8px] cursor-pointer"
                style={{ background: selectedInfo == 'features' ? '#FAFAFA' : '' }}
                onClick={e => {
                  e.stopPropagation()
                }}
              >
                <span
                  className="flex items-center justify-between"
                  onClick={() => setSelectedInfo(selectedInfo == 'features' ? '' : 'features')}
                >
                  {' '}
                  Особенности{' '}
                  <FaChevronDown
                    className="md:hidden"
                    style={{ transform: selectedInfo == 'features' ? 'rotate(180deg)' : '' }}
                  />
                </span>
                {selectedInfo == 'features' && (
                  <ul className="flex md:hidden list-disc ml-[27px] text-[22px] flex-col gap-[5px]">
                    {item.features
                      .sort((a: any, b: any) =>
                        a.feature.description.localeCompare(b.feature.description)
                      )
                      .map((feature: any) => (
                        <li
                          dangerouslySetInnerHTML={{ __html: feature.feature.description }}
                          key={feature.feature.id}
                        ></li>
                      ))}
                  </ul>
                )}
              </p>
              <p
                className="py-[20px] flex md:items-center md:justify-center px-[20px] flex-col gap-[20px] rounded-[8px] cursor-pointer"
                style={{ background: selectedInfo == 'info' ? '#FAFAFA' : '' }}
                onClick={e => {
                  e.stopPropagation()
                }}
              >
                <span
                  className="flex items-center justify-between"
                  onClick={() => setSelectedInfo(selectedInfo == 'info' ? '' : 'info')}
                >
                  {' '}
                  Характеристики{' '}
                  <FaChevronDown
                    className="md:hidden"
                    style={{ transform: selectedInfo == 'info' ? 'rotate(180deg)' : '' }}
                  />
                </span>
                {selectedInfo == 'info' && (
                  <div className="md:hidden flex flex-col gap-[10px] w-full">
                    {item.attributeValues
                      .sort(
                        (a: any, b: any) =>
                          a.attributeValue.attributeId - b.attributeValue.attributeId
                      )
                      .filter(
                        (attr: any) =>
                          !['Длина изделия'].includes(attr.attributeValue.attribute.name)
                      )
                      .map((attr: any) => (
                        <div className="flex items-end gap-[10px] w-full text-[#878787] text-[18px]">
                          <p>{attr.attributeValue.attribute.name}</p>
                          <div className="flex-1 border-b border-dotted border-[#878787]"></div>
                          <p>{attr.attributeValue.value}</p>
                        </div>
                      ))}
                  </div>
                )}
              </p>
              <p
                className="py-[20px] flex md:items-center md:justify-center px-[20px] flex-col gap-[20px] rounded-[8px] cursor-pointer"
                style={{ background: selectedInfo == 'shops' ? '#FAFAFA' : '' }}
                onClick={e => {
                  e.stopPropagation()
                }}
              >
                <span
                  className="flex items-center justify-between"
                  onClick={() => setSelectedInfo(selectedInfo == 'shops' ? '' : 'shops')}
                >
                  {' '}
                  В магазинах{' '}
                  <FaChevronDown
                    className="md:hidden"
                    style={{ transform: selectedInfo == 'shops' ? 'rotate(180deg)' : '' }}
                  />
                </span>
                {selectedInfo == 'shops' && (
                  <div className="flex md:hidden flex-col gap-[10px] w-full">
                    {stores?.map((store: any) => (
                      <div
                        key={store.id}
                        className="flex flex-col gap-[10px] border-t border-[#DDE1E6] pt-[10px] w-full"
                      >
                        <h3 className="h3 flex items-center justify-between w-full">
                          {store.shortName} <FaChevronRight />
                        </h3>
                        <p className="p2 text-[#94A3B8_!important]">{store.address}</p>
                        <p className="p2">Пн-вт 9:00-21:00, сб-вс выходной</p>
                        <div className="flex items-center justify-between mt-[20px]">
                          <button className="bg-red h-[50px] rounded-[8px] text-white px-[24px]">
                            Подробнее
                          </button>
                          <p className="text-[red_!important] p2">
                            Количество: {getQty(store)} шт.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </p>
              <p
                className="py-[20px] flex md:items-center md:justify-center px-[20px] flex-col gap-[20px] rounded-[8px] cursor-pointer"
                style={{ background: selectedInfo == 'care' ? '#FAFAFA' : '' }}
                onClick={e => {
                  e.stopPropagation()
                }}
              >
                <span
                  className="flex items-center justify-between"
                  onClick={() => setSelectedInfo(selectedInfo == 'care' ? '' : 'care')}
                >
                  {' '}
                  Как стирать{' '}
                  <FaChevronDown
                    className="md:hidden"
                    style={{ transform: selectedInfo == 'care' ? 'rotate(180deg)' : '' }}
                  />
                </span>
                {selectedInfo == 'care' && (
                  <div className="flex md:hidden flex-col gap-[10px]">
                    {item.cares.map((care: any) => (
                      <div key={care.id} className="flex items-center gap-[10px]">
                        <img
                          src={care.careIcon.imageUrl}
                          alt={care.careIcon.name}
                          className="w-[20px] grayscale"
                        />
                        <p>
                          {
                            care?.careIcon.name
                              ?.replace('температура', 'температура ')
                              ?.split(' или')?.[0]
                          }
                        </p>
                      </div>
                    ))}

                    {item.careRecommendation && (
                      <p className="p1 my-[10px]">{item?.careRecommendation}</p>
                    )}

                    <Link
                      to="#"
                      className="border-dashed border-b-[1px] border-dark text-dark pb-[1px] w-fit"
                    >
                      Подробнее про уход за одеждой
                    </Link>
                  </div>
                )}
              </p>
            </div>
            <div className="hidden md:flex p- bg-[#FDFDFD] px-[30px] py-[12px] w-full">
              {selectedInfo == 'features' && (
                <ul className="flex list-disc ml-[27px] text-[22px] flex-col gap-[5px] text-[dark]">
                  {item.features.map((feature: any) => (
                    <li
                      className="bg-[#fff_!important]"
                      dangerouslySetInnerHTML={{ __html: feature.feature.description }}
                      key={feature?.feature?.id}
                    ></li>
                  ))}
                </ul>
              )}
              {selectedInfo == 'info' && (
                <div className="flex flex-col gap-[10px] w-full">
                  {item.attributeValues
                    .filter(
                      (attr: any) => !['Длина изделия'].includes(attr.attributeValue.attribute.name)
                    )
                    .map((attr: any) => (
                      <div
                        className="flex items-end gap-[10px] w-full text-[#878787] text-[22px]"
                        key={attr.id}
                      >
                        <p>{attr.attributeValue.attribute.name}</p>
                        <div className="flex-1 border-b border-dotted border-[#878787]"></div>
                        <p>{attr.attributeValue.value}</p>
                      </div>
                    ))}
                  {item.lengthValue && (
                    <div className="flex items-end gap-[10px] w-full text-[#878787] text-[22px]">
                      <p>Длина изделия</p>
                      <div className="flex-1 border-b border-dotted border-[#878787]"></div>
                      <p>{item.lengthValue} см</p>
                    </div>
                  )}
                </div>
              )}
              {selectedInfo == 'shops' && (
                <div className="flex flex-col gap-[10px] w-full">
                  {stores?.map((store: any) => (
                    <div
                      key={store.id}
                      className="flex flex-col gap-[10px] border-t border-[#DDE1E6] pt-[10px] w-full"
                    >
                      <h3 className="h3 flex items-center justify-between w-full">
                        {store.shortName} <FaChevronRight />
                      </h3>
                      <p className="p2 text-[#94A3B8_!important]">{store.address}</p>
                      <p className="p2">Пн-вт 9:00-21:00, сб-вс выходной</p>
                      <div className="flex items-center justify-between mt-[20px]">
                        <button className="bg-red h-[50px] rounded-[8px] text-white px-[24px]">
                          Подробнее
                        </button>
                        <p className="text-[red_!important] p2">Количество: {getQty(store)} шт.</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedInfo == 'care' && (
                <div className="flex flex-col gap-[10px]">
                  {item.cares.map((care: any) => (
                    <div className="flex items-center gap-[10px]" key={care.careIcon.id}>
                      <img
                        src={care.careIcon.imageUrl}
                        alt={care.careIcon.name}
                        className="w-[25px] grayscale"
                      />
                      <p>
                        {
                          care?.careIcon.name
                            ?.replace('температура', 'температура ')
                            ?.split(' или')?.[0]
                        }
                      </p>
                    </div>
                  ))}

                  {item.careRecommendation && (
                    <p className="p1 my-[10px]">{item?.careRecommendation}</p>
                  )}

                  <Link
                    to="#"
                    className="border-dashed border-b-[1px] border-dark text-dark pb-[1px] w-fit"
                  >
                    Подробнее про уход за одеждой
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className={styles.home_recommendations}>
            <h2 className={'h2'}>Рекомендуем на зиму</h2>
            <div className={styles.home_recommendations_wrapper}>
              {recomendations.map((i, index) => (
                <div className={`${styles.home_recommendations_item}`} key={index}>
                  <img alt={''} src={i.img} />
                  <div className={styles.home_recommendations_item_info}>
                    <div className={styles.home_recommendations_item_top}>
                      <div className={styles.home_recommendations_item_colors}>
                        {i.colors.map(c => (
                          <div
                            key={c}
                            className={styles.home_recommendations_item_color}
                            style={{ background: `${c}` }}
                          ></div>
                        ))}
                      </div>
                      <img alt={''} src={heart} />
                    </div>
                    <h5 className={'h5'}>{i.title}</h5>
                    <NumericFormat
                      className={'h5'}
                      decimalSeparator={'.'}
                      displayType={'text'}
                      suffix={' ₽'}
                      thousandSeparator={' '}
                      value={i.price}
                    />
                    <a
                      className={
                        'button w-[100%_!important] h-[60px_!important] text-center items-center flex justify-center rounded-[0_!important] hover:opacity-100 transition-opactiy transition-[0.3s]'
                      }
                      href={''}
                    >
                      Посмотреть подробнее
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:hidden">
            <Slider className={`${styles.home_recommendations_mob}`} {...settings}>
              {recomendations.map((i, index) => (
                <div className={styles.home_recommendations_item} key={index}>
                  <img alt={''} src={i.img} />
                  <div className={styles.home_recommendations_item_info}>
                    <div className={styles.home_recommendations_item_top}>
                      <div className={styles.home_recommendations_item_colors}>
                        {i.colors.map(c => (
                          <div
                            key={c}
                            className={styles.home_recommendations_item_color}
                            style={{ background: `${c}` }}
                          ></div>
                        ))}
                      </div>
                      <img alt={''} src={heart} />
                    </div>
                    <h5 className={'h5'}>{i.title}</h5>
                    <NumericFormat
                      className={'h5'}
                      decimalSeparator={'.'}
                      displayType={'text'}
                      suffix={' ₽'}
                      thousandSeparator={' '}
                      value={i.price}
                    />
                    <a
                      className={
                        'button opacity-85 w-full hover:opacity-100 transition-opactiy transition-[0.3s]'
                      }
                      href={''}
                    >
                      Посмотреть подробнее
                    </a>
                  </div>
                </div>
              ))}
            </Slider>{' '}
          </div>
        </div>
      )}
    </div>
  )
}

interface SizeRow {
  sizeValue: { name: string }
  height: string
  chest: string
  waist: string
  hips: string
}

interface SizeTableProps {
  size: {
    rows: SizeRow[]
  }
  onClose: () => void
}

const SizeTable = ({ size, onClose }: SizeTableProps) => {
  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-[#3535354D]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative z-[60] w-[80%] max-h-[80vh] overflow-y-auto rounded-[12px] bg-white p-[32px] flex flex-col gap-[32px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <h3 className="h3">Таблица размеров</h3>
          <button onClick={onClose} className="text-[30px] text-[#282B32]">
            <CgClose />
          </button>
        </div>

        {/* Table */}
        <div className="w-full hidden md:flex items-start justify-center">
          <div className="flex min-w-full">
            <div className="flex flex-col items-center">
              <p className="p2 p-[14px] whitespace-nowrap">Российский размер</p>
              <p className="p2 p-[14px] whitespace-nowrap">Рост (см)</p>
              <p className="p2 p-[14px] whitespace-nowrap">Обхват груди (см)</p>
              <p className="p2 p-[14px] whitespace-nowrap">Обхват талии (см)</p>
              <p className="p2 p-[14px] whitespace-nowrap">Обхват бёдер (см)</p>
            </div>

            {size?.rows
              ?.sort((a: any, b: any) => a.sizeValue.orderNum - b.sizeValue.orderNum)
              ?.map((row, index) => (
                <div key={index} className="flex flex-col items-center bg-[#F7F7F7] flex-1">
                  <p className="p2 p-[14px] whitespace-nowrap">{row.sizeValue.name}</p>
                  <p className="p2 p-[14px] whitespace-nowrap">{row.height}</p>
                  <p className="p2 p-[14px] whitespace-nowrap">{row.chest}</p>
                  <p className="p2 p-[14px] whitespace-nowrap">{row.waist}</p>
                  <p className="p2 p-[14px] whitespace-nowrap">{row.hips}</p>
                </div>
              ))}
          </div>
        </div>

        <table className="block md:hidden bg-[#F7F7F7]">
          <thead>
            <tr>
              <th className="text-[12px] py-[10px] px-[3px]">Ru размер</th>
              <th className="text-[12px] py-[10px] px-[3px]">Рост (см)</th>
              <th className="text-[12px] py-[10px] px-[3px]">Обхват груди (см)</th>
              <th className="text-[12px] py-[10px] px-[3px]">Обхват талии (см)</th>
              <th className="text-[12px] py-[10px] px-[3px]">Обхват бёдер (см)</th>
            </tr>
          </thead>
          <tbody>
            {size?.rows
              ?.sort((a: any, b: any) => a.sizeValue.orderNum - b.sizeValue.orderNum)
              ?.map((row, index) => (
                <tr key={index}>
                  <td className="text-[12px] text-center py-[10px] px-[3px] whitespace-nowrap font-[600_!important]">
                    {row.sizeValue.name}
                  </td>
                  <td className="text-[12px] text-center py-[10px] px-[3px] whitespace-nowrap">
                    {row.height}
                  </td>
                  <td className="text-[12px] text-center py-[10px] px-[3px] whitespace-nowrap">
                    {row.chest}
                  </td>
                  <td className="text-[12px] text-center py-[10px] px-[3px] whitespace-nowrap">
                    {row.waist}
                  </td>
                  <td className="text-[12px] text-center py-[10px] px-[3px] whitespace-nowrap">
                    {row.hips}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* How to measure */}
        <h4 className="h4">Как снять мерки</h4>

        <div className="gap-[16px] hidden md:flex">
          <img src={top} className="min-w-[195px] w-[195px] aspect-square" alt="Обхват груди" />
          <div className="flex flex-col gap-[4px]">
            <h5 className="h5">Обхват груди</h5>
            <p className="p1">
              Измеряется по самым выступающим точкам. Рекомендуем снимать мерки в белье.
            </p>
          </div>
        </div>

        <div className="gap-[16px] hidden md:flex">
          <img src={center} className="min-w-[195px] w-[195px] aspect-square" alt="Обхват талии" />
          <div className="flex flex-col gap-[4px]">
            <h5 className="h5">Обхват талии (см)</h5>
            <p className="p1">
              Оберните сантиметровую ленту вокруг талии. Лента должна лежать параллельно полу и
              плотно облегать талию, но не врезаться в кожу.
            </p>
          </div>
        </div>

        <div className="gap-[16px] hidden md:flex">
          <img src={bottom} className="min-w-[195px] w-[195px] aspect-square" alt="Обхват бёдер" />
          <div className="flex flex-col gap-[4px]">
            <h5 className="h5">Обхват бёдер (см)</h5>
            <p className="p1">Измеряется по самым выпуклым точкам ягодиц.</p>
          </div>
        </div>
        <img src={mobile} className="flex md:hidden" alt="" />
      </div>
    </div>
  )
}

export default SizeTable
const settings = {
  infinite: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 520,
      settings: {
        initialSlide: 1,
        slidesToScroll: 1,
        slidesToShow: 1,
      },
    },
  ],
  slidesToScroll: 2,
  slidesToShow: 2,
  speed: 500,
}

function SampleNextArrow(props: any) {
  const { onClick } = props

  return <div className={styles.slick_next} onClick={onClick} />
}

function SamplePrevArrow(props: any) {
  const { onClick } = props

  return <div className={styles.slick_prev} onClick={onClick} />
}

const recomendations = [
  {
    colors: ['#849051', '#EFC7BD'],
    img: catalog,
    price: 24150,
    sale: false,
    title: 'Женская демисезонная куртка limolady 3279',
  },
  {
    colors: ['#849051', '#EFC7BD'],
    img: catalog,
    price: 24150,
    sale: false,
    title: 'Женская демисезонная куртка limolady 3279',
  },
  {
    colors: ['#849051', '#EFC7BD'],
    img: catalog,
    price: 24150,
    sale: true,
    title: 'Женская демисезонная куртка limolady 3279',
  },
]

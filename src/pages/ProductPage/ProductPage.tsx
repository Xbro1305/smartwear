import { Link, useParams } from 'react-router-dom'
// import top from './assets/top.png'
// import center from './assets/center.png'
// import bottom from './assets/bottom.png'
import { useEffect, useState } from 'react'
import axios from 'axios'
import img1 from '@/assets/images/homeAcs.png'
import { HiThumbUp } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { CgRuler } from 'react-icons/cg'
import { BsHeart, BsQuestionCircle } from 'react-icons/bs'
import styles from '@/pages/home/home.module.scss'
import heart from '@/assets/images/homeHeart.svg'
import catalog from '@/assets/images/homeCatalog.jpeg'
import Slider from 'react-slick'

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
}

interface Size {
  id: number
  name: string
}

export const ProductPage = () => {
  const { id } = useParams()
  const [item, setItem] = useState<any>()
  const [selectedPhoto, setSelectedPhoto] = useState<any>()
  const [media, setMedia] = useState<Media[]>()
  const [selectedColor, setSelectedColor] = useState<Color | null>()
  const [selectedSize, setSelectedSize] = useState<Size | undefined>()
  const [colors, setColors] = useState<Color[] | null>()
  const [sizes, setSizes] = useState<Size[] | undefined>()
  const [stores, setStores] = useState<Size[] | undefined>()
  const [selectedInfo, setSelectedInfo] = useState<'features' | 'info' | 'shops' | 'care'>(
    'features'
  )

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/products/slug/${id}`)
      .then(res => {
        setItem(res.data)

        // 1. Уникальные размеры по name
        const sizesMap = new Map()
        res.data.variants.forEach((v: any) => {
          const size = v.sizeValue
          if (!sizesMap.has(size.name)) {
            sizesMap.set(size.name, size)
          }
        })
        const sizes = Array.from(sizesMap.values()) as Size[]

        // 2. Уникальные цвета по value
        const colorsMap = new Map()
        res.data.variants.forEach((v: any) => {
          const color = v.colorAttrValue
          if (!colorsMap.has(color.value)) {
            colorsMap.set(color.value, color)
          }
        })
        const colors = Array.from(colorsMap.values()) as Color[]

        setSizes(sizes)
        setColors(colors)
        setSelectedColor(colors[0])
        setSelectedSize(sizes[0])

        axios(`${import.meta.env.VITE_APP_API_URL}/media/${res.data.id}`)
          .then(res => {
            setMedia(res.data)
            setSelectedPhoto(res.data.find((i: any) => i.kind == 'cover') || res.data[0])
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))

    axios(`${import.meta.env.VITE_APP_API_URL}/stores`)
      .then(res => setStores(res.data))
      .catch(err => console.log(err))
  }, [])

  const oldPrice =
    item?.colorPrices?.find((p: any) => p.colorAttrValueId == selectedColor?.id)?.oldPrice ||
    item?.oldPrice ||
    0

  const price =
    item?.colorPrices?.find((p: any) => p.colorAttrValueId == selectedColor?.id)?.price ||
    item?.price ||
    0

  return (
    <div className="flex flex-col p-[15px] xl:p-[100px]">
      {item && (
        <div className="flex flex-col gap-xl">
          <div className="flex flex-col lg:flex-row items-start gap-xl">
            <div className="lg:hidden flex flex-col gap-[20px]">
              <p className="text-base text-dark">Модель: {item.articul}</p>
              <h3 className="h1">{item.name}</h3>
              <p className="p1" dangerouslySetInnerHTML={{ __html: item.description }}></p>
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
                {media?.map(m => (
                  <img
                    key={m.id}
                    className="object-cover w-auto sm:w-full sm:h-auto h-full aspect-[3/4]"
                    onClick={() => setSelectedPhoto(m)}
                    src={m.url || img1}
                    alt={item.name}
                  />
                ))}
                {/* <img className="object-cover w-full h-full aspect-[3/4]" src={img1} alt="" />
                <img className="object-cover w-full h-full aspect-[3/4]" src={img1} alt="" />
                <img className="object-cover w-full h-full aspect-[3/4]" src={img1} alt="" />
                <img className="object-cover w-full h-full aspect-[3/4]" src={img1} alt="" /> */}
              </div>
            </div>
            <div className="flex flex-col gap-[32px] w-full lg:w-[40%]">
              <div className="flex-col hidden lg:flex">
                <h1 className="h1">{item.name}</h1>
                <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
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
                </div>
                <a
                  href="#info"
                  className="px-[20px] text-[19px] py-[10px] flex items-center gap-[10px] bg-[#FAFAFA] rounded-[30px] w-fit cursor-pointer"
                >
                  Подробнее о модели <FaChevronRight />
                </a>
              </div>
              <div className="flex flex-col gap-[20px]">
                <div className="flex items-center justify-between">
                  <p className="text-[22px]">Модель: {item.articul}</p>
                  <p className="p1 flex items-center gap-[10px]">
                    <HiThumbUp className="text-red" />
                    Купили более 100 раз
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[22px]">Производитель: </p>
                  <p className="p1 flex items-center gap-[10px]">
                    {
                      item?.attributeValues?.find(
                        (i: any) => i.attributeValue?.attribute?.name == 'Бренд'
                      )?.attributeValue?.value
                    }
                    <BsQuestionCircle className="font-medium text-[#B0B7BF]" />
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[22px]">В наличии: </p>
                  <p className="p1 flex items-center gap-[10px]">
                    <div className="flex items-center gap-[5px]">
                      <span
                        className="block w-[12px] h-[16px] rounded-[5px]"
                        style={{ backgroundColor: item.quantity >= 1 ? '#DC2A1F' : '#B0B7BF' }}
                      ></span>
                      <span
                        className="block w-[12px] h-[16px] rounded-[5px]"
                        style={{ backgroundColor: item.quantity > 3 ? '#DC2A1F' : '#B0B7BF' }}
                      ></span>
                      <span
                        className="block w-[12px] h-[16px] rounded-[5px]"
                        style={{ backgroundColor: item.quantity > 11 ? '#DC2A1F' : '#B0B7BF' }}
                      ></span>
                    </div>
                    <span>
                      {item.quantity >= 1 ? 'Мало' : item.quantity > 3 ? 'Достаточно' : 'Много'}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <p className="text-[22px]">Цвет: </p>
                    <p className="p1 flex items-center gap-[10px]">{selectedColor?.value}</p>
                  </div>
                  <div className="flex gap-[10px]">
                    {colors?.map(color => (
                      <span
                        key={color.id}
                        className={`block w-[27px] h-[27px] rounded-[50%] cursor-pointer`}
                        style={{ background: color.meta.colorCode }}
                        onClick={() => setSelectedColor(color)}
                      ></span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <p className="text-[22px]">Выберите размер: </p>
                    <p className="p1 flex items-center gap-[10px] text-[#DC2A1F_!important] cursor-pointer">
                      <CgRuler />
                      Таблица размеров
                    </p>
                  </div>
                  <div className="flex gap-[10px]">
                    {sizes?.map(size => (
                      <p
                        key={size.id}
                        className="text-[23px] cursor-pointer p-[10px]"
                        onClick={() => setSelectedSize(size)}
                        style={{ background: selectedSize?.id == size.id ? '#F2F2F2' : '' }}
                      >
                        {size.name}
                      </p>
                    ))}
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
                </div>
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-center lg:justify-start gap-[10px]">
                    <button className="bg-red text-white rounded-[8px] w-[300px] px-[18px] h-[40px] lg:h-[60px] flex items-center justify-center">
                      Добавить в корзину
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
                onClick={() => setSelectedInfo('features')}
              >
                <span className="flex items-center justify-between">
                  {' '}
                  Особенности{' '}
                  <FaChevronDown
                    className="md:hidden"
                    style={{ transform: selectedInfo == 'features' ? 'rotate(180deg)' : '' }}
                  />
                </span>
                {selectedInfo == 'features' && (
                  <ul className="flex md:hidden list-disc ml-[27px] text-[22px] flex-col gap-[5px]">
                    {item.features.map((feature: any) => (
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
                onClick={() => setSelectedInfo('info')}
              >
                <span className="flex items-center justify-between">
                  {' '}
                  Характеристики{' '}
                  <FaChevronDown
                    className="md:hidden"
                    style={{ transform: selectedInfo == 'info' ? 'rotate(180deg)' : '' }}
                  />
                </span>
                {selectedInfo == 'info' && (
                  <div className="md:hidden flex flex-col gap-[10px] w-full">
                    {item.attributeValues.map((attr: any) => (
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
                onClick={() => setSelectedInfo('shops')}
              >
                <span className="flex items-center justify-between">
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
                            Заказать
                          </button>
                          <p className="text-[red_!important] p2">
                            Количество: {item.quantity} шт.
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
                onClick={() => setSelectedInfo('care')}
              >
                <span className="flex items-center justify-between">
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
                        <img src={care.careIcon.imageUrl} alt={care.careIcon.name} />
                        <p className="p1">{care.careIcon.name}</p>
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
                      dangerouslySetInnerHTML={{ __html: feature.feature.description }}
                      key={feature.feture.id}
                    ></li>
                  ))}
                </ul>
              )}
              {selectedInfo == 'info' && (
                <div className="flex flex-col gap-[10px] w-full">
                  {item.attributeValues.map((attr: any) => (
                    <div
                      className="flex items-end gap-[10px] w-full text-[#878787] text-[22px]"
                      key={attr.id}
                    >
                      <p>{attr.attributeValue.attribute.name}</p>
                      <div className="flex-1 border-b border-dotted border-[#878787]"></div>
                      <p>{attr.attributeValue.value}</p>
                    </div>
                  ))}
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
                          Заказать
                        </button>
                        <p className="text-[red_!important] p2">Количество: {item.quantity} шт.</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedInfo == 'care' && (
                <div className="flex flex-col gap-[10px]">
                  {item.cares.map((care: any) => (
                    <div className="flex items-center gap-[10px]" key={care.careIcon.id}>
                      <img src={care.careIcon.imageUrl} alt={care.careIcon.name} />
                      <p className="p1">{care.careIcon.name}</p>
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
              {recomendations.map(i => (
                <div className={styles.home_recommendations_item} key={i.title}>
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
                    <a className={'button'} href={''}>
                      Подробнее
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <Slider className={styles.home_recommendations_mob} {...settings}>
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
                    <a className={'button'} href={''}>
                      Подробнее
                    </a>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  )
}

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
  {
    colors: ['#849051', '#EFC7BD'],
    img: catalog,
    price: 24150,
    sale: true,
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

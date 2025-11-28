import { useEffect, useState } from 'react'
import { Editor } from '../../articles/Create/editor'
import { CustomSelect } from '../Components/CustomSelect/CustomSelect'
import { NumericFormat } from 'react-number-format'
import axios from 'axios'
import { CustomInput } from './Components/Input/input'
import { LuTrash2 } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router-dom'
import { IoImage } from 'react-icons/io5'
import { FaCheck } from 'react-icons/fa'
import { toast } from 'react-toastify'
import '../Create/Create.css'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { Product } from './data'

interface Item {
  main: {
    name: string
    articul: string
    price: number
    oldPrice?: number
    description: string
    brandId?: number
    seasonId?: number
    typeId?: number
    materialId?: number
    attributeValueIds?: { [key: string]: number }[]
    featureIds?: number[]
    isPublished?: boolean
    isDeliverable?: boolean
    sizeTypeId?: number
    careIds?: number[]
    careRecommendation?: string
  }
  seo: {
    seoSlug?: string
    metaTitle?: string
    metaDescription?: string
  }
  prices?: {
    colorAttrValueId: number
    price: number
    oldPrice: number
    id?: number
  }[]
  variantCodes?: {
    colorAttrValueId: number
    id?: number
    colorAlias: string
    colorAttrValue?: any
    colorCode: string
    sizeValueId: number
    codes: {
      code: string
    }[]
  }[]
}

interface Attribute {
  id: number
  isFreeValue: boolean
  isSystem: boolean
  name: string
  orderNum: number
  values: {
    attributeId: number
    id: number
    value: string
    meta?: {
      colorCode?: string
      aliases?: string[]
    }
  }[]
}

interface Feature {
  id: number
  name: string
  description: string
}

interface Media {
  url?: string
  type: 'photo' | 'lining' | 'cover' | 'video'
  file: File
  colorAttrValueId: number
  id?: any
}

interface Store {
  storeId: number
  name: string
  shortName?: string
}

interface Stock {
  code: string
  stores: {
    storeId: number
    name: string
    quantity: number
    shortName?: string
  }[]
}

export const EditProduct = () => {
  const [item, setItem] = useState<Item>()
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [dependencies, setDependencies] = useState<any[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [cares, setCares] = useState<any[]>([])
  const [sizeTypes, setSizeTypes] = useState<any[]>([])
  const [itemMedia, setItemMedia] = useState<Media[]>()
  const [stock, setStock] = useState<Stock[]>([])
  const [warehouses, setWarehouses] = useState<Store[]>([])

  const { id } = useParams()

  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Редактировать товар - Панель администратора'

    axios(`${import.meta.env.VITE_APP_API_URL}/attributes`)
      .then(res => {
        setAttributes(res.data)
      })
      .catch(err => {
        console.error('Error fetching product attributes:', err)
      })

    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/dependencies/all`)
      .then(res => {
        setDependencies(res.data)
      })
      .catch(err => {
        console.error('Error fetching product attributes:', err)
      })

    axios(`${import.meta.env.VITE_APP_API_URL}/features`)
      .then(res => {
        setFeatures(res.data)
      })
      .catch(err => {
        console.error('Error fetching product features:', err)
      })

    axios(`${import.meta.env.VITE_APP_API_URL}/care-icons`)
      .then(res => {
        setCares(res.data)
      })
      .catch(err => {
        console.error('Error fetching care icons:', err)
      })

    axios(`${import.meta.env.VITE_APP_API_URL}/sizes/types`)
      .then(res => {
        setSizeTypes(res.data)
      })
      .catch(err => {
        console.error('Error fetching size types:', err)
      })
  }, [])

  useEffect(() => {
    if (attributes.length && sizeTypes.length) {
      axios(`${import.meta.env.VITE_APP_API_URL}/products/${id}`)
        .then((res: { data: Product }) => {
          const data = res.data
          const getAttr = (attrName: string) => {
            return data.attributeValues.find(
              (attr: any) => attr.attributeValue.attribute.name == attrName
            )
          }

          const product: Item = {
            main: {
              articul: data.articul || '',
              description: data.description || '',
              name: data.name || '',
              isDeliverable: Boolean(data.isDeliverable),
              isPublished: Boolean(data.isPublished),
              price: Number(data.price) || 0,
              oldPrice: Number(data.oldPrice) || 0,
              sizeTypeId: data.sizeTypeId || 0,
              careIds: data.cares.map((care: any) => care.careIcon.id) || [],
              featureIds: data.features.map((feature: any) => feature.feature.id) || [],
              careRecommendation: data.careRecommendation,
              brandId: getAttr('Бренд')?.attributeValueId || 0,
              seasonId: getAttr('Сезон')?.attributeValueId || 0,
              typeId: getAttr('Вид изделия')?.attributeValueId || 0,
              materialId: getAttr('Вид утеплителя')?.attributeValueId || 0,
              attributeValueIds: [
                ...(data.attributeValues
                  .map(a =>
                    ['Бренд', 'Сезон', 'Вид изделия', 'Вид утеплителя'].includes(
                      a.attributeValue.attribute.name
                    )
                      ? null
                      : { [a.attributeValue.attribute.id]: a.attributeValueId }
                  )
                  .filter(Boolean) as { [key: string]: number }[]),
              ],
            },
            seo: {
              metaTitle: data.metaTitle || '',
              metaDescription: data.metaDescription || '',
              seoSlug: data.seoSlug || '',
            },
            variantCodes: data.variants || [],
            prices: data.colorPrices,
          }

          console.log('PRODUCT FORM DATA', product)

          syncronize(product)
          setItem(product)
        })
        .catch(err => {
          console.error('Error fetching size types:', err)
        })

      axios(`${import.meta.env.VITE_APP_API_URL}/media/${id}`).then(res => {
        setItemMedia(
          res.data.map((m: any) => ({
            type: m.kind,
            colorAttrValueId: m.colorAttrValueId,
            url: m.url,
            id: m.id,
          }))
        )
      })
    }
  }, [attributes, features, sizeTypes, cares])

  const deleteRow = (rowIndex: number) => {
    setItem(prev => {
      if (!prev) return prev
      const newVariantCodes = [...(prev.variantCodes || [])]
      newVariantCodes.splice(rowIndex, 1)
      return {
        ...prev,
        variantCodes: newVariantCodes,
      }
    })
  }

  const syncronize = async (i: Item | undefined = item) => {
    if (!i) return

    axios(`${import.meta.env.VITE_APP_API_URL}/moysklad/sync/full`, {
      method: 'POST',
    }).catch(err => toast.error(err.response.data.message))

    const codes =
      i?.variantCodes
        ?.map(c => c.codes.map(vc => vc.code).filter(code => code && code.trim() !== ''))
        .filter(arr => arr && arr.length > 0)
        .flat() || []

    const url = `${import.meta.env.VITE_APP_API_URL}/product-stocks/which-stores?${codes.map(c => `codes=${encodeURIComponent(c)}`).join('&')}`

    axios(url, {
      method: 'GET',
    })
      .then((res: { data: Stock[] }) => {
        setStock(res.data as Stock[])

        const uniqueStores = Array.from(
          new Map(
            res.data.flatMap(item =>
              item.stores.map(store => [
                store.storeId,
                { storeId: store.storeId, name: store.name, shortName: store.shortName },
              ])
            )
          ).values()
        )
        setWarehouses(uniqueStores as Store[])
      })
      .catch(err => toast.error(err.response.data.message))
  }

  const sendData = async () => {
    const data = {
      name: item?.main?.name,
      articul: item?.main?.articul,
      description: item?.main?.description,
      price: item?.main?.price,
      sizeTypeId: item?.main?.sizeTypeId,
      status: true,
      featureIds: item?.main?.featureIds,
      isPublished: Boolean(item?.main?.isPublished),
      isDeliverable: Boolean(item?.main?.isDeliverable),
      oldPrice: item?.main?.oldPrice,
      careRecommendation: item?.main?.careRecommendation,
      careIconIds: item?.main?.careIds,
      variantCodes: item?.variantCodes,
      attributeValueIds: [
        item?.main.brandId,
        item?.main.seasonId,
        item?.main.materialId,
        item?.main.typeId,
      ],
      simpleAttributes: {
        [attributes.find(i => i.name == 'Вид утеплителя')?.id || 0]: item?.main.materialId,
      },
      quantity: 1,
      seoSlug: item?.seo.seoSlug,
      metaTitle: item?.seo.metaTitle,
      metaDescription: item?.seo.metaDescription,
    }

    try {
      await axios.put(`${import.meta.env.VITE_APP_API_URL}/products/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // 1️⃣ UPDATE MAIN PRODUCT
      await sendData()

      // 2️⃣ SEND MEDIA
      const media = [...(itemMedia || [])]

      for (const mediaItem of media) {
        // if (mediaItem.file || mediaItem.id == null) continue

        console.log('MEDIA ITEM', mediaItem)

        if (mediaItem.id) {
          const formData = new FormData()
          if (mediaItem.file) formData.append('file', mediaItem.file)
          if (mediaItem.type) formData.append('kind', mediaItem.type)
          if (mediaItem.type === 'cover' || mediaItem.type === 'photo')
            formData.append('colorAttrValueId', String(mediaItem.colorAttrValueId))

          try {
            await axios.put(
              `${import.meta.env.VITE_APP_API_URL}/media/${mediaItem.id}/`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'multipart/form-data',
                },
              }
            )
          } catch (err) {
            console.log(mediaItem)
            console.log(err)
          }

          continue
        }

        const formData = new FormData()
        formData.append('file', mediaItem.file)
        formData.append('kind', mediaItem.type)

        if (mediaItem.type === 'cover' || mediaItem.type === 'photo') {
          formData.append('colorAttrValueId', String(mediaItem.colorAttrValueId))
        }

        try {
          await axios.post(`${import.meta.env.VITE_APP_API_URL}/media/${id}/`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          })
        } catch (err) {
          console.log(err)
        }
      }

      // 4️⃣ SEND PRICES
      const prices = [...(item?.prices || [])]

      for (const price of prices) {
        try {
          await axios({
            url: `${import.meta.env.VITE_APP_API_URL}/products/${id}/prices/color`,
            method: price?.id ? 'PUT' : 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            data: price,
          })
        } catch (err) {
          console.log(err)
          toast.error('Ошибка при добавлении цвета')
        }
      }

      syncronize()

      // 5️⃣ REDIRECT AFTER ALL REQUESTS
      window.location.href = '/admin/products'
    } catch (e) {
      console.log(e)
    }
  }

  const columns = `110px 110px 110px 110px 120px 110px 50px ${warehouses
    .map(() => '110px')
    .join(' ')} 90px`

  return (
    <div className="py-[80px] px-[36px] flex justify-between relative">
      <div className="flex flex-col gap-[48px]">
        <h1 id="h1">Редактор товара</h1>
        <div className="flex flex-col gap-[24px]">
          <h3 id="main" className="text-[20px]">
            Основные параметры
          </h3>
          <CustomInput
            title="Артикул товара"
            placeholder="Артикул"
            className="w-[372px]"
            value={item?.main?.articul || ''}
            onChange={(e: any) => {
              setItem(
                prev =>
                  ({
                    ...prev,
                    main: {
                      ...prev?.main,
                      articul: e.target.value,
                    },
                  }) as Item
              )
            }}
          />

          <CustomInput
            title="Название товара"
            placeholder="Название товара"
            className="w-[768px]"
            value={item?.main?.name || ''}
            onChange={(e: any) => {
              setItem(
                prev =>
                  ({
                    ...prev,
                    main: {
                      ...prev?.main,
                      name: e.target.value,
                    },
                  }) as Item
              )
            }}
          />
          <div className="flex flex-col gap-[5px] w-[768px]">
            <p>Описание товара</p>
            <Editor
              isimg={true}
              onChange={value =>
                setItem(
                  prev =>
                    ({
                      ...prev,
                      main: {
                        ...prev?.main,
                        description: value,
                      },
                    }) as Item
                )
              }
              value={item?.main?.description || ''}
            />
          </div>
          <CustomInput
            title="Meta-tag title"
            placeholder="Введите заголовок"
            className="w-[768px]"
            value={item?.seo?.metaTitle || ''}
            onChange={(e: any) => {
              setItem(
                prev =>
                  ({
                    ...prev,
                    seo: {
                      ...prev?.seo,
                      metaTitle: e.target.value,
                    },
                  }) as Item
              )
            }}
          />
          <CustomInput
            title="Meta-tag description"
            placeholder="Введите описание"
            className="w-[768px]"
            value={item?.seo?.metaDescription || ''}
            onChange={(e: any) => {
              setItem(
                prev =>
                  ({
                    ...prev,
                    seo: {
                      ...prev?.seo,
                      metaDescription: e.target.value,
                    },
                  }) as Item
              )
            }}
          />
          <CustomInput
            title="Seo-ссылка"
            placeholder="Введите seo-ссылку"
            className="w-[768px]"
            value={item?.seo?.seoSlug || ''}
            onChange={(e: any) => {
              setItem(
                prev =>
                  ({
                    ...prev,
                    seo: {
                      ...prev?.seo,
                      seoSlug: e.target.value,
                    },
                  }) as Item
              )
            }}
          />

          <div className="flex gap-[24px]">
            <div className="flex flex-col gap-sm">
              <p>Показывать на сайте</p>
              <CustomSelect
                data={[
                  { id: 1, value: 'Да' },
                  { id: 2, value: 'Нет' },
                ]}
                placeholder="Выберите значение"
                onChange={id =>
                  setItem(
                    prev =>
                      ({
                        ...prev,
                        main: {
                          ...prev?.main,
                          isPublished: id === 1,
                        },
                      }) as Item
                  )
                }
                value={
                  item?.main?.isPublished
                    ? {
                        id: 1,
                        value: 'Да',
                      }
                    : {
                        id: 2,
                        value: 'Нет',
                      }
                }
                showSuggestions={false}
              />
            </div>
            <div className="flex flex-col gap-sm">
              <p>Доступен для доставки</p>
              <CustomSelect
                data={[
                  { id: 1, value: 'Да' },
                  { id: 2, value: 'Нет' },
                ]}
                placeholder="Выберите значение"
                onChange={id =>
                  setItem(
                    prev =>
                      ({
                        ...prev,
                        main: {
                          ...prev?.main,
                          isDeliverable: id === 1,
                        },
                      }) as Item
                  )
                }
                value={
                  item?.main?.isDeliverable
                    ? {
                        id: 1,
                        value: 'Да',
                      }
                    : {
                        id: 2,
                        value: 'Нет',
                      }
                }
                showSuggestions={false}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[24px]">
          <h3 id="prices" className="text-[20px] pt-[50px]">
            Цена
          </h3>
          <div className="flex items-center gap-[20px]">
            <label className="flex flex-col gap-sm">
              <p className="font-semibold text-[14px]">Актуальная цена</p>
              <NumericFormat
                className="admin-input w-[372px]"
                placeholder="Цена актуальная"
                required
                onValueChange={({ floatValue }) => {
                  setItem(
                    prev =>
                      ({
                        ...prev,
                        main: {
                          ...prev?.main,
                          price: Number(floatValue),
                        },
                      }) as Item
                  )
                }}
                value={item?.main?.price || ''}
                thousandSeparator=" "
                suffix=" ₽"
              />
            </label>
            <label className="flex flex-col gap-sm">
              <p className="font-semibold text-[14px]">Цена до скидки</p>
              <NumericFormat
                className="admin-input w-[372px]"
                placeholder="Цена до скидки"
                value={item?.main?.oldPrice || ''}
                thousandSeparator=" "
                suffix=" ₽"
                onValueChange={({ floatValue }) => {
                  setItem(
                    prev =>
                      ({
                        ...prev,
                        main: {
                          ...prev?.main,
                          oldPrice: floatValue || 0, // ✅ всегда число
                        },
                      }) as Item
                  )
                }}
              />
            </label>
          </div>
          {item?.prices?.length != 0 && item?.prices && (
            <p className="text-[14px] font-semibold">Индвидуальная цена</p>
          )}{' '}
          {item?.variantCodes?.length != 0 && item?.variantCodes && (
            <>
              <div className="flex flex-col gap-[16px]">
                {item?.prices ? (
                  item?.prices?.map((priceItem, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-[12px] items-start py-[12px] border-b-[1px] border-solid border-service max-w-[800px]"
                    >
                      <div className="flex items-center gap-[20px]">
                        <p>Для цвета</p>
                        <CustomSelect
                          onClick={() => {
                            if (
                              (attributes
                                .find(attr => attr.name === 'Цвет')
                                ?.values.filter(v =>
                                  item.variantCodes?.some(m => m.colorAttrValueId === v.id)
                                ).length ?? 0) === 0
                            ) {
                              toast.error('Сначала укажите цвета в таблице!')
                            }
                          }}
                          data={
                            attributes
                              .find(attr => attr.name === 'Цвет')
                              ?.values.filter(v =>
                                item?.variantCodes?.some(m => m.colorAttrValueId === v.id)
                              )
                              .map(v => ({
                                id: v.id,
                                value: item.variantCodes?.find(
                                  variant => variant.colorAlias && variant.colorAttrValueId === v.id
                                )
                                  ? `${v.value} (${item.variantCodes?.find(vc => vc.colorAlias && vc.colorAttrValueId === v.id)?.colorAlias})`
                                  : v.value,
                              })) || []
                          }
                          placeholder="Выберите цвет"
                          className="w-[170px]"
                          onChange={id => {
                            const newPrices = [...(item.prices || [])]
                            newPrices[index].colorAttrValueId = id
                            setItem(
                              prev =>
                                ({
                                  ...prev,
                                  prices: newPrices,
                                }) as Item
                            )
                          }}
                          value={
                            attributes
                              .find(attr => attr.name === 'Цвет')
                              ?.values.map(i => {
                                return {
                                  id: i.id,
                                  value: item.variantCodes?.find(
                                    variant =>
                                      variant.colorAlias && variant.colorAttrValueId === i.id
                                  )
                                    ? `${i.value} (${item.variantCodes?.find(vc => vc.colorAlias && vc.colorAttrValueId === i.id)?.colorAlias})`
                                    : i.value,
                                }
                              })
                              .find(val => val.id === priceItem.colorAttrValueId) || {
                              id: 0,
                              value: '',
                            }
                          }
                          showSuggestions={false}
                        />
                        <p>актуальаня цена</p>
                        <NumericFormat
                          className="admin-input w-[100px]"
                          placeholder="Цена"
                          required
                          onChange={(e: any) => {
                            const newPrices = [...(item.prices || [])]
                            const numberValue = e.target.value.replace(/\s/g, '').split('₽')[0]
                            newPrices[index].price = Number(numberValue)
                            setItem(
                              prev =>
                                ({
                                  ...prev,
                                  prices: newPrices,
                                }) as Item
                            )
                          }}
                          value={priceItem.price || ''}
                          thousandSeparator=" "
                          suffix=" ₽"
                        />
                        <p>цена до акции</p>
                        <NumericFormat
                          className="admin-input w-[100px]"
                          placeholder="Цена"
                          onChange={(e: any) => {
                            const newPrices = [...(item.prices || [])]
                            const numberValue = e.target.value.replace(/\s/g, '').split('₽')[0]
                            newPrices[index].oldPrice = Number(numberValue)
                            setItem(
                              prev =>
                                ({
                                  ...prev,
                                  prices: newPrices,
                                }) as Item
                            )
                          }}
                          value={priceItem.oldPrice || ''}
                          thousandSeparator=" "
                          suffix=" ₽"
                        />
                      </div>
                      <button
                        className="text-[#E02844] text-[14px]"
                        onClick={() => {
                          const newPrices = [...(item.prices || [])]
                          newPrices.splice(index, 1)
                          setItem(
                            prev =>
                              ({
                                ...prev,
                                prices: newPrices,
                              }) as Item
                          )
                        }}
                      >
                        Удалить цену
                      </button>
                    </div>
                  ))
                ) : (
                  <div>Индвидуальная цена не задана</div>
                )}
              </div>
              <button
                className="admin-input w-fit flex items-center justify-center"
                onClick={() => {
                  const newPrices = item?.prices ? [...item.prices] : []
                  newPrices.push({
                    colorAttrValueId: 0,
                    price: 0,
                    oldPrice: 0,
                  })
                  setItem(
                    prev =>
                      ({
                        ...prev,
                        prices: newPrices,
                      }) as Item
                  )
                }}
              >
                {' '}
                + Добавить цену
              </button>
            </>
          )}
        </div>
        <div className="flex flex-col gap-[24px]">
          <h3 id="details" className="text-[24px] pt-[50px]">
            Характеристики
          </h3>
          <div className="flex gap-[24px]">
            <div className="flex flex-col gap-sm">
              <p className="font-semibold text-[14px]">Бренд</p>
              <CustomSelect
                className="w-[372px]"
                data={
                  attributes
                    .find(attr => attr.name === 'Бренд')
                    ?.values.map(item => {
                      return { id: item.id, value: item.value }
                    }) || []
                }
                placeholder="Выберите бренд"
                onChange={id => {
                  setItem(
                    prev =>
                      ({
                        ...prev,
                        main: {
                          ...prev?.main,
                          brandId: id,
                        },
                      }) as Item
                  )
                }}
                value={
                  attributes
                    .find(attr => attr.name === 'Бренд')
                    ?.values.map(item => {
                      return { id: item.id, value: item.value }
                    })
                    .find(val => val.id === item?.main?.brandId) || {
                    id: 0,
                    value: '',
                  }
                }
              />
            </div>
            <div className="flex flex-col gap-sm">
              <p className="font-semibold text-[14px]">Сезон</p>
              <CustomSelect
                className="w-[372px]"
                data={
                  attributes
                    .find(attr => attr.name === 'Сезон')
                    ?.values.map(item => {
                      return { id: item.id, value: item.value }
                    }) || []
                }
                placeholder="Выберите сезон"
                onChange={id => {
                  setItem(
                    prev =>
                      ({
                        ...prev,
                        main: {
                          ...prev?.main,
                          seasonId: id,
                        },
                      }) as Item
                  )
                }}
                value={
                  attributes
                    .find(attr => attr.name === 'Сезон')
                    ?.values.map(item => {
                      return { id: item.id, value: item.value }
                    })
                    .find(val => val.id === item?.main?.seasonId) || {
                    id: 0,
                    value: '',
                  }
                }
              />
            </div>
          </div>
          <div className="flex gap-[24px]">
            <div className="flex flex-col gap-sm">
              <p className="font-semibold text-[14px]">Вид изделия</p>
              <CustomSelect
                className="w-[372px]"
                data={
                  attributes
                    .find(attr => attr.name === 'Вид изделия')
                    ?.values.map(item => {
                      return { id: item.id, value: item.value }
                    }) || []
                }
                placeholder="Выберите Вид изделия"
                onChange={id => {
                  setItem(
                    prev =>
                      ({
                        ...prev,
                        main: {
                          ...prev?.main,
                          typeId: id,
                        },
                      }) as Item
                  )
                }}
                value={
                  attributes
                    .find(attr => attr.name === 'Вид изделия')
                    ?.values.map(item => {
                      return { id: item.id, value: item.value }
                    })
                    .find(val => val.id === item?.main?.typeId) || {
                    id: 0,
                    value: '',
                  }
                }
              />
            </div>
            <div className="flex flex-col gap-sm">
              <p className="font-semibold text-[14px]">Вид утеплителя</p>
              <CustomSelect
                className="w-[372px]"
                data={
                  attributes
                    .find(attr => attr.name === 'Вид утеплителя')
                    ?.values.map(item => {
                      return { id: item.id, value: item.value }
                    }) || []
                }
                placeholder="Выберите Вид утеплителя"
                onChange={id => {
                  setItem(
                    prev =>
                      ({
                        ...prev,
                        main: {
                          ...prev?.main,
                          materialId: id,
                        },
                      }) as Item
                  )
                }}
                value={
                  attributes
                    .find(attr => attr.name === 'Вид утеплителя')
                    ?.values.map(item => {
                      return { id: item.id, value: item.value }
                    })
                    .find(val => val.id === item?.main?.materialId) || {
                    id: 0,
                    value: '',
                  }
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[24px]">
            {dependencies
              .filter(dependency => dependency.dependentAttributeId !== null)
              .filter(dependency => dependency.type == 'SHOW')
              .filter(dependency => {
                const d = [
                  item?.main.brandId,
                  item?.main.seasonId,
                  item?.main.typeId,
                  item?.main.materialId,
                ].includes(dependency.targetValueId)

                return d
              })
              .map(dependency => {
                {
                  const attr = attributes.find(attr => attr?.id === dependency.attributeId)

                  return (
                    <div className="flex flex-col gap-sm" key={attr?.name}>
                      <p className="font-semibold text-[14px]">{attr?.name}</p>
                      <CustomSelect
                        className="w-[372px]"
                        data={
                          attr?.values.map(item => {
                            return { id: item.id, value: item.value }
                          }) || []
                        }
                        placeholder="Выберите Вид изделия"
                        onChange={id => {
                          setItem(
                            prev =>
                              ({
                                ...prev,
                                main: {
                                  ...prev?.main,
                                  attributeValueIds: [
                                    ...(prev?.main?.attributeValueIds || []).filter(
                                      av =>
                                        !Object.keys(av).includes(String(dependency.attributeId))
                                    ),
                                    { [String(dependency.attributeId)]: id },
                                  ],
                                },
                              }) as Item
                          )
                        }}
                        value={
                          attr?.values
                            .map(item => {
                              return { id: item.id, value: item.value }
                            })
                            .find(
                              val =>
                                val.id ===
                                item?.main?.attributeValueIds?.find(av => av[String(attr?.id)])?.[
                                  String(attr?.id)
                                ]
                            ) || {
                            id: 0,
                            value: '',
                          }
                        }
                      />
                    </div>
                  )
                }
              })}
          </div>
        </div>
        <div className="flex flex-col gap-[24px]">
          <h3 id="features" className="text-[24px] pt-[50px]">
            Особенности
          </h3>
          <div className="grid grid-cols-[1fr_2px_1fr] max-w-[790px] gap-[24px]">
            <div className="flex flex-col gap-[10px]">
              <p className="text-[14px] font-medium">Все особенности</p>
              <div className="flex flex-wrap gap-[8px]">
                {features
                  .filter(feature => !item?.main?.featureIds?.includes(feature.id))
                  .map(feature => (
                    <div
                      key={feature.id}
                      className="bg-[#F2F3F5] text-[#636363] text-[16px] px-[16px] py-[4px] rounded-[8px] cursor-pointer"
                      onClick={() => {
                        if (!item?.main.featureIds?.includes(feature.id)) {
                          setItem(
                            prev =>
                              ({
                                ...prev,
                                main: {
                                  ...prev?.main,
                                  featureIds: [...(prev?.main.featureIds || []), feature.id],
                                },
                              }) as Item
                          )
                        }
                      }}
                    >
                      {feature.name}
                    </div>
                  ))}
              </div>
            </div>
            <span className="block h-full w-[1px] bg-[#20222420]"></span>
            <div className="flex flex-col gap-[10px]">
              <p className="text-[14px] font-medium">Выбранные особенности</p>
              <div className="flex flex-wrap gap-[8px]">
                {features
                  .filter(feature => item?.main?.featureIds?.includes(feature.id))
                  .map(feature => (
                    <div
                      key={feature.id}
                      className="bg-[#E02844] text-white text-[16px] px-[16px] py-[4px] rounded-[8px] cursor-pointer"
                      onClick={() => {
                        setItem(
                          prev =>
                            ({
                              ...prev,
                              main: {
                                ...prev?.main,
                                featureIds: prev?.main?.featureIds?.filter(
                                  id => id !== feature?.id
                                ),
                              },
                            }) as Item
                        )
                      }}
                    >
                      {feature.name} &times;
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[24px]">
          <h3 id="care" className="text-[24px] pt-[50px]">
            Уход за одеждой
          </h3>
          <div className="grid grid-cols-[1fr_2px_1fr] max-w-[790px] gap-[24px]">
            <div className="flex flex-col gap-[10px]">
              <p className="text-[14px] font-medium">Все рекомендации</p>
              <div className="flex flex-wrap gap-[8px]">
                {cares.map(care => (
                  <div
                    key={care.id}
                    className="relative care bg-[#F2F3F5] text-[#636363] text-[16px] px-[16px] py-[4px] rounded-[8px] cursor-pointer"
                    onClick={() => {
                      if (!item?.main.careIds?.includes(care.id)) {
                        setItem(
                          prev =>
                            ({
                              ...prev,
                              main: {
                                ...prev?.main,
                                careIds: [...(prev?.main.careIds || []), care.id],
                              },
                            }) as Item
                        )
                      }
                    }}
                  >
                    <img
                      src={care.imageUrl}
                      alt={care.name}
                      className="w-[30px] aspect-square grayscale"
                    />
                    <p>{care.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <span className="block h-full w-[1px] bg-[#20222420]"></span>
            <div className="flex flex-col gap-[10px]">
              <p className="text-[14px] font-medium">Выбранные рекомендации</p>
              <div className="flex flex-wrap gap-[8px]">
                {cares
                  .filter(care => item?.main?.careIds?.includes(care.id))
                  .map(care => (
                    <div
                      key={care.id}
                      className="relative care bg-[#E02844] text-white text-[16px] px-[16px] py-[4px] rounded-[8px] cursor-pointer flex gap-[5px] items-center"
                      onClick={() => {
                        setItem(
                          prev =>
                            ({
                              ...prev,
                              main: {
                                ...prev?.main,
                                careIds: prev?.main.careIds?.filter(id => id !== care.id),
                              },
                            }) as Item
                        )
                      }}
                    >
                      <img
                        src={care.imageUrl}
                        alt={care.name}
                        className="w-[30px] aspect-square grayscale brightness-0 invert"
                      />
                      &times;
                      <p>{care.name}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <CustomInput
            title="Индивидуальная рекомендация"
            placeholder="Введите текст рекомендации"
            className="w-[768px]"
            value={item?.main?.careRecommendation || ''}
            onChange={(e: any) => {
              setItem(
                prev =>
                  ({
                    ...prev,
                    main: {
                      ...prev?.main,
                      careRecommendation: e.target.value,
                    },
                  }) as Item
              )
            }}
          />
        </div>
        <div className="flex flex-col gap-[24px] z-[1]">
          <h3 id="sync" className="text-[24px] pt-[50px]">
            Синхронизация остатков
          </h3>
          <div className="flex flex-col gap-sm">
            <p className="text-[14px] font-medium">Вид размера</p>
            <CustomSelect
              className="w-[372px]"
              data={sizeTypes.map(sizeType => ({
                id: sizeType.id,
                value: sizeType.name,
              }))}
              placeholder="Выберите вид размера"
              onChange={id => {
                setItem(
                  prev =>
                    ({
                      ...prev,
                      main: {
                        ...prev?.main,
                        sizeTypeId: id,
                      },
                    }) as Item
                )
              }}
              value={
                sizeTypes
                  .map(sizeType => ({
                    id: sizeType.id,
                    value: sizeType.name,
                  }))
                  .find(val => val.id === item?.main?.sizeTypeId) || {
                  id: 0,
                  value: '',
                }
              }
              showSuggestions={false}
            />
          </div>

          {item?.main?.sizeTypeId && (
            <>
              <div className="flex justify-between">
                <p>
                  Общее колличество{' '}
                  {stock
                    ? stock.reduce((acc, cur) => {
                        return acc + cur.stores.reduce((sum, store) => sum + store.quantity, 0)
                      }, 0)
                    : 0}
                </p>
                <button
                  className="flex items-center justify-center border-solid border-[1px] border-[#DADADA] rounded-[12px] h-[40px] p-[13px] bg-[#fff]"
                  onClick={() => {
                    const newVariantCodes = item?.variantCodes ? [...item.variantCodes] : []
                    newVariantCodes.push({
                      colorAttrValueId: 0,
                      sizeValueId: 0,
                      colorCode: '',
                      colorAlias: '',
                      codes: [{ code: '' }, { code: '' }, { code: '' }],
                    })
                    setItem(
                      prev =>
                        ({
                          ...prev,
                          variantCodes: newVariantCodes,
                        }) as Item
                    )
                  }}
                >
                  + Добавить строчку
                </button>
              </div>
              <div className="flex flex-col relative max-w-[1020px] w-full overflow-x-auto overflow-y-visible">
                <div
                  className={`w-fit rounded-t-[8px] bg-[#F9FAFB] border-[#DDE1E6] border-solid border-b-[1px] grid gap-[5px] py-[10px]`}
                  style={{ gridTemplateColumns: columns }}
                >
                  <p className="flex items-center justify-center text-center text-[#20222480] text-[12px]">
                    КТ1
                  </p>
                  <p className="flex items-center justify-center text-center text-[#20222480] text-[12px]">
                    КТ2
                  </p>
                  <p className="flex items-center justify-center text-center text-[#20222480] text-[12px]">
                    КТ3
                  </p>{' '}
                  <p className="flex items-center justify-center text-center text-[#20222480] text-[12px]">
                    Размер
                  </p>{' '}
                  <p className="flex items-center justify-center text-center text-[#20222480] text-[12px]">
                    Цвет
                  </p>{' '}
                  <p className="flex items-center justify-center text-center text-[#20222480] text-[12px]">
                    ГЦ
                  </p>{' '}
                  <p className="flex items-center justify-center text-center text-[#20222480] text-[12px]">
                    <span className={`block w-[16px] h-[16px] rounded-[8px] bg-[#D9D9D9]`}></span>
                  </p>{' '}
                  {warehouses.map(warehouse => (
                    <p className="flex items-center justify-center text-center text-[#20222480] text-[12px]">
                      Остаток на {warehouse?.shortName}
                    </p>
                  ))}
                </div>

                {item?.variantCodes?.map((variant, index) => (
                  <div
                    key={(variant.id || index) * index}
                    style={{ gridTemplateColumns: columns }}
                    className="w-fit grid bg-[#fff] py-[20px] border-[#DDE1E6] border-solid border-b-[1px] gap-[5px]"
                  >
                    <label>
                      <NumericFormat
                        allowLeadingZeros={true}
                        type="text"
                        autoFocus
                        className="admin-input max-w-full"
                        placeholder="123456789"
                        maxLength={9}
                        onChange={(e: any) => {
                          const newVariantCodes = [...(item.variantCodes || [])]
                          newVariantCodes[index].codes[0].code = e.target.value
                          setItem(
                            prev =>
                              ({
                                ...prev,
                                variantCodes: newVariantCodes,
                              }) as Item
                          )
                        }}
                        value={variant.codes[0].code || ''}
                      />
                    </label>
                    <label className="px-[5px]">
                      <NumericFormat
                        allowLeadingZeros={true}
                        type="text"
                        className="admin-input max-w-full"
                        placeholder="123456"
                        maxLength={6}
                        onChange={(e: any) => {
                          const newVariantCodes = [...(item.variantCodes || [])]
                          newVariantCodes[index].codes[1].code = e.target.value
                          setItem(
                            prev =>
                              ({
                                ...prev,
                                variantCodes: newVariantCodes,
                              }) as Item
                          )
                        }}
                        value={variant.codes[1].code || ''}
                      />
                    </label>
                    <label className="px-[5px]">
                      <NumericFormat
                        allowLeadingZeros={true}
                        type="text"
                        className="admin-input max-w-full"
                        placeholder="123456"
                        maxLength={6}
                        onChange={(e: any) => {
                          const newVariantCodes = [...(item?.variantCodes || [])]
                          newVariantCodes[index].codes[2].code = e.target.value
                          setItem(
                            prev =>
                              ({
                                ...prev,
                                variantCodes: newVariantCodes,
                              }) as Item
                          )
                        }}
                        value={variant.codes[2].code || ''}
                      />
                    </label>
                    <div className="px-[5px]">
                      <CustomSelect
                        className="w-full"
                        data={
                          sizeTypes
                            ?.find(sizeType => sizeType.id === item?.main?.sizeTypeId)
                            ?.values?.map((size: any) => ({
                              id: size.id,
                              value: size.name,
                            })) || []
                        }
                        placeholder="Pазмер"
                        onChange={id => {
                          const newVariantCodes = [...(item?.variantCodes || [])]
                          newVariantCodes[index].sizeValueId = id
                          setItem(
                            prev =>
                              ({
                                ...prev,
                                variantCodes: newVariantCodes,
                              }) as Item
                          )
                        }}
                        value={
                          sizeTypes
                            ?.find(sizeType => sizeType.id === item?.main?.sizeTypeId)
                            ?.values?.map((size: any) => ({
                              id: size.id,
                              value: size.name,
                            }))
                            .find((val: any) => val.id === variant.sizeValueId) || {
                            id: 0,
                            value: '',
                          }
                        }
                        showSuggestions={false}
                      />
                    </div>
                    <div>
                      <CustomSelect
                        className="w-full"
                        data={
                          attributes
                            ?.find(attr => attr.name === 'Цвет')
                            ?.values?.flatMap(
                              (item, idx) =>
                                item.meta?.aliases?.map((i, index) => ({
                                  id: Number(`${index}${idx}`),
                                  value: i,
                                })) || []
                            ) || []
                          // attributes
                          //   .find(item => item.name == 'Цвет')
                          //   ?.values.map(i => ({ id: i.id, value: i.value })) || []
                        }
                        placeholder="Цвет"
                        onChange={(_, value) => {
                          const newVariantCodes = [...(item?.variantCodes || [])]

                          const color = attributes
                            .find(attr => attr.name == 'Цвет')
                            ?.values.find(item => item.meta?.aliases?.includes(value || ''))
                          newVariantCodes[index].colorAttrValueId = color?.id || 0
                          newVariantCodes[index].colorAttrValue = color?.value || ''
                          newVariantCodes[index].colorAlias = value || ''
                          newVariantCodes[index].colorCode = color?.meta?.colorCode || ''
                          setItem(
                            prev =>
                              ({
                                ...prev,
                                variantCodes: newVariantCodes,
                              }) as Item
                          )
                          // const newVariantCodes = [...(item?.variantCodes || [])]

                          // newVariantCodes[index].colorAttrValueId = id

                          // setItem(
                          //   prev =>
                          //     ({
                          //       ...prev,
                          //       variantCodes: newVariantCodes,
                          //     }) as Item
                          // )
                        }}
                        value={{
                          id: variant.colorAttrValueId || 0,
                          value: variant?.colorAlias || '',
                        }}
                        showSuggestions={false}
                      />
                    </div>
                    <div className="px-[5px] flex justify-center items-center text-center">
                      {variant?.colorAttrValue.value || ' '}
                    </div>
                    <div className="flex items-center justify-center">
                      <span
                        className={`block w-[16px] h-[16px] rounded-[8px]`}
                        style={{
                          background: variant?.colorAttrValue?.meta?.colorCode || '#D9D9D9',
                        }}
                      ></span>
                    </div>
                    {warehouses.map(warehouse => {
                      const quantity = stock
                        .filter(s => variant.codes.some(vc => vc.code === s.code))
                        .filter(s => s.stores.some(st => st.storeId === warehouse.storeId))
                        .reduce((acc, s) => {
                          const store = s.stores.find(st => st.storeId === warehouse.storeId)
                          return acc + (store ? store.quantity : 0)
                        }, 0)

                      return (
                        <span
                          key={warehouse.storeId}
                          className="px-[5px] flex items-center justify-center text-center"
                        >
                          {quantity}
                        </span>
                      )
                    })}
                    <div className="flex items-center justify-center">
                      <button
                        className="bg-[#FFF3F3] text-[#E02844] h-[36px] w-[36px] flex items-center justify-center text-[18px] rounded-[12px]"
                        onClick={() => deleteRow(index)}
                      >
                        <LuTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="admin-input w-fit flex items-center"
                onClick={() => syncronize(item)}
              >
                Синхронизировать остатки
              </button>
            </>
          )}
        </div>
        <div className="flex flex-col gap-[24px] z-[1]">
          {/* === Фото товара === */}
          <h3 className="text-[20px] font-[500] pt-[50px]" id="media">
            Фото товара
          </h3>

          <label className="relative bg-[#F2F3F5] p-[15px] rounded-[12px] w-fit flex items-center gap-[12px] cursor-pointer">
            <IoImage className="text-[#20222460]" />
            <p className="text-[#20222460]">Нажми, чтобы загрузить</p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files
                if (!files || files.length === 0) return

                Array.from(files).forEach(file => {
                  setItemMedia((prev: any) => [...(prev || []), { file, type: 'photo' }])
                })
              }}
            />
          </label>

          <div className="grid grid-cols-[470px_470px] gap-[10px] relative ">
            {itemMedia
              ?.filter(item => item.type == 'cover' || item.type == 'photo')
              ?.map(m => (
                <div
                  key={m?.file?.name || m?.id}
                  className="flex items-center gap-[12px] pl-[15px] border-l-[1px] border-solid border-[#20222420] bg-[#fff]"
                >
                  <img
                    src={m?.url || URL.createObjectURL(m?.file)}
                    alt=""
                    className="w-[185px] aspect-square rounded-[12px]"
                  />
                  <div className="flex flex-col gap-[24px] z-[1]">
                    <label className="flex items-center gap-[5px] cursor-pointer">
                      <input
                        type="checkbox"
                        className="hidden"
                        onChange={() => {
                          setItemMedia(prev =>
                            prev?.map(media => ({
                              ...media,
                              type:
                                (m?.id != null && media?.id == m?.id) ||
                                (m?.file?.name != null && media?.file?.name === m?.file?.name)
                                  ? 'cover'
                                  : media.type === 'cover'
                                    ? 'photo'
                                    : media.type,
                            }))
                          )
                        }}
                        checked={m.type === 'cover'}
                      />
                      <p
                        className="w-[18px] h-[18px] rounded-[4px] border-solid border-[2px] flex items-center justify-center text-[#E02844]"
                        style={{ borderColor: m.type === 'cover' ? '#E02844' : '#BDBFC7' }}
                      >
                        {m.type === 'cover' && <FaCheck className="text-[12px]" />}
                      </p>
                      Обложка
                    </label>

                    <div className="flex items-center gap-[5px]">
                      <p className="text-[16px]">Для цвета</p>
                      <CustomSelect
                        data={
                          attributes
                            .find(attr => attr.name === 'Цвет')
                            ?.values.filter(v =>
                              item?.variantCodes?.some(m => m.colorAttrValueId === v.id)
                            )
                            .map(v => ({
                              id: v.id,
                              value: item?.variantCodes?.find(
                                variant => variant.colorAlias && variant.colorAttrValueId === v.id
                              )
                                ? `${v.value} (${item.variantCodes?.find(vc => vc.colorAlias && vc.colorAttrValueId === v.id)?.colorAlias})`
                                : v.value,
                            })) || []
                        }
                        placeholder="Выберите цвет"
                        className="w-[170px]"
                        onChange={id => {
                          setItemMedia(prev =>
                            prev?.map(media =>
                              media?.id == m?.id || media?.file?.name === m?.file?.name
                                ? { ...media, colorAttrValueId: id }
                                : media
                            )
                          )
                        }}
                        value={
                          attributes
                            .find(attr => attr.name === 'Цвет')
                            ?.values.map(i => {
                              return {
                                id: i.id,
                                value: item?.variantCodes?.find(
                                  variant => variant.colorAlias && variant.colorAttrValueId === i.id
                                )
                                  ? `${i.value} (${item.variantCodes?.find(vc => vc.colorAlias && vc.colorAttrValueId === i.id)?.colorAlias})`
                                  : i.value,
                              }
                            })
                            .find(val => val.id === m.colorAttrValueId) || { id: 0, value: '' }
                        }
                        showSuggestions={false}
                      />
                    </div>

                    <p
                      className="text-[#E02844] text-[14px] cursor-pointer"
                      onClick={() => {
                        m.id != null
                          ? axios(`${import.meta.env.VITE_APP_API_URL}/media/${m.id}`, {
                              method: 'DELETE',
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                              },
                            })
                              .then(res => {
                                toast.success(res.data.message)
                                setItemMedia(prev =>
                                  prev?.filter(
                                    it => it?.id != m?.id || it?.file?.name != m?.file?.name
                                  )
                                )
                              })
                              .catch(err => console.log(err))
                          : setItemMedia(prev =>
                              prev?.filter(it => it?.id != m?.id || it?.file?.name != m?.file?.name)
                            )
                      }}
                    >
                      Удалить фото
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* === Фото подкладки === */}
        <div className="flex flex-col gap-[24px] z-[1] relative ">
          <h3 className="text-[20px] font-[500]" id="media">
            Фото подкладки
          </h3>

          <label className="relative bg-[#F2F3F5] p-[15px] rounded-[12px] w-fit flex items-center gap-[12px] cursor-pointer">
            <IoImage className="text-[#20222460]" />
            <p className="text-[#20222460]">Нажми, чтобы загрузить</p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files
                if (!files || files.length === 0) return

                Array.from(files).forEach(file => {
                  setItemMedia((prev: any) => [...(prev || []), { file, type: 'lining' }])
                })
              }}
            />
          </label>

          <div className="grid grid-cols-[470px_470px] gap-[10px]">
            {itemMedia
              ?.filter(item => item.type === 'lining')
              ?.map(item => (
                <div
                  key={item.id || item.file.name}
                  className="flex items-center gap-[12px] pl-[15px] border-l-[1px] border-solid border-[#20222420] bg-[#fff]"
                >
                  <img
                    src={item.url || URL.createObjectURL(item.file)}
                    alt=""
                    className="w-[185px] aspect-square rounded-[12px]"
                  />
                  <div className="flex flex-col gap-[24px] z-[1]">
                    <p
                      className="text-[#E02844] text-[14px] cursor-pointer"
                      onClick={() => {
                        item.id != null
                          ? axios(`${import.meta.env.VITE_APP_API_URL}/media/${item.id}`, {
                              method: 'DELETE',
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                              },
                            })
                              .then(res => {
                                toast.success(res.data.message)
                                setItemMedia(prev =>
                                  prev?.filter(
                                    it => it?.id != item?.id || it?.file?.name != item?.file?.name
                                  )
                                )
                              })
                              .catch(err => console.log(err))
                          : setItemMedia(prev =>
                              prev?.filter(
                                it => it?.id != item?.id || it?.file?.name != item?.file?.name
                              )
                            )
                      }}
                    >
                      Удалить фото
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* === Видео === */}
        <div className="flex flex-col gap-[24px] z-[1] relative ">
          <h3 className="text-[20px] font-[500]" id="media">
            Видео
          </h3>

          <label className="relative bg-[#F2F3F5] p-[15px] rounded-[12px] w-fit flex items-center gap-[12px] cursor-pointer">
            <IoImage className="text-[#20222460]" />
            <p className="text-[#20222460]">Нажми, чтобы загрузить</p>
            <input
              type="file"
              className="hidden"
              accept="video/*"
              onChange={(e: any) => {
                const file = e.target.files?.[0]
                if (!file) return
                setItemMedia((prev: any) => [
                  ...(prev || []),
                  { file, type: 'video', colorAttrValueId: 0 },
                ])
              }}
            />
          </label>

          <div className="grid grid-cols-[470px_470px] gap-[10px]">
            {itemMedia
              ?.filter(item => item.type === 'video')
              ?.map(item => (
                <div
                  key={item.id || item.file.name}
                  className="flex items-center gap-[12px] pl-[15px] border-l-[1px] border-solid border-[#20222420] bg-[#fff]"
                >
                  <video
                    src={item.url || URL.createObjectURL(item.file)}
                    className="w-[185px] aspect-square rounded-[12px]"
                    controls
                  />
                  <div className="flex flex-col gap-[24px]">
                    <p
                      className="text-[#E02844] text-[14px] cursor-pointer"
                      onClick={() => {
                        item.id != null
                          ? axios(`${import.meta.env.VITE_APP_API_URL}/media/${item.id}`, {
                              method: 'DELETE',
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                              },
                            })
                              .then(res => {
                                toast.success(res.data.message)
                                setItemMedia(prev =>
                                  prev?.filter(
                                    it => it?.id != item?.id || it?.file?.name != item?.file?.name
                                  )
                                )
                              })
                              .catch(err => console.log(err))
                          : setItemMedia(prev =>
                              prev?.filter(
                                it => it?.id != item?.id || it?.file?.name != item?.file?.name
                              )
                            )
                      }}
                    >
                      Удалить видео
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* === Кнопки === */}
        <div className="flex gap-[12px] ml-auto relative z-[1] bg-[#fff]">
          <button
            className="bg-[#20222450] p-[13px] h-[40px] flex items-center rounded-[12px] border-none text-[white]"
            onClick={() => navigate(ROUTER_PATHS.ADMINPRODUCTS)}
          >
            Отмена
          </button>
          <button
            className="bg-[#E02844] p-[13px] h-[40px] flex items-center rounded-[12px] border-none text-[white]"
            onClick={handleSubmit}
          >
            Сохранить
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-[24px] bg-[#fff] fixed right-[60px]">
        <div className="flex flex-col gap-[10px] bg-[#F4F4F4] text-[#202224] rounded-[8px] p-[24px] ">
          <p>Редактируемый товар</p>
          <span className="text-[#20222480]">{item?.main?.articul}</span>
        </div>
        <div className="flex flex-col p-[24px] gap-[5px]">
          <a href="#main">Основные параметры</a>
          <a href="#prices">Цена</a>
          <a href="#details">Характеристики</a>
          <a href="#features">Особенности</a>
          <a href="#care">Уход за одеждой</a>
          <a href="#sync">Синхронизация остатков</a>
          <a href="#media">Фото товара</a>
        </div>
      </div>
    </div>
  )
}

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BsPlus, BsSearch } from 'react-icons/bs'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import { toast } from 'react-toastify'
import CustomSelect from '../Components/CustomSelect/CustomSelect'
import { NumericFormat } from 'react-number-format'
import { IoImage } from 'react-icons/io5'
import { Editor } from '../../articles/Create/editor'
import { CustomSwitch } from '../Components/CustomSwitch/switch'

export interface Category {
  id?: number
  parentId?: number | null | '0'
  name: string
  slug: string
  orderNum?: number | null
  showInMenu: boolean
  showOnSite: boolean
  discountMode: 'ALL' | 'DISCOUNTED' | 'NOT_DISCOUNTED'
  productsCount?: number
  filters?: {
    attributeValueIds: number[]
    //  {
    //   brand?: string[] | any
    //   insulator?: string[] | any
    //   season?: string[] | any
    //   productType?: string[] | any
    // }
  }
  createdAt?: string
  updatedAt?: string
  children?: Category[]
  description?: string
  metaTitle?: string
  metaDescription?: string
}

export const ProductCategories = () => {
  const [page, setPage] = useState<'all' | 'brands'>('all')
  const [data, setData] = useState<Category[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [closedIds, setClosedIds] = useState<number[]>([])
  const [deletingItem, setDeletingItem] = useState<Category | null>(null)
  const [creatingItem, setCreatingItem] = useState<Category | null>(null)
  const [editingItem, setEditingItem] = useState<Category | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [attributes, setAttributes] = useState<any>(null)

  const baseUrl = import.meta.env.VITE_APP_API_URL
  const token = localStorage.getItem('token')

  const refresh = () => {
    axios(`${baseUrl}/categories/tree`)
      .then(res => setData(res.data))
      .catch(err => console.log(err))

    axios(`${baseUrl}/categories/`)
      .then(res => setCategories(res.data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    refresh()

    axios(`${baseUrl}/attributes/`)
      .then(res => setAttributes(res.data))
      .catch(err => console.log(err))
  }, [])

  const toggle = (id: number) => {
    setClosedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]))
  }

  const renderCategory = (category: Category, level = 0) => {
    const opened = !closedIds.includes(category?.id || 0)
    const hasChildren = category?.children?.length || 0 > 0

    return (
      <div
        key={category.id}
        className="overflow-hidden"
        style={{
          border: opened && level == 0 ? '1px solid #D9D9D9' : 'none',
          borderRadius: level == 0 ? '12px' : '',
        }}
      >
        <div
          className="grid items-center w-full p-[10px] h-[65px] hover:bg-[#f5f5f5]"
          style={{
            paddingLeft: `${level * 24 + 10}px`,
            gridTemplateColumns: `50px calc(400px - ${level * 24}px) 2fr 2fr 100px`,
            background:
              level == 0 ? '#fff' : level == 1 ? '#f6f6f6' : level == 2 ? '#eeeeee' : '#e6e6e6',
          }}
        >
          <div
            className="cursor-pointer flex items-center justify-center"
            onClick={() => hasChildren && toggle(category?.id || 0)}
          >
            {hasChildren ? opened ? <FaChevronDown /> : <FaChevronRight /> : null}
          </div>

          <p className="text-[14px]" onClick={() => hasChildren && toggle(category?.id || 0)}>
            {category.name}
          </p>
          <p className="text-[14px]">{level == 0 && (category.orderNum ?? '—')}</p>
          <p className="text-[14px]">{category.productsCount || 0}</p>
          <div className="flex items-center gap-[10px] justify-end pr-[20px]">
            {(page !== 'brands' || level != 0) && (
              <button
                className="text-red text-[20px] cursor-pointer"
                onClick={() => setDeletingItem(category)}
              >
                <LuTrash2 />
              </button>
            )}
            <button
              className="text-service text-[20px] cursor-pointer"
              onClick={() =>
                setEditingItem({
                  ...category,
                  slug: category.slug.split('/').pop() || category.slug,
                })
              }
            >
              <LuPencil />
            </button>
          </div>
        </div>

        {opened && category?.children?.map(child => renderCategory(child, level + 1))}
      </div>
    )
  }

  const handleCreate = () => {
    const data = creatingItem

    if (!data) return

    if (!data.orderNum && data.parentId && data.parentId !== '0')
      return toast.error('Введите порядковый номер!')

    // если корневая категория
    if (data.parentId === '0') {
      delete data.parentId
    } else if (data.parentId) {
      const parent = categories.find(c => c.id == data.parentId)

      if (parent?.slug) {
        const childSlug = data.slug.replace(/\//g, '')
        data.slug = `${parent.slug}/${childSlug}`
      }

      data.showInMenu = false
      data.orderNum = null
    }

    // гарантируем начальный /
    if (!data.slug.startsWith('/')) {
      data.slug = `/${data.slug}`
    }

    // убираем двойные слэши
    data.slug = data.slug.replace(/\/+/g, '/')

    console.log(data)

    axios(`${baseUrl}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: creatingItem,
    })
      .then(res => {
        toast.success('Создано')
        setCreatingItem(null)
        refresh()

        // Загрузка изображения

        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        axios
          .post(`${baseUrl}/categories/${res.data.id}/image`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            toast.success('Создано')
            setCreatingItem(null)
            setFile(null)
            refresh()
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  const handleEdit = () => {
    if (!editingItem?.id) return

    const data = editingItem

    if (!data.orderNum && (!data.parentId || data.parentId !== '0'))
      return toast.error('Введите порядковый номер!')

    if (!data) return

    // если корневая категория
    if (data.parentId === '0') {
      data.parentId = null
    } else if (data.parentId) {
      const parent = categories.find(c => c.id == data.parentId)

      if (parent?.slug) {
        const childSlug = data.slug.replace(/\//g, '')
        data.slug = `${parent.slug}/${childSlug}`
      }

      data.showInMenu = false
      data.orderNum = null
    }

    // гарантируем начальный /
    if (!data.slug.startsWith('/')) {
      data.slug = `/${data.slug}`
    }

    // убираем двойные слэши
    data.slug = data.slug.replace(/\/+/g, '/')

    console.log(data)

    axios(`${baseUrl}/categories/${editingItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data,
    })
      .then(() => {
        toast.success('Создано')
        setEditingItem(null)
        setFile(null)
        refresh()
      })
      .catch(err => console.log(err))
  }

  const handleDelete = (id: number) => {
    axios(`${baseUrl}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.success('Удалено')
        setDeletingItem(null)
        refresh()
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="flex flex-col px-[36px] py-[80px] gap-[48px]">
      <h1 id="h1">Категории</h1>
      {/* Tabs */}
      <div className="grid grid-cols-2 rounded-[18px] p-[6px] bg-[#20222420] gap-[12px]">
        <div
          className="flex items-center justify-center p-[13px] rounded-[12px] cursor-pointer"
          style={{
            background: page === 'all' ? '#fff' : 'none',
            color: page === 'all' ? 'var(--dark)' : '#20222480',
          }}
          onClick={() => setPage('all')}
        >
          Категории
        </div>
        <div
          className="flex items-center justify-center p-[13px] rounded-[12px] cursor-pointer"
          style={{
            background: page === 'brands' ? '#fff' : 'none',
            color: page === 'brands' ? 'var(--dark)' : '#20222480',
          }}
          onClick={() => setPage('brands')}
        >
          Категории брендов
        </div>
      </div>
      {/* Search + Add */}
      <div className="flex items-center justify-between">
        <label className="flex w-[550px] items-center gap-[10px] border-[#DADADA] border-solid border-[1px] rounded-[12px] px-[15px] h-[40px]">
          <BsSearch />
          <input
            type="text"
            placeholder="Введи название, порядковый номер"
            className="w-full border-none outline-none"
          />
        </label>

        <button
          id="admin-button"
          onClick={() =>
            setCreatingItem({
              discountMode: 'ALL',
              name: '',
              slug: '',
              parentId: '0',
              showInMenu: false,
              showOnSite: false,
              filters: {
                attributeValueIds: [],
              },
            })
          }
        >
          <BsPlus className="text-[26px]" /> Создать категорию
        </button>
      </div>
      {/* Table */}
      <div className="flex flex-col gap-[10px]">
        <div className="grid grid-cols-[50px_400px_1fr_1fr_100px] items-center w-full border-solid border-[1px] border-[#dadada] p-[10px] rounded-[12px]">
          <p></p> <p className="text-[14px] font-medium">Название</p>{' '}
          <p className="text-[14px] font-medium w-[60%]">Порядковый номер</p>{' '}
          <p className="text-[14px] font-medium w-[84px]">Артикулов в категории</p>{' '}
        </div>
        {data.map(category => renderCategory(category))}
      </div>
      {deletingItem && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#00000080] flex items-center justify-center z-50">
          <button
            className="z-40 absolute w-full h-screen opacity-0"
            onClick={() => setDeletingItem(null)}
          ></button>

          <div className="bg-white p-[36px] rounded-[12px] flex flex-col gap-[24px] w-[800px] z-50">
            <h2 id="h2">Вы уверены, что хотите удалить категорию {deletingItem?.name}?</h2>
            <div className="flex gap-[12px] ml-auto">
              <button
                id="admin-button"
                className="bg-[#20222450_!important]"
                onClick={() => setDeletingItem(null)}
              >
                Отмена
              </button>
              <button
                id="admin-button"
                className="bg-[#E02844]"
                onClick={() => handleDelete(deletingItem?.id || 0)}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal
        data={creatingItem}
        setData={setCreatingItem}
        handleSubmit={handleCreate}
        categories={categories}
        attributes={attributes}
        file={file}
        setFile={setFile}
      />{' '}
      <Modal
        data={editingItem}
        setData={setEditingItem}
        handleSubmit={handleEdit}
        categories={categories}
        attributes={attributes}
        file={file}
        setFile={setFile}
        isEdit={true}
      />
    </div>
  )
}

interface AttributeValue {
  id: number | string
  value: string
}

interface Attribute {
  name: string
  values: AttributeValue[]
}

interface Props {
  title: string
  attributes: Attribute[]
  selectedIds: (number | string)[]
  onChange: (ids: number | string) => void
}

const AttributeSelector: React.FC<Props> = ({ title, attributes, selectedIds, onChange }) => {
  const attribute = attributes?.find(a => a.name === title)

  const safeSelectedIds = Array.isArray(selectedIds)
    ? selectedIds.map((v: any) => (typeof v === 'object' ? v.id : v))
    : []

  if (!attribute) return null

  return (
    <div className="grid grid-cols-[1fr_2px_1fr] max-w-[790px] gap-[24px]">
      {/* AVAILABLE */}
      <div className="flex flex-col gap-[10px]">
        <p className="text-[14px] font-medium">{title}</p>
        <div className="flex flex-wrap gap-[8px]">
          {attribute.values
            ?.filter(v => !safeSelectedIds.includes(v.id))
            ?.map(v => (
              <div
                key={v.id}
                className="bg-[#F2F3F5] text-[#636363] text-[16px] px-[16px] py-[4px] rounded-[8px] cursor-pointer"
                onClick={() => onChange(v.id)}
              >
                {v.value}
              </div>
            ))}
        </div>
      </div>

      <span className="block h-full w-[1px] bg-[#20222420]" />

      {/* SELECTED */}
      <div className="flex flex-col gap-[10px]">
        <p className="text-[14px] font-medium">Что показываем</p>
        <div className="flex flex-wrap gap-[8px]">
          {attribute.values
            ?.filter(v => safeSelectedIds.includes(v.id))
            ?.map(v => (
              <div
                key={v.id}
                className="bg-[#E02844] text-white text-[16px] px-[16px] py-[4px] rounded-[8px] cursor-pointer"
                onClick={() => onChange(v.id)}
              >
                {v.value} &times;
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

interface ModalProps {
  data: any | null
  setData: React.Dispatch<React.SetStateAction<any | null>>
  handleSubmit: () => void
  categories: any[]
  attributes: any[]
  file: File | null
  setFile: (file: File | null) => void
  isEdit?: boolean
}

const Modal: React.FC<ModalProps> = ({
  data,
  setData,
  handleSubmit,
  categories,
  attributes,
  file,
  setFile,
  isEdit = false,
}) => {
  console.log(data)
  return (
    <>
      {data && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#00000080] flex items-center justify-center z-50">
          <button
            className="z-40 absolute w-full h-screen opacity-0"
            onClick={() => setData(null)}
          ></button>

          <div className="bg-white p-[36px] rounded-[12px] flex flex-col gap-[24px] w-[800px] z-50 max-h-[90vh] overflow-auto">
            <h2 id="h2">{isEdit ? 'Редактирование' : 'Создание'} категории</h2>

            <label className="flex flex-col gap-[5px]">
              <p>Название</p>
              <input
                type="text"
                className="admin-input w-full"
                value={data.name}
                placeholder="Введите название"
                onChange={e => setData((prev: any) => prev && { ...prev, name: e.target.value })}
              />
            </label>

            <div className="grid grid-cols-2 gap-[12px]">
              <label className="flex flex-col gap-[5px]">
                <p>Родительская категория</p>
                <CustomSelect
                  data={[
                    {
                      id: '0',
                      value: 'Нет',
                    },
                    ...(categories
                      ?.filter(c => c?.id != data?.id)
                      ?.map(category => ({
                        id: category.id || 0,
                        value: category.name,
                      })) || []),
                  ]}
                  showSuggestions={false}
                  value={{
                    id: data.parentId || 0,
                    value: categories?.find(c => c.id == data.parentId)?.name || 'Нет',
                  }}
                  onChange={data => setData((prev: any) => prev && { ...prev, parentId: data })}
                  placeholder="Выберите категорию"
                />
              </label>

              <label className="flex flex-col gap-[5px]">
                <p>Отображать в категории</p>
                <CustomSelect
                  data={[
                    { id: 1, value: 'Все' },
                    { id: 2, value: 'Только товары со скидкой или распродажей' },
                    { id: 3, value: 'Только товары без скидки или распродажи' },
                  ]}
                  showSuggestions={false}
                  value={
                    data.discountMode == 'ALL'
                      ? { id: 1, value: 'Все' }
                      : data.discountMode == 'ONLY_DISCOUNTED'
                        ? { id: 2, value: 'Только товары со скидкой или распродажей' }
                        : { id: 3, value: 'Только товары без скидки или распродажи' }
                  }
                  onChange={value => {
                    setData((prev: any) =>
                      prev
                        ? {
                            ...prev,
                            discountMode:
                              value == 1
                                ? 'ALL'
                                : value == 2
                                  ? 'ONLY_DISCOUNTED'
                                  : 'ONLY_FULL_PRICE',
                          }
                        : null
                    )
                  }}
                  placeholder="Выберите категорию"
                />
              </label>
            </div>

            {(!data.parentId || data.parentId === '0') && (
              <label className="flex flex-col gap-[5px]">
                <p>Порядковый номер</p>
                <NumericFormat
                  className="admin-input w-full"
                  value={data.orderNum}
                  placeholder="Введите порядковый номер"
                  onValueChange={({ floatValue }) =>
                    setData((prev: any) => prev && { ...prev, orderNum: floatValue })
                  }
                />
              </label>
            )}

            <label className="relative bg-[#F2F3F5] p-[15px] rounded-[12px] aspect-[9/6] w-fit flex flex-col items-center justify-center gap-[12px] cursor-pointer w-[300px]">
              {file || data.imageUrl ? (
                <img
                  className="max-w-[300px] aspect-[9/6] w-full object-cover"
                  src={file ? URL.createObjectURL(file) : data.imageUrl}
                  alt=""
                />
              ) : (
                <>
                  <IoImage className="text-[#20222460] text-[72px]" />
                  <p className="text-[#20222460]">Нажми, чтобы загрузить</p>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setFile(file)
                }}
              />
            </label>

            <div className="flex flex-col gap-[5px]">
              <p>Описание</p>
              <Editor
                isimg={true}
                onChange={value => setData((prev: any) => prev && { ...prev, description: value })}
                value={data.description || ''}
              />
            </div>

            <h3 className="font-normal text-[20px]">Ссылки и теги</h3>

            <label className="flex flex-col gap-[5px]">
              <p>Ссылка на категорию</p>
              <div className="flex admin-input">
                {data.parentId && data.parentId !== '0' && (
                  <p className="flex items-center">
                    {categories.find(c => c.id == data.parentId).slug}/
                  </p>
                )}
                <input
                  type="text"
                  className="w-full"
                  value={data.slug}
                  onChange={e => setData((prev: any) => prev && { ...prev, slug: e.target.value })}
                />
              </div>
            </label>

            <label className="flex flex-col gap-[5px]">
              <p>Meta-tag title</p>
              <input
                type="text"
                className="admin-input w-full"
                value={data.metaTitle}
                onChange={e =>
                  setData((prev: any) => prev && { ...prev, metaTitle: e.target.value })
                }
              />
            </label>

            <label className="flex flex-col gap-[5px]">
              <p>Meta-tag description</p>
              <input
                type="text"
                className="admin-input w-full"
                value={data.metaDescription}
                onChange={e =>
                  setData((prev: any) => prev && { ...prev, metaDescription: e.target.value })
                }
              />
            </label>

            <label className="flex items-center gap-[15px]">
              <CustomSwitch
                value={data.showOnSite}
                onClick={value => setData((prev: any) => prev && { ...prev, showOnSite: value })}
              />
              Показывать на сайте
            </label>

            {(!data.parentId || data.parentId === '0') && (
              <label className="flex items-center gap-[15px]">
                <CustomSwitch
                  value={data.showInMenu}
                  onClick={value => setData((prev: any) => prev && { ...prev, showInMenu: value })}
                />
                Показывать в главном меню
              </label>
            )}

            <h3 className="font-normal text-[20px]">Добавление товаров</h3>

            {attributes
              .filter(a => a.name != 'Размер')
              .map(attr => (
                <AttributeSelector
                  key={attr.id}
                  title={attr.name}
                  attributes={attributes}
                  selectedIds={data?.filters?.attributeValueIds || []}
                  onChange={ids => {
                    const selected = data?.filters?.attributeValueIds || []
                    if (selected.includes(ids)) {
                      // Удаление
                      const newSelected = selected.filter((id: number | string) => id !== ids)
                      setData((prev: any) =>
                        prev
                          ? {
                              ...prev,
                              filters: { ...prev.filters, attributeValueIds: newSelected },
                            }
                          : null
                      )
                    } else {
                      // Добавление
                      const newSelected = [...selected, ids]
                      setData((prev: any) =>
                        prev
                          ? {
                              ...prev,
                              filters: { ...prev.filters, attributeValueIds: newSelected },
                            }
                          : null
                      )
                    }
                  }}
                />
              ))}

            <div className="flex gap-[12px] ml-auto">
              <button
                id="admin-button"
                className="bg-[#20222450_!important]"
                onClick={() => setData(null)}
              >
                Отмена
              </button>
              <button id="admin-button" className="bg-[#E02844]" onClick={handleSubmit}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

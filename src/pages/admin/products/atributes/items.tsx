import { FormEvent, useEffect, useState } from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom'
import { FeatureEditor } from '../Components/FeatureEditor/editor'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AiOutlineClose, AiOutlinePicture, AiOutlinePlus } from 'react-icons/ai'
import { FaCheck, FaChevronLeft, FaPlus } from 'react-icons/fa'
import { NumericFormat } from 'react-number-format'
import { CustomSelect } from '../Components/CustomSelect/CustomSelect'
import { FilterSelector as Select1 } from '../Components/FilterSelector/Selector'
import { LuCheck, LuPencil, LuPlus, LuTrash2, LuX } from 'react-icons/lu'
import { HiDotsHorizontal, HiPlus } from 'react-icons/hi'
import styles from './Atributes.module.scss'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { IoSettingsOutline } from 'react-icons/io5'

// cloth types

export const Types = ({ id }: { id: number }) => {
  const [deleting, setDeleting] = useState<{ value: string; id: number } | null>(null)
  const [creating, setCreating] = useState<null | { value: string }>(null)

  const [items, setItems] = useState<null | {
    name: string
    id: number | string
    values: { value: string; id: number }[]
  }>(null)

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        //отсортируй по алфавиту
        const sortedValues = res.data.values.sort((a: any, b: any) =>
          a.value.localeCompare(b.value)
        )
        setItems({ ...res.data, values: sortedValues })
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }, [])

  const handleDelete = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/values/${deleting?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        id: deleting?.id,
      },
    })
      .then(() => {
        const sortedValues = items?.values.sort((a: any, b: any) => a.value.localeCompare(b.value))
        setItems(prev => ({
          ...prev!,
          values:
            sortedValues?.filter(
              (item: { id: number }) => item.id !== deleting?.id && item.id !== undefined
            ) || [],
        }))
        toast.success('Успешно удалено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setDeleting(null)
  }

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}/values`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        attributeId: id,
        value: creating?.value,
      },
    })
      .then(res => {
        const sortedValues = [...(items?.values || []), res.data].sort((a: any, b: any) =>
          a.value.localeCompare(b.value)
        )
        setItems(prev => ({
          ...prev!,
          values: sortedValues,
        }))
        toast.success('Успешно добавлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setCreating(null)
  }

  return (
    <>
      <button onClick={() => setCreating({ value: '' })} className="ml-auto" id="admin-button">
        Добавить вид изделия
      </button>
      <div className={styles.atributes_list}>
        <h3 id="h3">{items?.name}</h3>
        <div className={styles.atributes_list_items}>
          {items &&
            items?.values?.map((item, index) => (
              <div key={index} className={styles.atributes_list_item}>
                <label>{item.value}</label>
                <button onClick={() => items.values && setDeleting(items.values[index])}>
                  &times;
                </button>
              </div>
            ))}
        </div>
      </div>

      {deleting && (
        <div className={`${styles.modal} flex`}>
          <div className={styles.modal_body}>
            <h2 id="h2">Вы точно хотите удалить вид товара {deleting.value}?</h2>
            <section className="flex gap-[10px] mt-[20px] ml-auto">
              <button
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
                onClick={() => setDeleting(null)}
              >
                Отмена
              </button>
              <button id="admin-button" onClick={handleDelete}>
                Удалить
              </button>
            </section>
          </div>
        </div>
      )}

      {creating && (
        <div className={`${styles.modal} flex`}>
          <form onSubmit={e => handleCreate(e)} className={styles.modal_body}>
            <h2 id="h2">Добавление вида товара</h2>
            <label className={styles.modal_body_label}>
              <p>Название</p>
              <input
                autoFocus
                value={creating.value}
                onChange={e => setCreating({ value: e.target.value })}
                type="text"
                placeholder={`Название вида товара`}
              />
            </label>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setCreating(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button type="submit" id="admin-button">
                Сохранить
              </button>
            </section>
          </form>
        </div>
      )}
    </>
  )
}

// seasons

interface Season {
  value: string
  id: number
  meta: { startDate: string }
}

export const SeasonAttrCase = ({ id }: { id: number }) => {
  const [items, setItems] = useState<null | {
    name: string
    id: number
    values: Season[]
  }>(null)
  const [deleting, setDeleting] = useState<null | Season>(null)
  const [creating, setCreating] = useState<null | { value: string; meta: { startDate: string } }>(
    null
  )
  const [editing, setEditing] = useState<null | Season>(null)

  const refresh = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        //отсортируй по алфавиту
        const sortedValues = res.data.values.sort((a: any, b: any) =>
          a.value.localeCompare(b.value)
        )
        setItems({
          ...res.data,
          values: sortedValues,
        })
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }

  useEffect(() => refresh(), [])

  const handleDelete = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/values/${deleting?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        const sortedValues = items?.values
          .sort((a: any, b: any) => a.value.localeCompare(b.value))
          .filter((item: { id: number }) => item.id !== deleting?.id && item.id !== undefined)
        setItems(prev => ({
          ...prev!,
          values: sortedValues || [],
        }))
        toast.success('Успешно удалено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setDeleting(null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}/values`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        value: creating?.value,
        startDate: `${creating?.meta.startDate}T00:00:00.000Z`,
      },
    })
      .then(() => {
        refresh()
        toast.success('Успешно добавлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setCreating(null)
  }

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/values/${editing?.id}`, {
      data: {
        meta: { startDate: `${editing?.meta?.startDate}T00:00:00.000Z` },
        value: editing?.value,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    })
      .then(() => {
        refresh()
        toast.success('Успешно обновлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'

        toast.error(errorText)
      })
    setEditing(null)
  }

  return (
    <>
      <button
        className="ml-auto"
        id="admin-button"
        onClick={() => setCreating({ value: '', meta: { startDate: '' } })}
      >
        Добавить сезон
      </button>
      <div className={styles.seasonAtributes_list}>
        <div className={styles.seasonAtributes_list_top}>
          <p>Сезон</p>
          <p>Дата начала сезoна</p>
          <p></p>
        </div>
        {items?.values?.map((item, index) => (
          <div key={index} className={styles.seasonAtributes_list_item}>
            <label>{item.value}</label>
            <label>
              {item?.meta.startDate?.replace('-', '.')?.replace('-', '.')?.split('T')[0]}
            </label>
            <section>
              <button onClick={() => setDeleting(item)}>
                <LuTrash2 />
              </button>
              <button
                onClick={() =>
                  setEditing({
                    id: item.id,
                    value: item.value,
                    meta: { startDate: item?.meta?.startDate?.split('T')[0] },
                  })
                }
              >
                <LuPencil />
              </button>
            </section>
          </div>
        ))}
        <div style={{ transform: 'rotate(180deg)' }} className={styles.seasonAtributes_list_top}>
          <p>&nbsp;</p>
          <p></p>
          <p></p>
        </div>
      </div>

      {deleting && (
        <div className={`${styles.modal} flex`}>
          <form onSubmit={e => handleDelete(e)} className={styles.modal_body}>
            <h2 id="h2">Вы точно хотите удалить сезон {deleting.value}?</h2>
            <section className="flex gap-[10px] mt-[20px] ml-auto">
              <button
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
                onClick={() => setDeleting(null)}
                type="button"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Удалить
              </button>
            </section>
          </form>
        </div>
      )}

      {creating && (
        <div className={`${styles.modal} flex`}>
          <form onSubmit={e => handleSubmit(e)} className={styles.modal_body}>
            <h2 id="h2">Добавление сезона</h2>
            <label className={styles.modal_body_label}>
              <p>Название</p>
              <input
                type="text"
                autoFocus
                required
                value={creating.value}
                onChange={e => setCreating({ ...creating, value: e.target.value })}
                placeholder={`Название сезона`}
              />
            </label>
            <label className={styles.modal_body_label}>
              <p>Дата начала сезона</p>
              <input
                required
                value={creating.meta.startDate}
                onChange={e => setCreating({ ...creating, meta: { startDate: e.target.value } })}
                type="date"
                placeholder={`Дата начала сезона`}
              />
            </label>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setCreating(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Сохранить
              </button>
            </section>
          </form>
        </div>
      )}
      {editing && (
        <div className={`${styles.modal} flex`}>
          <form onSubmit={e => handleUpdate(e)} className={styles.modal_body}>
            <h2 id="h2">Редактирование сезона</h2>
            <label className={styles.modal_body_label}>
              <p>Название</p>
              <input
                required
                autoFocus
                type="text"
                value={editing?.value}
                onChange={e =>
                  setEditing({
                    ...editing,
                    value: e.target.value,
                  })
                }
                placeholder={`Название сезона`}
              />
            </label>
            <label className={styles.modal_body_label}>
              <p>Дата начала сезона</p>
              <input
                required
                type="date"
                value={editing?.meta.startDate}
                onChange={e =>
                  setEditing({
                    ...editing,
                    meta: { startDate: e.target.value },
                  })
                }
              />
            </label>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button type="submit" id="admin-button">
                Сохранить
              </button>
            </section>
          </form>
        </div>
      )}
    </>
  )
}

// genders

interface Genders {
  id: number
  value: string
}

export const TargetGroups = ({ id }: { id: number }) => {
  const [deleting, setDeleting] = useState<{ value: string; id: number } | null>(null)
  const [creating, setCreating] = useState<null | { value: string }>(null)

  const [items, setItems] = useState<null | {
    name: string
    id: number
    values: { value: string; id: number }[]
  }>(null)

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        //отсортируй по алфавиту
        const sortedValues = res.data.values.sort((a: any, b: any) =>
          a.value.localeCompare(b.value)
        )
        setItems({
          ...res.data,
          values: sortedValues,
        })
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }, [])

  const handleDelete = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/values/${deleting?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        const sortedValues = items?.values
          .sort((a: any, b: any) => a.value.localeCompare(b.value))
          .filter((item: { id: number }) => item.id !== deleting?.id && item.id !== undefined)
        setItems(prev => ({
          ...prev!,
          values: sortedValues || [],
        }))
        toast.success('Успешно удалено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setDeleting(null)
  }

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}/values`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        value: creating?.value,
      },
    })
      .then(res => {
        const sortedValues = [...(items?.values || []), res.data].sort((a: any, b: any) =>
          a.value.localeCompare(b.value)
        )
        setItems(prev => ({
          ...prev!,
          values: sortedValues,
        }))
        toast.success('Успешно добавлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setCreating(null)
  }

  return (
    <>
      <button onClick={() => setCreating({ value: '' })} className="ml-auto" id="admin-button">
        Добавить целевую группу
      </button>
      <div className={styles.atributes_list}>
        <h3 id="h3">{items?.name}</h3>
        <div className={styles.atributes_list_items}>
          {items?.values?.map((item, index) => (
            <div key={index} className={styles.atributes_list_item}>
              <label>{item.value}</label>
              <button onClick={() => items.values && setDeleting(items.values[index])}>
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {deleting && (
        <div className={`${styles.modal} flex`}>
          <div className={styles.modal_body}>
            <h2 id="h2">Вы точно хотите удалить целевую группу {deleting.value}?</h2>
            <section className="flex gap-[10px] mt-[20px] ml-auto">
              <button
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
                onClick={() => setDeleting(null)}
              >
                Отмена
              </button>
              <button id="admin-button" onClick={handleDelete}>
                Удалить
              </button>
            </section>
          </div>
        </div>
      )}

      {creating && (
        <div className={`${styles.modal} flex`}>
          <form onSubmit={e => handleCreate(e)} className={styles.modal_body}>
            <h2 id="h2">Добавление целевой группы</h2>
            <label className={styles.modal_body_label}>
              <p>Название</p>
              <input
                autoFocus
                value={creating.value}
                onChange={e => setCreating({ value: e.target.value })}
                type="text"
                placeholder={`Название целевой группы`}
              />
            </label>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setCreating(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button type="submit" id="admin-button">
                Сохранить
              </button>
            </section>
          </form>
        </div>
      )}
    </>
  )
}

// brands

interface Brand {
  id?: number
  value: string
  meta: {
    description: string
    imageUrl: string
    seoSlug: string
    metaTitle: string
    metaDescription: string
  }
}

export const Brands = ({ id }: { id: number }) => {
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState<null | Brand>(null)
  const [editing, setEditing] = useState<null | Brand>(null)
  const [deleting, setDeleting] = useState<null | Brand>(null)
  const [items, setItems] = useState<Brand[] | null>(null)

  const refresh = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        const data: Brand[] = res.data.values.map((item: any) => ({
          value: item.value,
          meta: {
            metaDescription: item.meta.metaDescription,
            imageUrl: item.meta.imageUrl,
            seoSlug: item.meta.seoSlug,
            description: item.meta.description || '',
            metaTitle: item.meta.metaTitle,
          },
          id: item.id,
        }))
        setItems(data)
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }

  useEffect(() => refresh(), [])

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    const item = {
      value: creating?.value,
      meta: {
        description: description,
        imageUrl: creating?.meta.imageUrl!,
        seoSlug: creating?.meta.seoSlug!,
        metaTitle: creating?.meta.metaTitle!,
        metaDescription: creating?.meta.metaDescription!,
      },
    }

    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}/values`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: item,
    })
      .then(() => {
        refresh()
        setDescription('')
        setCreating(null)
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault()

    const item = editing

    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/values/${editing?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: item,
    })
      .then(() => {
        refresh()
        setDescription('')
        setEditing(null)
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }

  const handleDelete = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/values/${deleting?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        setItems(items!.filter(i => i.id !== deleting?.id))
        setDeleting(null)
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }

  return (
    <>
      <div className={styles.brands}>
        <button
          onClick={() =>
            setCreating({
              value: '',
              meta: {
                description: '',
                imageUrl: '',
                seoSlug: '',
                metaTitle: '',
                metaDescription: '',
              },
              id: 0,
            })
          }
          className="ml-auto"
          id="admin-button"
        >
          Добавить бренд
        </button>

        <div className={styles.brands_list}>
          {items?.map((item, index) => (
            <div key={index} className={styles.brands_list_item}>
              <section className={styles.brands_list_item_top}>
                <img src={item.meta.imageUrl} alt={item.value} />
                <h3 id="h3">{item.value}</h3>
              </section>
              <div className="flex flex-col gap-[5px]">
                <p style={{ color: 'var(--dark-gray)' }} id="p2">
                  Описание
                </p>
                <p
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 6,
                  }}
                  dangerouslySetInnerHTML={{ __html: item.meta.description }}
                  id="p2"
                ></p>
              </div>
              <div className="flex flex-1 flex-col gap-[5px]">
                <p style={{ color: 'var(--dark-gray)' }} id="p2">
                  Ссылка
                </p>
                <Link
                  className="border-b-[1px] border-b-solid border-b-[var(--dark-gray)] w-[fit-content]"
                  to={`https://test.maxiscomfort.ru/${item.meta.seoSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="p2"
                >
                  {`https://test.maxiscomfort.ru/${item.meta.seoSlug}`}
                </Link>
              </div>

              <section className="flex gap-[10px] mt-[20px] ml-auto">
                <button
                  id="admin-button"
                  onClick={() => {
                    setEditing({
                      id: item.id,
                      value: item?.value || '',
                      meta: {
                        description: item?.meta?.description || '',
                        imageUrl: item?.meta?.imageUrl || '',
                        seoSlug: item?.meta?.seoSlug || '',
                        metaTitle: item?.meta?.metaTitle || '',
                        metaDescription: item?.meta?.metaDescription || '',
                      },
                    })
                    setDescription(item?.meta?.description)
                  }}
                >
                  Редактировать
                </button>
                <button
                  onClick={() =>
                    setDeleting({
                      id: item.id,
                      value: item.value,
                      meta: {
                        description: item.meta.description,
                        imageUrl: item.meta.imageUrl,
                        seoSlug: item.meta.seoSlug,
                        metaTitle: item.meta.metaTitle,
                        metaDescription: item.meta.metaDescription,
                      },
                    })
                  }
                  className="w-[40px] h-[40px] flex justify-center rounded-[12px] border-solid border-[1px] border-[var(--admin-light-gray)] items-center"
                >
                  <LuTrash2 />
                </button>
              </section>
            </div>
          ))}
        </div>
      </div>
      {creating && (
        <div className={`${styles.modal} flex p-[10px] `}>
          <form onSubmit={e => handleCreate(e)} className={styles.modal_body}>
            <h2 id="h2">Добавление бренда</h2>
            <label className={styles.modal_body_label}>
              <p>Название</p>
              <input
                autoFocus
                type="text"
                value={creating.value}
                onChange={e => setCreating({ ...creating, value: e.target.value })}
                placeholder={`Название бренда`}
              />
            </label>
            <section className={styles.modal_body_label}>
              <p>Описание</p>
              <FeatureEditor value={description} onChange={value => setDescription(value)} />
            </section>
            <label className={`${styles.modal_body_label}`}>
              <p>Логотип (размеп 1:1)</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  if (e.target.files) {
                    const file = e.target.files[0]
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setCreating(
                        !creating
                          ? null
                          : {
                              ...creating,
                              meta: { ...creating.meta, imageUrl: reader.result as string },
                            }
                      )
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />

              <section className=" bg-[#F2F3F5] flex w-[185px] h-[185px] rounded-[12px] align-center justify-center flex-col gap-[10px] cursor-pointer">
                {creating.meta.imageUrl && (
                  <img
                    className="w-full h-full object-cover rounded-[12px]"
                    src={creating.meta.imageUrl}
                    alt={creating.value}
                  />
                )}
                {!creating.meta.imageUrl && (
                  <>
                    <AiOutlinePicture className="flex align-center mx-[auto]" />
                    <p className="mx-[auto]">Нажми, чтобы загрузить</p>
                  </>
                )}
              </section>
            </label>
            <label className={styles.modal_body_label}>
              <p>Ссылка на бренд</p>
              <input
                type="text"
                value={creating.meta.seoSlug}
                onChange={e =>
                  setCreating(
                    !creating
                      ? null
                      : { ...creating, meta: { ...creating.meta, seoSlug: e.target.value } }
                  )
                }
                placeholder={`Ссылка`}
              />
            </label>
            <label className={styles.modal_body_label}>
              <p>Мета заголовок</p>
              <input
                type="text"
                value={creating.meta.metaTitle}
                onChange={e =>
                  setCreating(
                    !creating
                      ? null
                      : { ...creating, meta: { ...creating.meta, metaTitle: e.target.value } }
                  )
                }
                placeholder={`Мета заголовок`}
              />
            </label>
            <label className={styles.modal_body_label}>
              <p>Мета описание</p>
              <textarea
                value={creating.meta.metaDescription}
                onChange={e =>
                  setCreating(
                    !creating
                      ? null
                      : { ...creating, meta: { ...creating.meta, metaDescription: e.target.value } }
                  )
                }
                placeholder={`Мета описание`}
              />
            </label>

            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setCreating(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Сохранить
              </button>
            </section>
          </form>
        </div>
      )}

      {editing && (
        <div className={`${styles.modal} flex p-[10px] `}>
          <form onSubmit={e => handleUpdate(e)} className={styles.modal_body}>
            <h2 id="h2">Редактирование бренда</h2>
            <label className={styles.modal_body_label}>
              <p>Название</p>
              <input
                autoFocus
                type="text"
                value={editing.value}
                onChange={e => setEditing({ ...editing, value: e.target.value })}
                placeholder={`Название бренда`}
              />
            </label>
            <section className={styles.modal_body_label}>
              <p>Описание</p>
              <FeatureEditor value={description} onChange={value => setDescription(value)} />
            </section>
            <label className={`${styles.modal_body_label}`}>
              <p>Логотип (размеп 1:1)</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  if (e.target.files) {
                    const file = e.target.files[0]
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setEditing({
                        ...editing,
                        meta: {
                          ...editing.meta,
                          imageUrl: reader.result as string,
                        },
                      })
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />

              <section className=" bg-[#F2F3F5] flex w-[185px] h-[185px] rounded-[12px] align-center justify-center flex-col gap-[10px] cursor-pointer">
                {editing.meta.imageUrl && (
                  <img
                    className="w-full h-full object-cover rounded-[12px]"
                    src={editing.meta.imageUrl}
                    alt={editing.value}
                  />
                )}
                {!editing.meta.imageUrl && (
                  <>
                    <AiOutlinePicture className="flex align-center mx-[auto]" />
                    <p className="mx-[auto]">Нажми, чтобы загрузить</p>
                  </>
                )}
              </section>
            </label>
            <label className={styles.modal_body_label}>
              <p>Ссылка на бренд</p>
              <input
                type="text"
                value={editing.meta.seoSlug}
                onChange={e =>
                  setEditing({ ...editing, meta: { ...editing.meta, seoSlug: e.target.value } })
                }
                placeholder={`Ссылка`}
              />
            </label>
            <label className={styles.modal_body_label}>
              <p>Мета заголовок</p>
              <input
                type="text"
                value={editing.meta.metaTitle}
                onChange={e =>
                  setEditing({ ...editing, meta: { ...editing.meta, metaTitle: e.target.value } })
                }
                placeholder={`Мета заголовок`}
              />
            </label>
            <label className={styles.modal_body_label}>
              <p>Мета описание</p>
              <textarea
                value={editing.meta.metaDescription}
                onChange={e =>
                  setEditing({
                    ...editing,
                    meta: { ...editing.meta, metaDescription: e.target.value },
                  })
                }
                placeholder={`Мета описание`}
              />
            </label>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Сохранить
              </button>
            </section>
          </form>
        </div>
      )}

      {deleting && (
        <div className={`${styles.modal} flex`}>
          <form onSubmit={e => handleDelete(e)} className={styles.modal_body}>
            <h2 id="h2">Вы точно хотите удалить бренд {deleting.value}?</h2>
            <section className="flex gap-[10px] mt-[20px] ml-auto">
              <button
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
                onClick={() => setDeleting(null)}
                type="button"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Удалить
              </button>
            </section>
          </form>
        </div>
      )}
    </>
  )
}

// colors

interface Color {
  id?: number
  value: string
  meta: {
    colorCode: string
    aliases: string[]
  }
}

export const Colors = ({ id }: { id: number }) => {
  const [items, setItems] = useState<null | { name: string; id: number; values: Color[] }>(null)
  const [deleting, setDeleting] = useState<null | Color>(null)
  const [creating, setCreating] = useState<null | Color>(null)
  const [editing, setEditing] = useState<null | Color>(null)
  const [adding, setAdding] = useState<null | string>(null)

  const refresh = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        //отсортируй по алфавиту
        const sortedValues = res.data.values.sort((a: any, b: any) =>
          a.value.localeCompare(b.value)
        )
        setItems({
          ...res.data,
          values: sortedValues,
        })
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }

  useEffect(() => refresh(), [])

  const handleDelete = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/values/${deleting?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        refresh()
        toast.success('Успешно удалено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setDeleting(null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (creating?.value.trim() === '') {
      toast.error('Название группы не может быть пустым')
      return
    }
    if (creating?.meta.aliases.length === 0) {
      toast.error('Добавьте хотя бы один вариант атрибута')
      return
    }
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}/values`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        value: creating?.value,
        meta: creating?.meta,
      },
    })
      .then(() => {
        refresh()
        toast.success('Успешно добавлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setCreating(null)
  }

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault()

    if (editing?.value.trim() === '') {
      toast.error('Название группы не может быть пустым')
      return
    }
    if (editing?.meta.aliases.length === 0) {
      toast.error('Добавьте хотя бы один вариант атрибута')
      return
    }
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/values/${editing?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        value: editing?.value,
        meta: editing?.meta,
      },
    })
      .then(() => {
        refresh()
        toast.success('Успешно обновлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setEditing(null)
  }

  return (
    <>
      <button
        className="ml-auto"
        id="admin-button"
        onClick={() =>
          setCreating({
            value: '',
            meta: {
              colorCode: '#000000',
              aliases: [],
            },
          })
        }
      >
        Добавить группу цветов
      </button>
      <div className={styles.colors}>
        <div className={styles.colorAtributes_list}>
          <div className={styles.colorAtributes_list_top}>
            <p>Название</p>
            <p>Цветовое обозначение</p>
            <p>Количество цветов в группе</p>
          </div>
          {items?.values?.map((item, index) => (
            <div key={index} className={styles.colorAtributes_list_item}>
              <label>{item.value}</label>
              <label className="flex items-center gap-[10px]">
                <div
                  style={{ backgroundColor: item.meta.colorCode }}
                  className="w-[30px] h-[30px] rounded-[50%] border-[1px] border-solid border-[var(--admin-light-gray)]"
                ></div>
              </label>
              <label>{item.meta.aliases?.length || 0}</label>
              <section>
                <button onClick={() => setDeleting(item)}>
                  <LuTrash2 />
                </button>
                <button onClick={() => setEditing(item)}>
                  <LuPencil />
                </button>
              </section>
            </div>
          ))}
          <div style={{ transform: 'rotate(180deg)' }} className={styles.colorAtributes_list_top}>
            <p>&nbsp;</p>
            <p></p>
            <p></p>
          </div>
        </div>

        {creating && (
          <div className={`${styles.modal} flex`}>
            <form onSubmit={handleSubmit} className={styles.modal_body}>
              <h2 id="h2">Добавление группы цветов</h2>
              <label className={styles.modal_body_label}>
                <p>Название</p>
                <input
                  autoFocus
                  type="text"
                  value={creating.value}
                  onChange={e => setCreating({ ...creating, value: e.target.value })}
                  placeholder={`Название группы цветов`}
                />
              </label>
              <label className={`${styles.modal_body_label} relative`}>
                <p>Цветовое обозначение</p>
                <input
                  className="w-[100px]"
                  style={{ width: '100px' }}
                  value={creating.meta.colorCode}
                  onChange={e =>
                    setCreating(
                      !creating
                        ? null
                        : { ...creating, meta: { ...creating.meta, colorCode: e.target.value } }
                    )
                  }
                />{' '}
                <div
                  style={{ backgroundColor: creating.meta.colorCode }}
                  className="w-[40px] h-[40px] rounded-[50%] border-[1px] border-solid border-[var(--admin-light-gray)] absolute left-[110px] bottom-[0px]"
                ></div>
              </label>

              <div className={`${styles.modal_body_label} max-h-[400px] overflow-y-auto`}>
                <p>Варианты атрибутов</p>
                {creating.meta.aliases.length > 0 ? (
                  <div className="flex flex-wrap gap-[10px] mb-[10px]">
                    {creating.meta.aliases.map((alias, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-[5px] bg-[#F2F3F5] w-fit h-[40px] px-[16px] rounded-[12px]"
                      >
                        <span>{alias}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setCreating(
                              !creating
                                ? null
                                : {
                                    ...creating,
                                    meta: {
                                      ...creating.meta,
                                      aliases: creating.meta.aliases.filter((_, i) => i !== index),
                                    },
                                  }
                            )
                          }
                          className="flex items-center justify-center"
                        >
                          <AiOutlineClose />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--dark-gray)' }} id="p2">
                    Варианты не добавлены
                  </p>
                )}
                {adding != null ? (
                  <section className="flex items-center gap-[10px] mb-[10px]">
                    <input
                      autoFocus
                      value={adding}
                      onChange={e => setAdding(e.target.value)}
                      type="text"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (adding.trim() === '') {
                            toast.error('Название варианта не может быть пустым')
                            return
                          }
                          if (creating?.meta.aliases.includes(adding.trim())) {
                            toast.error('Такой вариант уже существует')
                            return
                          }
                          setCreating(
                            !creating
                              ? null
                              : {
                                  ...creating,
                                  meta: {
                                    ...creating.meta,
                                    aliases: [...creating.meta.aliases, adding.trim()],
                                  },
                                }
                          )
                          setAdding(null)
                          setAdding('')
                        }
                      }}
                      style={{ width: '150px' }}
                    />
                    <button
                      onClick={() => {
                        if (adding.trim() === '') {
                          toast.error('Название варианта не может быть пустым')
                          return
                        }
                        if (creating?.meta.aliases.includes(adding.trim())) {
                          toast.error('Такой вариант уже существует')
                          return
                        }
                        setCreating(
                          !creating
                            ? null
                            : {
                                ...creating,
                                meta: {
                                  ...creating.meta,
                                  aliases: [...creating.meta.aliases, adding.trim()],
                                },
                              }
                        )
                        setAdding(null)
                      }}
                      type="button"
                      className="text-[#449A41] w-[56px] h-[40px] flex items-center justify-center rounded-[12px] border-[1px] bg-[#CDFFCD] border-solid border-[#449A41] gap-[5px]"
                    >
                      <FaCheck />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdding(null)}
                      className="text-[#D23F31] w-[56px] h-[40px] flex items-center justify-center rounded-[12px] border-[1px] bg-[#FFD2CF] border-solid border-[#D23F31] gap-[5px]"
                    >
                      <AiOutlineClose />
                    </button>
                  </section>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAdding('')}
                    className="mb-[10px] flex items-center gap-[5px] text-[var(--admin-blue)] p-[7px] px-[10px] rounded-[12px] border-[1px] border-solid border-[#bdbfc7] w-fit"
                  >
                    <AiOutlinePlus />
                    Добавить вариант
                  </button>
                )}
              </div>

              <section className="ml-auto flex gap-[10px] mt-[20px]">
                <button
                  type="button"
                  onClick={() => setCreating(null)}
                  className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
                >
                  Отмена
                </button>
                <button id="admin-button" type="submit">
                  Сохранить
                </button>
              </section>
            </form>
          </div>
        )}
        {editing && (
          <div className={`${styles.modal} flex`}>
            <form onSubmit={handleUpdate} className={styles.modal_body}>
              <h2 id="h2">Редактирование группы цветов</h2>
              <label className={styles.modal_body_label}>
                <p>Название</p>
                <input
                  autoFocus
                  type="text"
                  value={editing.value}
                  onChange={e => setEditing({ ...editing, value: e.target.value })}
                  placeholder={`Название группы цветов`}
                />
              </label>
              <label className={`${styles.modal_body_label} relative`}>
                <p>Цветовое обозначение</p>
                <input
                  className="w-[100px]"
                  style={{ width: '100px' }}
                  value={editing.meta.colorCode}
                  onChange={e =>
                    setEditing(
                      !editing
                        ? null
                        : { ...editing, meta: { ...editing.meta, colorCode: e.target.value } }
                    )
                  }
                />{' '}
                <div
                  style={{ backgroundColor: editing.meta.colorCode }}
                  className="w-[40px] h-[40px] rounded-[50%] border-[1px] border-solid border-[var(--admin-light-gray)] absolute left-[110px] bottom-[0px]"
                ></div>
              </label>

              <div className={`${styles.modal_body_label} max-h-[400px] overflow-y-auto`}>
                <p>Варианты атрибутов</p>
                {editing.meta.aliases?.length > 0 ? (
                  <div className="flex flex-wrap gap-[10px] mb-[10px]">
                    {editing.meta.aliases.map((alias, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-[5px] bg-[#F2F3F5] w-fit h-[40px] px-[16px] rounded-[12px]"
                      >
                        <span>{alias}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditing(
                              !editing
                                ? null
                                : {
                                    ...editing,
                                    meta: {
                                      ...editing.meta,
                                      aliases: editing.meta.aliases.filter((_, i) => i !== index),
                                    },
                                  }
                            )
                          }
                          className="flex items-center justify-center"
                        >
                          <AiOutlineClose />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--dark-gray)' }} id="p2">
                    Варианты не добавлены
                  </p>
                )}
                {adding != null ? (
                  <section className="flex items-center gap-[10px] mb-[10px]">
                    <input
                      autoFocus
                      value={adding}
                      onChange={e => setAdding(e.target.value)}
                      type="text"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (adding.trim() === '') {
                            toast.error('Название варианта не может быть пустым')
                            return
                          }
                          if (creating?.meta.aliases.includes(adding.trim())) {
                            toast.error('Такой вариант уже существует')
                            return
                          }
                          setCreating(
                            !creating
                              ? null
                              : {
                                  ...creating,
                                  meta: {
                                    ...creating.meta,
                                    aliases: [...creating.meta.aliases, adding.trim()],
                                  },
                                }
                          )
                          setAdding(null)
                          setAdding('')
                        }
                      }}
                      style={{ width: '150px' }}
                    />
                    <button
                      onClick={() => {
                        if (adding.trim() === '') {
                          toast.error('Название варианта не может быть пустым')
                          return
                        }
                        if (editing?.meta.aliases?.includes(adding.trim())) {
                          toast.error('Такой вариант уже существует')
                          return
                        }
                        setEditing(
                          !editing
                            ? null
                            : {
                                ...editing,
                                meta: {
                                  ...editing.meta,
                                  aliases: [...editing.meta.aliases, adding.trim()],
                                },
                              }
                        )
                        setAdding(null)
                      }}
                      type="button"
                      className="text-[#449A41] w-[56px] h-[40px] flex items-center justify-center rounded-[12px] border-[1px] bg-[#CDFFCD] border-solid border-[#449A41] gap-[5px]"
                    >
                      <FaCheck />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdding(null)}
                      className="text-[#D23F31] w-[56px] h-[40px] flex items-center justify-center rounded-[12px] border-[1px] bg-[#FFD2CF] border-solid border-[#D23F31] gap-[5px]"
                    >
                      <AiOutlineClose />
                    </button>
                  </section>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAdding('')}
                    className="mb-[10px] flex items-center gap-[5px] text-[var(--admin-blue)] p-[7px] px-[10px] rounded-[12px] border-[1px] border-solid border-[#bdbfc7] w-fit"
                  >
                    <AiOutlinePlus />
                    Добавить вариант
                  </button>
                )}
              </div>

              <section className="ml-auto flex gap-[10px] mt-[20px]">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
                >
                  Отмена
                </button>
                <button id="admin-button" type="submit">
                  Сохранить
                </button>
              </section>
            </form>
          </div>
        )}
        {deleting && (
          <div className={`${styles.modal} flex`}>
            <form onSubmit={handleDelete} className={styles.modal_body}>
              <h2 id="h2">Вы точно хотите удалить группу цветов {deleting.value}?</h2>
              <section className="flex gap-[10px] mt-[20px] ml-auto">
                <button
                  className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
                  onClick={() => setDeleting(null)}
                  type="button"
                >
                  Отмена
                </button>
                <button id="admin-button" type="submit">
                  Удалить
                </button>
              </section>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

// sizes

interface SizeTable {
  id?: number
  brand: { id: number; value: string }
  gender: { id: number; value: string }
  type: { id: number; value: string }
  rows: SizeTableRow[]
}

interface SizeTableRow {
  id?: number
  tableId?: number
  sizeValueId: number
  orderNum: number
  sizeValue: { id?: number; typeId?: number; name: string; orderNum?: number }
  chest: number
  waist: number
  hips: number
  height: number
}

interface SizeType {
  id?: number
  name: string
  values: SizeTypeValue[]
}

interface SizeTypeValue {
  id?: number
  typeId?: number
  name: string
  orderNum?: number
}

export const Sizes = () => {
  const [active, setActive] = useState('Виды размеров')

  return (
    <>
      <div className={styles.atributes_top}>
        <div className={styles.atributes_menu_sizes}>
          <div
            onClick={() => setActive('Виды размеров')}
            className={`${styles.atributes_menu_item} ${active == 'Виды размеров' ? styles.atributes_menu_item_active : ''}`}
          >
            Виды размеров
          </div>{' '}
          <div
            onClick={() => setActive('Таблица размеров')}
            className={`${styles.atributes_menu_item} ${active == 'Таблица размеров' ? styles.atributes_menu_item_active : ''}`}
          >
            Таблица размеров
          </div>
        </div>
      </div>
      {active == 'Виды размеров' && <SizeTypes />}
      {active == 'Таблица размеров' && <SizeTables />}

      {/* {active == 'Таблица размеров' && <SizeCharts />} */}
    </>
  )
}

const SizeTypes = () => {
  const [items, setItems] = useState<null | SizeType[]>(null)
  const [deleting, setDeleting] = useState<null | { id: number; name: string }>(null)
  const [creating, setCreating] = useState<null | SizeType>(null)
  const [editing, setEditing] = useState<null | SizeType>(null)
  const [adding, setAdding] = useState<null | { name: string; orderNum: number }>(null)

  ///api/sizes/types

  const refresh = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/sizes/types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        //отсортируй по алфавиту

        setItems(res.data)
      })
      .catch(err => {
        const errorText = err?.response?.data?.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }

  useEffect(() => refresh(), [])

  const handleDelete = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/sizes/types/${deleting?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        refresh()
        toast.success('Успешно удалено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setDeleting(null)
  }

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()

    if (!creating) return toast.error('Нету данных для создания')

    if (creating.name.trim() === '') {
      toast.error('Название вида размера не может быть пустым')
      return
    }
    if (creating.values.length === 0) {
      toast.error('Добавьте хотя бы одно значение')
      return
    }
    axios(`${import.meta.env.VITE_APP_API_URL}/sizes/types`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: { name: creating.name, sizes: creating.values },
    })
      .then(() => {
        refresh()
        toast.success('Успешно добавлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setCreating(null)
  }

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault()
    if (!editing) return toast.error('Нету данных для редактирования')
    //редактировать
    if (editing.name.trim() === '') {
      toast.error('Название вида размера не может быть пустым')
      return
    }
    if (editing.values.length === 0) {
      toast.error('Добавьте хотя бы одно значение')
      return
    }
    axios(`${import.meta.env.VITE_APP_API_URL}/sizes/types/${editing.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: { name: editing.name, sizes: editing.values, id: editing.id },
    })
      .then(() => {
        refresh()
        toast.success('Успешно обновлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setEditing(null)
  }

  return (
    <>
      <button
        className="ml-auto"
        id="admin-button"
        onClick={() =>
          setCreating({
            name: '',
            values: [],
          })
        }
      >
        Добавить вид размера
      </button>
      <div className={styles.sizeTypes}>
        <div className={styles.sizeTypes_list}>
          <div className={styles.sizeTypes_list_top}>
            <p>Название</p>
            <p>Значения</p>
          </div>
          {items?.map((item, index) => (
            <div key={index} className={styles.sizeTypes_list_item}>
              <label>{item.name}</label>
              <label className="flex items-center gap-[10px]">
                <div className="flex flex-wrap gap-[10px]">
                  {item.values.map((value, idx) => (
                    <span key={idx}>{value.name}</span>
                  ))}
                </div>
              </label>
              <section>
                <button onClick={() => setDeleting({ id: item.id!, name: item.name })}>
                  <LuTrash2 />
                </button>
                <button onClick={() => setEditing(item)}>
                  <LuPencil />
                </button>
              </section>
            </div>
          ))}
          <div style={{ transform: 'rotate(180deg)' }} className={styles.colorAtributes_list_top}>
            <p>&nbsp;</p>
            <p></p>
          </div>
        </div>
      </div>
      {deleting && (
        <div className={`${styles.modal} flex`}>
          <form onSubmit={e => handleDelete(e)} className={styles.modal_body}>
            <h2 id="h2">Вы точно хотите удалить вид размера {deleting.name}?</h2>
            <section className="flex gap-[10px] mt-[20px] ml-auto">
              <button
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
                onClick={() => setDeleting(null)}
                type="button"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Удалить
              </button>
            </section>
          </form>
        </div>
      )}
      {creating && (
        <div className={`${styles.modal} flex p-[10px] `}>
          <form onSubmit={handleCreate} className={styles.modal_body}>
            <h2 id="h2">Добавление вида размера</h2>
            <label className={styles.modal_body_label}>
              <p>Название</p>
              <input
                autoFocus
                type="text"
                value={creating.name}
                onChange={e => setCreating({ ...creating, name: e.target.value })}
                placeholder={`Название вида размера`}
              />
            </label>

            <div className={`${styles.modal_body_label} max-h-[400px] overflow-y-auto`}>
              <p>Размеры</p>
              {creating.values.length > 0 ? (
                <div className="flex flex-wrap gap-[10px] mb-[10px]">
                  {creating.values.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-[5px] bg-[#F2F3F5] w-fit h-[40px] px-[16px] rounded-[12px]"
                    >
                      <span>{value.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setCreating(
                            !creating
                              ? null
                              : {
                                  ...creating,
                                  values: creating.values.filter((_, i) => i !== index),
                                }
                          )
                        }
                        className="flex items-center justify-center"
                      >
                        <AiOutlineClose />
                      </button>
                    </div>
                  ))}
                </div>
              ) : adding != null ? null : (
                <p style={{ color: 'var(--dark-gray)' }} id="p2">
                  Значения не добавлены
                </p>
              )}
              {adding != null ? (
                <section className="flex items-center gap-[10px] mb-[10px] border-[#BDBFC7] border-solid border-[1px] p-[32px] rounded-[12px]">
                  <div
                    onSubmit={e => e.preventDefault()}
                    className="gap-[24px] flex flex-col w-full"
                  >
                    <h3>Добавление размера</h3>
                    <div className=" grid grid-cols-2 w-100 flex-row gap-[24px]">
                      <label>
                        <p>Название</p>
                        <input
                          autoFocus
                          value={adding.name}
                          onChange={e => setAdding({ ...adding, name: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (adding?.name?.trim() === '') {
                                toast.error('Название варианта не может быть пустым')
                                return
                              }
                              if (creating?.values.find(i => i.name === adding.name.trim())) {
                                toast.error('Такой вариант уже существует')
                                return
                              }
                              setCreating(
                                !creating
                                  ? null
                                  : {
                                      ...creating,
                                      values: [
                                        ...creating.values,
                                        {
                                          name: adding.name.trim(),
                                          orderNum: adding.orderNum,
                                        },
                                      ],
                                    }
                              )
                              const temp = adding.orderNum
                              setAdding(null)
                              setAdding({ name: '', orderNum: temp + 1 })
                            }
                          }}
                          type="text"
                        />
                      </label>
                      <label>
                        <p>Сортировочное значение</p>
                        <input
                          value={adding.orderNum}
                          onChange={e => setAdding({ ...adding, orderNum: Number(e.target.value) })}
                          type="text"
                        />
                      </label>
                    </div>
                    <div className="flex gap-[10px] ml-auto">
                      <button
                        type="button"
                        onClick={() => setAdding(null)}
                        className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={() => {
                          if (adding?.name?.trim() === '') {
                            toast.error('Название варианта не может быть пустым')
                            return
                          }
                          if (creating?.values.find(i => i.name === adding.name.trim())) {
                            toast.error('Такой вариант уже существует')
                            return
                          }
                          setCreating(
                            !creating
                              ? null
                              : {
                                  ...creating,
                                  values: [
                                    ...creating.values,
                                    {
                                      name: adding.name.trim(),
                                      orderNum: adding.orderNum,
                                    },
                                  ],
                                }
                          )
                          const temp = adding.orderNum
                          setAdding(null)
                          setAdding({ name: '', orderNum: temp + 1 })
                        }}
                        type="button"
                        id="admin-button"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>
                </section>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding({ name: '', orderNum: creating.values.length + 1 })}
                  className="mb-[10px] flex items-center gap-[5px] p-[7px] px-[10px] rounded-[12px] border-[1px] border-solid text-[#bdbfc7] border-[#bdbfc7] w-[56px] h-[40px] justify-center text-[22px]"
                >
                  <AiOutlinePlus />
                </button>
              )}
            </div>

            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setCreating(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Сохранить
              </button>
            </section>
          </form>
        </div>
      )}
      {editing && (
        <div className={`${styles.modal} flex p-[10px] `}>
          <form onSubmit={handleUpdate} className={styles.modal_body}>
            <h2 id="h2">Редактирование вида размера</h2>
            <label className={styles.modal_body_label}>
              <p>Название</p>
              <input
                autoFocus
                type="text"
                value={editing.name}
                onChange={e => setEditing({ ...editing, name: e.target.value })}
                placeholder={`Название вида размера`}
              />
            </label>

            <div className={`${styles.modal_body_label} max-h-[400px] overflow-y-auto`}>
              <p>Размеры</p>
              {editing.values.length > 0 ? (
                <div className="flex flex-wrap gap-[10px] mb-[10px]">
                  {editing.values.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-[5px] bg-[#F2F3F5] w-fit h-[40px] px-[16px] rounded-[12px]"
                    >
                      <span>{value.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditing(
                            !editing
                              ? null
                              : {
                                  ...editing,
                                  values: editing.values.filter((_, i) => i !== index),
                                }
                          )
                        }
                        className="flex items-center justify-center"
                      >
                        <AiOutlineClose />
                      </button>
                    </div>
                  ))}
                </div>
              ) : adding != null ? null : (
                <p style={{ color: 'var(--dark-gray)' }} id="p2">
                  Значения не добавлены
                </p>
              )}
              {adding != null ? (
                <section className="flex items-center gap-[10px] mb-[10px] border-[#BDBFC7] border-solid border-[1px] p-[32px] rounded-[12px]">
                  <div
                    onSubmit={e => e.preventDefault()}
                    className="gap-[24px] flex flex-col w-full"
                  >
                    <h3>Добавление размера</h3>
                    <div className=" grid grid-cols-2 w-100 flex-row gap-[24px]">
                      <label>
                        <p>Название</p>
                        <input
                          autoFocus
                          value={adding.name}
                          type="text"
                          onChange={e => setAdding({ ...adding, name: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (adding?.name?.trim() === '') {
                                toast.error('Название варианта не может быть пустым')
                                return
                              }
                              if (editing?.values.find(i => i.name === adding.name.trim())) {
                                toast.error('Такой вариант уже существует')
                                return
                              }
                              setEditing(
                                !editing
                                  ? null
                                  : {
                                      ...editing,
                                      values: [
                                        ...editing.values,
                                        {
                                          name: adding.name.trim(),
                                          orderNum: adding.orderNum,
                                        },
                                      ],
                                    }
                              )
                              const temp = adding.orderNum
                              setAdding(null)
                              setAdding({ name: '', orderNum: temp + 1 })
                            }
                          }}
                        />
                      </label>
                      <label>
                        <p>Сортировочное значение</p>
                        <input
                          value={adding.orderNum}
                          onChange={e => setAdding({ ...adding, orderNum: Number(e.target.value) })}
                          type="text"
                        />
                      </label>
                    </div>
                    <div className="flex gap-[10px] ml-auto">
                      <button
                        type="button"
                        onClick={() => setAdding(null)}
                        className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={() => {
                          if (adding?.name?.trim() === '') {
                            toast.error('Название варианта не может быть пустым')
                            return
                          }
                          if (editing?.values.find(i => i.name === adding.name.trim())) {
                            toast.error('Такой вариант уже существует')
                            return
                          }
                          setEditing(
                            !editing
                              ? null
                              : {
                                  ...editing,
                                  values: [
                                    ...editing.values,
                                    {
                                      name: adding.name.trim(),
                                      orderNum: adding.orderNum,
                                    },
                                  ],
                                }
                          )
                          const temp = adding.orderNum
                          setAdding(null)
                          setAdding({ name: '', orderNum: temp + 1 })
                        }}
                        type="button"
                        id="admin-button"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>
                </section>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding({ name: '', orderNum: editing.values.length + 1 })}
                  className="mb-[10px] flex items-center gap-[5px] p-[7px] px-[10px] rounded-[12px] border-[1px] border-solid text-[#bdbfc7] border-[#bdbfc7] w-[56px] h-[40px] justify-center text-[22px]"
                >
                  <AiOutlinePlus />
                </button>
              )}
            </div>

            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Сохранить
              </button>
            </section>
          </form>
        </div>
      )}
    </>
  )
}

const SizeTables = () => {
  const [items, setItems] = useState<null | SizeTable[]>(null)
  const [editing, setEditing] = useState<null | SizeTable>(null)
  const [creating, setCreating] = useState<null | SizeTable>(null)
  const [deleting, setDeleting] = useState<null | SizeTable>(null)
  const [brands, setBrands] = useState<null | Brand[]>(null)
  const [genders, setGenders] = useState<null | Genders[]>(null)
  const [sizeTypes, setSizeTypes] = useState<null | SizeType[]>(null)

  const refresh = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/sizes/tables`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        setItems(res.data)
      })
      .catch(err => {
        const errorText = err?.response?.data?.message || 'Ошибка получения данных'
        toast.error(errorText)
      })

    axios(`${import.meta.env.VITE_APP_API_URL}/sizes/types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        setSizeTypes(res.data)
      })
      .catch(err => {
        const errorText = err?.response?.data?.message || 'Ошибка получения данных'
        toast.error(errorText)
      })

    axios(`${import.meta.env.VITE_APP_API_URL}/attributes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        const genders = res.data.find((i: { id: number }) => i.id === 3)
        const brands = res.data.find((i: { id: number }) => i.id === 4)
        setGenders(genders.values)
        setBrands(brands.values)
      })
      .catch(err => {
        const errorText = err?.response?.data?.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }

  useEffect(() => refresh(), [])
  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    if (!creating) return toast.error('Нету данных для создания')
    if (creating.brand.id === 0) {
      toast.error('Выберите бренд')
      return
    }
    if (creating.gender.id === 0) {
      toast.error('Выберите пол')
      return
    }
    if (creating.type.id === 0) {
      toast.error('Выберите вид размера')
      return
    }
    if (creating.rows.length === 0) {
      toast.error('Добавьте хотя бы один размер')
      return
    }
    axios(`${import.meta.env.VITE_APP_API_URL}/sizes/tables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        brandId: creating.brand.id,
        genderId: creating.gender.id,
        typeId: creating.type.id,
        rows: creating.rows.map(i => ({
          sizeValueId: i.sizeValueId,
          chest: i.chest,
          waist: i.waist,
          hips: i.hips,
          height: i.height,
          orderNum: i.orderNum,
        })),
      },
    })
      .then(() => {
        refresh()
        toast.success('Успешно добавлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setCreating(null)
  }

  const handleDelete = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/sizes/tables/${deleting?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        refresh()
        toast.success('Успешно удалено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setDeleting(null)
  }
  const handleUpdate = (e: FormEvent) => {
    e.preventDefault()
    if (!editing) return toast.error('Нету данных для редактирования')
    if (editing.brand.id === 0) {
      toast.error('Выберите бренд')
      return
    }

    if (editing.gender.id === 0) {
      toast.error('Выберите пол')
      return
    }
    if (editing.type.id === 0) {
      toast.error('Выберите вид размера')
      return
    }
    if (editing.rows.length === 0) {
      toast.error('Добавьте хотя бы один размер')
      return
    }
    axios(`${import.meta.env.VITE_APP_API_URL}/sizes/tables/${editing.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        id: editing.id,
        brandId: editing.brand.id,
        genderId: editing.gender.id,
        typeId: editing.type.id,
        rows: editing.rows.map(i => ({
          id: i.id,
          sizeValueId: i.sizeValueId,
          chest: i.chest,
          waist: i.waist,
          hips: i.hips,
          height: i.height,
          orderNum: i.orderNum,
        })),
      },
    })
      .then(() => {
        refresh()
        toast.success('Успешно обновлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setEditing(null)
  }

  return (
    <>
      <button
        onClick={() =>
          setCreating({
            brand: { id: 0, value: '' },
            gender: { id: 0, value: '' },
            type: { id: 0, value: '' },
            rows: [],
          })
        }
        className="ml-auto"
        id="admin-button"
      >
        Добавить таблицу размеров
      </button>

      <div className={styles.sizeTypes}>
        <div className={styles.seasonAtributes_list}>
          <div className={styles.seasonAtributes_list_top}>
            <p>Название таблицы</p>
            <p>Пол</p>
          </div>
          {items?.map((item, index) => (
            <div key={index} className={styles.seasonAtributes_list_item}>
              <label>{item.brand.value}</label>
              <label> {item.gender.value}</label>
              <section>
                <button onClick={() => setDeleting(item)}>
                  <LuTrash2 />
                </button>
                <button onClick={() => setEditing(item)}>
                  <LuPencil />
                </button>
              </section>
            </div>
          ))}
        </div>
      </div>
      {creating && (
        <div className={`${styles.modal}`}>
          <form
            className={`w-[1100px] max-w-[1100px_!important]  ${styles.modal_body}`}
            onSubmit={e => e.preventDefault()}
          >
            <h2 id="h2">Добавление таблицы размеров</h2>
            <div className={`w-[370px] ${styles.modal_body_label}`}>
              <p>Название таблицы</p>
              <CustomSelect
                data={brands?.map(brand => ({ id: brand.id!, value: brand.value! })!) || []}
                value={creating.brand}
                placeholder="Бренд"
                onChange={id => {
                  setCreating({
                    ...creating,
                    brand: {
                      id: Number(id),
                      value: brands?.find(i => i.id === Number(id))?.value || '',
                    },
                  })
                }}
              />
            </div>
            <div className={`w-[370px] ${styles.modal_body_label}`}>
              <p>Пол</p>
              <CustomSelect
                value={creating.gender}
                onChange={id =>
                  setCreating({
                    ...creating,
                    gender: {
                      id: Number(id),
                      value: genders?.find(i => i.id === Number(id))?.value || '',
                    },
                  })
                }
                data={genders?.map(gender => ({ id: gender.id, value: gender.value })) || []}
                placeholder="Пол"
              />
            </div>
            <div className={`w-[370px] ${styles.modal_body_label}`}>
              <p>Вид размера</p>
              <CustomSelect
                value={creating.type}
                onChange={id => {
                  const size = sizeTypes?.find(i => i.id === Number(id))
                  setCreating({
                    ...creating,
                    type: {
                      id: Number(id),
                      value: size?.name || '',
                    },
                    rows: [
                      {
                        sizeValueId: size?.values[0].id || 0,
                        orderNum: 0,
                        sizeValue: size?.values[0] || { id: 0, typeId: 0, name: '', orderNum: 0 },
                        chest: 0,
                        waist: 0,
                        hips: 0,
                        height: 0,
                      },
                    ],
                  })
                }}
                data={sizeTypes?.map(type => ({ id: type.id!, value: type.name! })!) || []}
                placeholder="Вид размеров"
              ></CustomSelect>
            </div>
            {creating.type.id != 0 &&
              creating.brand.id != 0 &&
              creating.gender.id != 0 &&
              sizeTypes?.find(i => i.id === creating.type.id) && (
                <div className={`${styles.modal_body_label}`}>
                  <div className="flex items-center justify-between mb-[10px]">
                    <p>Общее колличество: {creating.rows.length}</p>
                    <button
                      onClick={() =>
                        setCreating(
                          !creating
                            ? null
                            : {
                                ...creating,
                                rows: [
                                  ...creating.rows,
                                  {
                                    sizeValueId: 0,
                                    orderNum: creating.rows.length + 1,
                                    sizeValue: { id: 0, typeId: 0, name: '', orderNum: 0 },
                                    chest: 0,
                                    waist: 0,
                                    hips: 0,
                                    height: 0,
                                  },
                                ],
                              }
                        )
                      }
                      type="button"
                      className="rounded-[12px] h-[40px] flex gap-[5px] items-center justify-center border-solid border-[1px] border-[#DADADA] p-[15px]"
                    >
                      <LuPlus /> Добавить строчку
                    </button>
                  </div>
                  <div className={styles.sizeTypes_list}>
                    <div
                      className={`pl-[10px] grid-cols-[140px_140px_140px_140px_140px_1fr_!important] gap-[10px] ${styles.sizeTypes_list_top}`}
                    >
                      <p>Размер</p>
                      <p>Рост</p>
                      <p>Обхват груди</p>
                      <p>Обхват талии</p>
                      <p>Обхват бедер</p>
                      <p></p>
                    </div>
                    {creating.rows.map((value, index) => (
                      <div
                        key={index}
                        className="grid p-[10px] grid-cols-[140px_140px_140px_140px_140px_1fr_!important] items-center gap-[10px] mb-[10px]"
                      >
                        <select
                          value={value.sizeValue.id}
                          onChange={e => {
                            if (e.target.value === '0') {
                              toast.error('Выберите размер')
                              return
                            }
                            const size = sizeTypes
                              ?.find(i => i.id === creating.type.id)
                              ?.values.find(i => i.id === Number(e.target.value))
                            setCreating({
                              ...creating,
                              rows: creating.rows.map((i, idx) =>
                                idx === index
                                  ? {
                                      ...i,
                                      sizeValueId: Number(e.target.value),
                                      sizeValue: size!,
                                    }
                                  : i
                              ),
                            })
                          }}
                        >
                          <option value={0}>Выберите размер</option>
                          {sizeTypes
                            ?.find(i => i.id === creating.type.id)
                            ?.values.filter(
                              size =>
                                !creating.rows
                                  .filter(r => r.sizeValue.id !== value.sizeValue.id) // исключаем текущий редактируемый элемент
                                  .map(r => r.sizeValue.id)
                                  .includes(size.id)
                            ) // фильтруем
                            .map((size, idx) => (
                              <option key={idx} value={size.id}>
                                {size.name}
                              </option>
                            ))}
                        </select>
                        <NumericFormat
                          value={value.height || ''}
                          onChange={(e: { target: { value: string } }) => {
                            const height = e.target.value === '' ? 0 : Number(e.target.value)
                            setCreating({
                              ...creating,
                              rows: creating.rows.map((i, idx) =>
                                idx === index ? { ...i, height } : i
                              ),
                            })
                          }}
                          placeholder="Рост"
                        />
                        <NumericFormat
                          value={value.chest || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const chest: number = e.target.value === '' ? 0 : Number(e.target.value)
                            setCreating({
                              ...creating,
                              rows: creating.rows.map((i, idx) =>
                                idx === index ? { ...i, chest } : i
                              ),
                            })
                          }}
                          placeholder="Обхват груди"
                        />

                        <NumericFormat
                          value={value.waist || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const waist = e.target.value === '' ? 0 : Number(e.target.value)
                            setCreating({
                              ...creating,
                              rows: creating.rows.map((i, idx) =>
                                idx === index ? { ...i, waist } : i
                              ),
                            })
                          }}
                          placeholder="Обхват талии"
                        />
                        <NumericFormat
                          value={value.hips || ''}
                          onChange={(e: { target: { value: string } }) => {
                            const hips = e.target.value === '' ? 0 : Number(e.target.value)
                            setCreating({
                              ...creating,
                              rows: creating.rows.map((i, idx) =>
                                idx === index ? { ...i, hips } : i
                              ),
                            })
                          }}
                          placeholder="Обхват бедер"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCreating(
                              !creating
                                ? null
                                : {
                                    ...creating,
                                    rows: creating.rows.filter((_, i) => i !== index),
                                  }
                            )
                          }
                          className="flex items-center justify-center text-[#E02844] ml-auto bg-[#FFF3F3] w-[36px] h-[36px] rounded-[12px]"
                        >
                          <LuTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setCreating(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit" onClick={handleCreate}>
                Сохранить
              </button>
            </section>
          </form>
        </div>
      )}
      {deleting && (
        <div className={`${styles.modal} flex p-[10px] `}>
          <form onSubmit={handleDelete} className={styles.modal_body}>
            <h2 id="h2">Удаление таблицы размеров</h2>
            <p id="p2">Вы уверены, что хотите удалить эту таблицу размеров?</p>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Удалить
              </button>
            </section>
          </form>
        </div>
      )}
      {editing && (
        <div className={`${styles.modal} `}>
          <form
            className={`max-w-[1100px_!important] w-[1100px] ${styles.modal_body}`}
            onSubmit={handleUpdate}
          >
            <h2 id="h2">Редактирование таблицы размеров</h2>
            <label className={`w-[370px] ${styles.modal_body_label}`}>
              <p>Название таблицы</p>
              <select
                autoFocus
                value={editing.brand.id}
                onChange={e =>
                  setEditing({
                    ...editing,
                    brand: {
                      id: Number(e.target.value),
                      value: brands?.find(i => i.id === Number(e.target.value))?.value || '',
                    },
                  })
                }
              >
                <option value={0}>Выберите бренд</option>
                {brands?.map((brand, index) => (
                  <option key={index} value={brand.id}>
                    {brand.value}
                  </option>
                ))}
              </select>
            </label>
            <label className={`w-[370px] ${styles.modal_body_label}`}>
              <p>Пол</p>
              <select
                value={editing.gender.id}
                onChange={e =>
                  setEditing({
                    ...editing,
                    gender: {
                      id: Number(e.target.value),
                      value: genders?.find(i => i.id === Number(e.target.value))?.value || '',
                    },
                  })
                }
              >
                <option value={0}>Выберите пол</option>
                {genders?.map((gender, index) => (
                  <option key={index} value={gender.id}>
                    {gender.value}
                  </option>
                ))}
              </select>
            </label>
            <label className={`w-[370px] ${styles.modal_body_label}`}>
              <p>Тип</p>
              <select
                value={editing.type.id}
                onChange={e =>
                  setEditing({
                    ...editing,
                    type: {
                      id: Number(e.target.value),
                      value: sizeTypes?.find(i => i.id === Number(e.target.value))?.name || '',
                    },
                  })
                }
              >
                <option value={0}>Выберите вид размера</option>
                {sizeTypes?.map((type, index) => (
                  <option key={index} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>
            <div className={`${styles.modal_body_label}`}>
              <div className="flex items-center justify-between mb-[10px]">
                <p>Общее колличество: {editing.rows.length}</p>
                <button
                  onClick={() => {
                    setEditing(
                      !editing
                        ? null
                        : {
                            ...editing,
                            rows: [
                              ...editing.rows,
                              {
                                sizeValueId: 0,
                                orderNum: editing.rows.length + 1,
                                sizeValue: {
                                  id: 0,
                                  typeId: 0,
                                  name: '',
                                  orderNum: 0,
                                },
                                chest: 0,
                                waist: 0,
                                hips: 0,
                                height: 0,
                              },
                            ],
                          }
                    )
                  }}
                  type="button"
                  className="rounded-[12px] h-[40px] flex gap-[5px] items-center justify-center border-solid border-[1px] border-[#DADADA] p-[15px]"
                >
                  <LuPlus /> Добавить строчку
                </button>
              </div>
              <div className={styles.sizeTypes_list}>
                <div
                  className={`pl-[10px] grid-cols-[140px_140px_140px_140px_140px_1fr_!important] gap-[10px] ${styles.sizeTypes_list_top}`}
                >
                  <p>Размер</p>
                  <p>Рост</p>
                  <p>Обхват груди</p>
                  <p>Обхват талии</p>
                  <p>Обхват бедер</p>
                  <p></p>
                </div>
                {editing.rows.map((row, index) => (
                  <div
                    key={index}
                    className="grid p-[10px] grid-cols-[140px_140px_140px_140px_140px_1fr_!important] items-center gap-[10px] mb-[10px]"
                  >
                    <select
                      value={row.sizeValue.id}
                      onChange={e => {
                        if (e.target.value === '0') {
                          toast.error('Выберите размер')
                          return
                        }
                        const size = sizeTypes
                          ?.find(i => i.id === editing.type.id)
                          ?.values.find(i => i.id === Number(e.target.value))
                        setEditing({
                          ...editing,
                          rows: editing.rows.map(i =>
                            i.sizeValueId === row.sizeValueId
                              ? {
                                  ...i,
                                  sizeValueId: Number(e.target.value),
                                  sizeValue: size!,
                                }
                              : i
                          ),
                        })
                      }}
                    >
                      <option value={0}>Выберите размер</option>

                      {sizeTypes
                        ?.find(i => i.id === editing.type.id)
                        ?.values.filter(
                          size =>
                            !editing.rows
                              .filter(r => r.sizeValue.id !== row.sizeValue.id) // исключаем текущий редактируемый элемент
                              .map(r => r.sizeValue.id)
                              .includes(size.id)
                        ) // фильтруем
                        .map((size, idx) => (
                          <option key={idx} value={size.id}>
                            {size.name}
                          </option>
                        ))}
                    </select>

                    <NumericFormat
                      value={row.height || ''}
                      onChange={(e: { target: { value: string } }) => {
                        const height = e.target.value === '' ? 0 : Number(e.target.value)
                        setEditing({
                          ...editing,
                          rows: editing.rows.map(i =>
                            i.sizeValueId === row.sizeValueId ? { ...i, height } : i
                          ),
                        })
                      }}
                      placeholder="Рост"
                    />
                    <NumericFormat
                      value={row.chest || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const chest: number = e.target.value === '' ? 0 : Number(e.target.value)
                        setEditing({
                          ...editing,
                          rows: editing.rows.map(i =>
                            i.sizeValueId === row.sizeValueId ? { ...i, chest } : i
                          ),
                        })
                      }}
                      placeholder="Обхват груди"
                    />
                    <NumericFormat
                      value={row.waist || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const waist = e.target.value === '' ? 0 : Number(e.target.value)
                        setEditing({
                          ...editing,
                          rows: editing.rows.map(i =>
                            i.sizeValueId === row.sizeValueId ? { ...i, waist } : i
                          ),
                        })
                      }}
                      placeholder="Обхват талии"
                    />
                    <NumericFormat
                      value={row.hips || ''}
                      onChange={(e: { target: { value: string } }) => {
                        const hips = e.target.value === '' ? 0 : Number(e.target.value)
                        setEditing({
                          ...editing,
                          rows: editing.rows.map(i =>
                            i.sizeValueId === row.sizeValueId ? { ...i, hips } : i
                          ),
                        })
                      }}
                      placeholder="Обхват бедер"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditing(
                          !editing
                            ? null
                            : {
                                ...editing,
                                rows: editing.rows.filter(i => i.sizeValueId !== row.sizeValueId),
                              }
                        )
                      }
                      className="flex items-center justify-center text-[#E02844] ml-auto bg-[#FFF3F3] w-[36px] h-[36px] rounded-[12px]"
                    >
                      <LuTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Сохранить
              </button>
            </section>
          </form>
        </div>
      )}
    </>
  )
}

// ---- Items ----
export interface CollectionItem {
  article: string
  id?: number
  name: string
  price: number
  gender: string
  season: string
  brands: [
    {
      collectionItemId: number
      id: number
      attributeValueId: number
      brand: {
        id: number
        value: string
      }
    },
  ]
}

// ---- Collections ----

interface Collection {
  id?: number
  name: string
  startDate: string
  endDate: string
  items?: CollectionItem[]
}

export const Collections = () => {
  const [items, setItems] = useState<null | Collection[]>(null)
  const [adding, setAdding] = useState<null | Collection>(null)
  const [deleting, setDeleting] = useState<null | Collection>(null)
  const [search, setSearch] = useState('')

  const refresh = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/collections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res: { data: Collection[] }) => {
        setItems(
          res.data.sort((a, b) => new Date(b?.endDate).getTime() - new Date(a?.endDate).getTime())
        )
      })
      .catch(err => {
        const errorText = err?.response?.data?.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }

  useEffect(() => refresh(), [])

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    if (!adding) return toast.error('Нету данных для создания')
    if (adding.name.trim() === '') {
      toast.error('Название не может быть пустым')
      return
    }
    if (items?.find(i => i.name === adding.name.trim())) {
      toast.error('Такая коллекция уже существует')
      return
    }
    axios(`${import.meta.env.VITE_APP_API_URL}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: { ...adding, brandIds: [] },
    })
      .then(() => {
        refresh()
        toast.success('Успешно добавлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setAdding(null)
  }

  const handleDelete = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/collections/${deleting?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        refresh()
        toast.success('Успешно удалено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setDeleting(null)
  }

  return (
    <>
      <div className="ml-auto flex gap-[10px] item-center mb-[20px]">
        <button
          onClick={() =>
            setAdding({
              name: '',
              startDate: new Date().toISOString().split('T')[0],
              endDate: '',
            })
          }
          className="ml-auto"
          id="admin-button"
        >
          Добавить коллекцию
        </button>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по названию"
          className="h-[40px] px-[15px] rounded-[12px] border-solid border-[1px] border-[#DADADA]"
        />
      </div>
      {items &&
        items.length > 0 &&
        items.map(item => {
          const brandIds = new Set<number>()

          if (item?.items) {
            for (const i of item.items) {
              for (const brand of i.brands) {
                if (!brandIds.has(brand.brand.id)) brandIds.add(brand.brand.id)
              }
            }
          }

          return (
            <Link
              to={`/admin/products/atributes/collections/${item.id}`}
              className={`${styles.atributes_list}`}
            >
              <h3>{item.name}</h3>
              <div className="flex items-start justify-between mt-[10px]">
                <div className="flex flex-col gap-[5px]">
                  <p className="p2">Товаров</p>
                  <h3 id="h3">{item?.items?.length}</h3>
                </div>{' '}
                <div className="flex flex-col gap-[5px]">
                  <p className="p2">Брендов </p>
                  <h3 id="h3">{brandIds.size}</h3>
                </div>
                <div className="flex flex-col gap-[5px]">
                  <p className="p2">Период действия коллекции</p>
                  <h3 id="h3">
                    {item.startDate.split('T')[0].replace('-', '.').replace('-', '.')} -{' '}
                    {item.endDate.split('T')[0].replace('-', '.').replace('-', '.') || '∞'}
                  </h3>
                </div>
                <div className="flex items-center gap-[10px]">
                  <Link to={ROUTER_PATHS.ADMIN_COLLECTION + '/' + item?.id} id="admin-button">
                    Открыть коллекцию
                  </Link>

                  <button
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDeleting(item)
                    }}
                    className="text-[#E02844] bg-[#FFF3F3] w-[36px] h-[36px] rounded-[12px] flex items-center justify-center"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            </Link>
          )
        })}

      {adding && (
        <div className={`${styles.modal}`}>
          <form
            className={`w-[400px] max-w-[400px_!important]  ${styles.modal_body}`}
            onSubmit={e => e.preventDefault()}
          >
            <h2 id="h2">Добавление коллекции</h2>
            <label className={`w-[100%] ${styles.modal_body_label}`}>
              <p>Название коллекции</p>
              <input
                autoFocus
                value={adding.name}
                onChange={e => setAdding({ ...adding, name: e.target.value })}
                placeholder="Название коллекции"
              />
            </label>

            <label className={`w-[100%] ${styles.modal_body_label}`}>
              <p>Дата начала действия коллекции</p>
              <input
                type="date"
                value={adding.startDate}
                onChange={e => setAdding({ ...adding, startDate: e.target.value })}
              />
            </label>
            <label className={`w-[100%] ${styles.modal_body_label}`}>
              <p>Дата окончания действия коллекции</p>
              <input
                type="date"
                value={adding.endDate}
                onChange={e => setAdding({ ...adding, endDate: e.target.value })}
              />
            </label>

            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setAdding(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit" onClick={handleCreate}>
                Сохранить
              </button>
            </section>
          </form>
        </div>
      )}
      {deleting && (
        <div className={`${styles.modal} flex p-[10px] `}>
          <form onSubmit={handleDelete} className={styles.modal_body}>
            <h2 id="h2">Удаление коллекции</h2>
            <p id="p2">Вы уверены, что хотите удалить эту коллекцию?</p>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Удалить
              </button>
            </section>
          </form>
        </div>
      )}
    </>
  )
}

export const Collection = () => {
  const [item, setItem] = useState<null | Collection>(null)
  const [deletingRow, setDeletingRow] = useState<null | CollectionItem>(null)
  const [addingRow, setAddingRow] = useState<null | {
    brandId: number
    article: string
    price: number
    season: string
    gender: string
  }>(null)
  const [editingRow, setEditingRow] = useState<null | CollectionItem>(null)
  const [itemBrands, setItemBrands] = useState<{ id: number; value: string }[]>([])

  const [creatingBrand, setCreatingBrand] = useState<{ id: number; value: string } | null>(null)
  const [brandsMenuOpened, setBrandsMenuOpened] = useState<boolean>(false)
  const [selectedBrandId, setSelectedBrandId] = useState<number>(0)
  const [deletingBrand, setDeletingBrand] = useState<null | { id: number; value: string }>(null)

  const [brands, setBrands] = useState<Brand[] | null>(null)
  const [genders, setGenders] = useState<Genders[] | null>(null)
  const [seasons, setSeasons] = useState<Season[] | null>(null)

  const [editingTitle, setEditingTitle] = useState<null | Collection>(null)

  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()

  const refetchCollection = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/collections/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res: { data: Collection }) => {
        setItem(res.data)

        const uniqueBrands = new Set<{ id: number; value: string }>()

        res.data?.items?.forEach(i => {
          i?.brands?.forEach(b => {
            if (!Array.from(uniqueBrands.values()).find(item => item.id == b?.brand?.id))
              uniqueBrands.add(b?.brand)
          })
        })

        const br = Array.from(uniqueBrands.values())

        setItemBrands(br)
        setSelectedBrandId(
          br.find(item => item.id === selectedBrandId) ? selectedBrandId : br[0]?.id || 0
        )
      })
      .catch(err => {
        const errorText = err?.response?.data?.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }

  const refresh = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/collections/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res: { data: Collection }) => {
        setItem(res.data)

        const uniqueBrands = new Set<{ id: number; value: string }>()

        res.data.items?.forEach(i => {
          i?.brands.forEach(b => {
            if (!Array.from(uniqueBrands.values()).find(item => item.id == b?.brand?.id))
              uniqueBrands.add(b?.brand)
          })
        })

        setItemBrands(Array.from(uniqueBrands.values()))
        setSelectedBrandId(
          Array.from(uniqueBrands.values())[0] ? Array.from(uniqueBrands.values())[0].id : 0
        )
      })
      .catch(err => {
        const errorText = err?.response?.data?.message || 'Ошибка получения данных'
        toast.error(errorText)
      })

    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/brands`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        setBrands(res.data)
      })
      .catch(err => {
        const errorText = err?.response?.data?.message || 'Ошибка получения данных'
        toast.error(errorText)
      })

    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        setGenders(res.data.find((attr: any) => attr.name === 'Целевая группа')?.values || [])
        setSeasons(res.data.find((attr: any) => attr.name === 'Сезон')?.values || [])
      })
      .catch(err => {
        const errorText = err?.response?.data?.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }

  useEffect(() => refresh(), [])

  const handleAddBrand = (e: FormEvent) => {
    e.preventDefault()
    if (!creatingBrand) return toast.error('Нету данных для добавления')

    axios(`${import.meta.env.VITE_APP_API_URL}/collections/${item?.id}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        name: 'Новый товар',
        article: 'ABC-123',
        price: '0',
        gender: genders?.[0].value,
        season: seasons?.[0].value,
        brandId: creatingBrand.id,
      },
    })
      .then(async (res: { data: CollectionItem }) => {
        refetchCollection()
        setSelectedBrandId(creatingBrand.id)
        setEditingRow(res.data)
        toast.success('Успешно добавлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setCreatingBrand(null)
  }

  const editTitle = (e: FormEvent) => {
    e.preventDefault()
    if (!editingTitle) return toast.error('Нету данных для редактирования')
    if (editingTitle.name.trim() === '') {
      toast.error('Название не может быть пустым')
      return
    }
    if (item?.id !== editingTitle.id && item?.name === editingTitle.name.trim()) {
      toast.error('Такая коллекция уже существует')
      return
    }
    axios(`${import.meta.env.VITE_APP_API_URL}/collections/${item?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        name: editingTitle.name,
        startDate: editingTitle.startDate,
        endDate: editingTitle.endDate,
      },
    })
      .then(() => {
        refetchCollection()
        toast.success('Успешно отредактировано')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setEditingTitle(null)
  }

  const handleAddRow = (e: FormEvent) => {
    e.preventDefault()
    if (!addingRow) return toast.error('Нету данных для создавания')
    if (addingRow.article.trim() === '') {
      toast.error('Артикул не может быть пустым')
      return
    }
    if (!addingRow.price) {
      toast.error('Укажите цену!')
      return
    }
    if (!addingRow.season) {
      toast.error('Укажите сезон!')
      return
    }
    if (!addingRow.gender) {
      toast.error('Укажите пол!')
      return
    }
    if (!addingRow.brandId) {
      toast.error('Укажите бренд!')
      return
    }
    axios(`${import.meta.env.VITE_APP_API_URL}/collections/${item?.id}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: { name: '', ...addingRow },
    })
      .then(() => {
        refetchCollection()
        toast.success('Успешно отредактировано')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setAddingRow(null)
  }

  const handleDelete = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/collections/items/${deletingRow?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        refetchCollection()
        toast.success('Успешно удалено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setDeletingRow(null)
  }

  const handleEditRow = (e: FormEvent) => {
    e.preventDefault()
    if (!editingRow) return toast.error('Нету данных для редактирования')
    if (editingRow.article.trim() === '') {
      toast.error('Артикул не может быть пустым')
      return
    }
    if (!editingRow.price) {
      toast.error('Укажите цену!')
      return
    }
    if (!editingRow.season) {
      toast.error('Укажите сезон!')
      return
    }
    if (!editingRow.gender) {
      toast.error('Укажите пол!')
      return
    }

    axios(`${import.meta.env.VITE_APP_API_URL}/collections/items/${editingRow.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: { ...editingRow },
    })
      .then(() => {
        refetchCollection()
        toast.success('Успешно отредактировано')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setEditingRow(null)
  }

  return (
    <div className="flex flex-col gap-[32px] p-[36px_60px]">
      <button onClick={() => navigate(-1)} className="flex items-center gap-[10px]">
        <FaChevronLeft /> Ко всем коллекциям
      </button>
      <div className="flex items-center gap-[10px]">
        <h1 id="h1">{item?.name}</h1>
        <button onClick={() => setEditingTitle(item)}>
          <HiDotsHorizontal className="opacity-40 text-[24px]" />
        </button>
      </div>
      <div className="flex flex-col">
        <div className="flex h-[45px] items-center">
          <button
            onClick={() => setCreatingBrand({ id: 0, value: '' })}
            className="p-[15px_24px] text-[14px] text-(black) flex items-center gap-[10px]"
          >
            <FaPlus /> Добавить бренд
          </button>
          {itemBrands && itemBrands.length > 0 && (
            <div className="flex gap-[5px] flex-wrap h-full ">
              {itemBrands.map(brand => (
                <div
                  key={brand.id}
                  className={`${selectedBrandId == brand.id && '[background:linear-gradient(357.7deg,#FFFFFF_25.78%,#FFBBBB_307.71%)]'} h-full  cursor-pointer px-[15px] py-[8px] rounded-t-[8px] flex items-center gap-5px border-[1px] border-b-[white] border-solid border-[#DADADA]`}
                  onClick={() => {
                    setSelectedBrandId(brand?.id || 0)
                  }}
                >
                  <p>{brand.value}</p>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setBrandsMenuOpened(!brandsMenuOpened)}
            className={`ml-[5px] h-full cursor-pointer px-[25px] py-[8px] rounded-t-[8px] flex items-center gap-5px border-[1px] border-b-[white] border-solid border-[#DADADA]`}
          >
            <IoSettingsOutline />
          </button>
        </div>
        <div className="flex flex-col p-[25px] gap-[25px] rounded-[8px] max-h-[600px] overflow-y-auto relative border-solid border-[1px] border-[#DDE1E6]">
          <section className="flex items-center justify-between">
            <p className="p1">
              {item?.items?.length || 0} товар
              {item?.items?.length === 1
                ? ''
                : item?.items?.length && item.items.length < 5
                  ? 'а'
                  : 'ов'}
            </p>
            <section className=" flex flex-wrap gap-[10px]">
              <button
                onClick={() => {
                  if (itemBrands.length === 0) {
                    toast.error('Сначала добавьте бренд!')
                    return setCreatingBrand({ id: 0, value: '' })
                  }
                  setAddingRow({
                    article: '',
                    price: 0,
                    gender: '',
                    season: '',
                    brandId: selectedBrandId,
                  })
                }}
                className=" px-[15px] h-[40px] flex justify-center gap-[10px] rounded-[12px] border-solid border-[1px] border-[var(--admin-light-gray)] items-center"
              >
                <HiPlus /> Добавить товар
              </button>
            </section>
          </section>
          <div className={styles.sizeTypes_list}>
            <div
              className={`${styles.sizeTypes_list_top} pl-[10px] sticky top-[0px] grid-cols-[1fr_1fr_1fr_1fr_220px_!important] gap-[20px] grid`}
            >
              <p>Артикул</p>
              <p>Сезон</p>
              <p>Пол</p>
              <p>Цена</p>
              <p></p>
            </div>
            <div
              className={`${styles.sizeTypes_list} max-h-[${(item?.items?.length || 0) * 81 + (addingRow ? 1 : 0)}px]`}
            >
              {addingRow && (
                <div className="pl-[10px] py-[20px] border-b-[#DDE1E6] border-solid border-b-[1px] grid-cols-[1fr_1fr_1fr_1fr_220px_!important] gap-[20px] grid items-center">
                  <input
                    type="text"
                    className="w-full px-[10px] border-[1px] border-solid border-[#BDBFC7] rounded-[12px] h-[40px] px-[12px] "
                    autoFocus
                    value={addingRow.article}
                    onChange={e => setAddingRow({ ...addingRow, article: e.target.value })}
                    placeholder="Артикул"
                  />
                  <Select1
                    options={seasons?.map(season => ({ id: season.id, title: season.value })) || []}
                    value={
                      seasons?.find(season => season.value === addingRow.season)
                        ? {
                            id: seasons?.find(season => season.value === addingRow.season)?.id || 0,
                            title:
                              seasons?.find(season => season.value === addingRow.season)?.value ||
                              '',
                          }
                        : null
                    }
                    onChange={option => {
                      setAddingRow({ ...addingRow, season: option ? option.title : '' })
                    }}
                    isEmpty={addingRow.season === ''}
                    className="mt-[-10px]"
                  />
                  <Select1
                    options={genders?.map(gender => ({ id: gender.id, title: gender.value })) || []}
                    value={
                      genders?.find(gender => gender.value === addingRow.gender)
                        ? {
                            id: genders?.find(gender => gender.value === addingRow.gender)?.id || 0,
                            title:
                              genders?.find(gender => gender.value === addingRow.gender)?.value ||
                              '',
                          }
                        : null
                    }
                    onChange={option => {
                      setAddingRow({ ...addingRow, gender: option ? option.title : '' })
                    }}
                    isEmpty={addingRow.gender === ''}
                    className="mt-[-10px]"
                  />
                  <NumericFormat
                    thousandSeparator=" "
                    suffix=" ₽"
                    className="w-full border-[1px] border-solid border-[#BDBFC7] rounded-[12px] h-[40px] px-[12px] "
                    value={addingRow.price || ''}
                    onChange={(e: { target: { value: string } }) =>
                      setAddingRow({
                        ...addingRow,
                        price:
                          e.target.value === ''
                            ? 0
                            : Number(e.target.value.split(' ₽')[0].replace(' ', '')),
                      })
                    }
                    placeholder="Цена"
                  />
                  <div className="flex items-center gap-[10px] ml-auto">
                    <button
                      onClick={() => setAddingRow(null)}
                      className="text-[#E02844] rounded-[12px] cursor-pointer w-[40px] h-[40px] bg-[#FFF3F3] flex items-center justify-center text-[18px]"
                    >
                      <LuTrash2 />
                    </button>
                    <button
                      onClick={handleAddRow}
                      className="text-[#22C55E] cursor-pointer bg-[#DCFCE7] rounded-[12px] flex items-center justify-center h-[40px] w-[40px]"
                    >
                      <LuCheck />
                    </button>
                  </div>
                </div>
              )}
              {item?.items && item.items.length > 0 ? (
                (item.items.filter(i => i.brands[0].brand.id == selectedBrandId) || []).map(i => (
                  <div
                    key={i.id}
                    className={`${editingRow?.id == i.id && 'pl-[10px]'} py-[20px] border-b-[#DDE1E6] border-solid border-b-[1px] grid-cols-[1fr_1fr_1fr_1fr_220px_!important] gap-[20px] grid items-center`}
                  >
                    {editingRow && editingRow.id === i.id ? (
                      <>
                        <input
                          type="text"
                          className="w-full px-[10px] border-[1px] border-solid border-[#BDBFC7] rounded-[12px] h-[40px] px-[12px] "
                          value={editingRow?.article}
                          onChange={e =>
                            setEditingRow(
                              editingRow ? { ...editingRow, article: e.target.value } : null
                            )
                          }
                        />
                        <Select1
                          options={
                            seasons?.map(season => ({ id: season.id, title: season.value })) || []
                          }
                          value={
                            seasons?.find(season => season.value === editingRow.season)
                              ? {
                                  id:
                                    seasons?.find(season => season.value === editingRow.season)
                                      ?.id || 0,
                                  title:
                                    seasons?.find(season => season.value === editingRow.season)
                                      ?.value || '',
                                }
                              : null
                          }
                          onChange={option => {
                            setEditingRow(
                              editingRow
                                ? { ...editingRow, season: option ? option.title : '' }
                                : null
                            )
                          }}
                          isEmpty={editingRow.season === ''}
                          className="mt-[-10px]"
                        />{' '}
                        <Select1
                          options={
                            genders?.map(gender => ({ id: gender.id, title: gender.value })) || []
                          }
                          value={
                            genders?.find(gender => gender.value === editingRow.gender)
                              ? {
                                  id:
                                    genders?.find(gender => gender.value === editingRow.gender)
                                      ?.id || 0,
                                  title:
                                    genders?.find(gender => gender.value === editingRow.gender)
                                      ?.value || '',
                                }
                              : null
                          }
                          onChange={option => {
                            setEditingRow(
                              editingRow
                                ? { ...editingRow, gender: option ? option.title : '' }
                                : null
                            )
                          }}
                          isEmpty={editingRow.gender === ''}
                          className="mt-[-10px]"
                        />
                        <NumericFormat
                          thousandSeparator=" "
                          suffix=" ₽"
                          className="w-full border-[1px] border-solid border-[#BDBFC7] rounded-[12px] h-[40px] px-[12px] "
                          value={editingRow?.price || ''}
                          onChange={(e: { target: { value: string } }) =>
                            setEditingRow(
                              editingRow
                                ? {
                                    ...editingRow,
                                    price:
                                      e.target.value === ''
                                        ? 0
                                        : Number(e.target.value.split(' ₽')[0].replace(' ', '')),
                                  }
                                : null
                            )
                          }
                          placeholder="Цена"
                        />
                        <div className="flex items-center gap-[10px] ml-auto">
                          <button
                            onClick={() => setEditingRow(null)}
                            className="text-[#E02844] rounded-[12px] cursor-pointer w-[40px] h-[40px] bg-[#FFF3F3] flex items-center justify-center text-[18px]"
                          >
                            <LuX />
                          </button>
                          <button
                            onClick={handleEditRow}
                            className="text-[#22C55E] cursor-pointer bg-[#DCFCE7] rounded-[12px] flex items-center justify-center h-[40px] w-[40px]"
                          >
                            <LuCheck />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="px-[20px]">{i?.article}</p>
                        <p className="px-[20px] text-center">{i.season}</p>
                        <p className="px-[20px] text-center">{i.gender}</p>
                        <p className="px-[20px] text-center">
                          <NumericFormat
                            value={i.price}
                            thousandSeparator=" "
                            displayType="text"
                            suffix=" ₽"
                          />
                        </p>

                        <div className="flex items-center gap-[10px] ml-auto">
                          <button
                            onClick={() => setDeletingRow(i)}
                            className="text-[#E02844] rounded-[12px] cursor-pointer w-[40px] h-[40px] bg-[#FFF3F3] flex items-center justify-center text-[18px]"
                          >
                            <LuTrash2 />
                          </button>
                          <button
                            onClick={() => setEditingRow(i)}
                            className="text-[#202224] cursor-pointer bg-[#F8F8F8] rounded-[12px] flex items-center justify-center h-[40px] w-[40px]"
                          >
                            <LuPencil />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="p2">Товаров нет</p>
              )}
            </div>
            <div className={`${styles.sizeTypes_list_top} rotate-180 border-[#f9fafb]`}>
              <p></p>
            </div>
          </div>
        </div>
      </div>

      {editingTitle && (
        <div className={`${styles.modal}`}>
          <form
            className={`w-[400px] max-w-[400px_!important]  ${styles.modal_body}`}
            onSubmit={e => e.preventDefault()}
          >
            <h2 id="h2">Редактирование коллекции</h2>
            <label className={`w-[100%] ${styles.modal_body_label}`}>
              <p>Название коллекции</p>
              <input
                autoFocus
                value={editingTitle.name}
                onChange={e => setEditingTitle({ ...editingTitle, name: e.target.value })}
                placeholder="Название коллекции"
              />
            </label>

            <label className={`w-[100%] ${styles.modal_body_label}`}>
              <p>Дата начала действия коллекции</p>
              <input
                type="date"
                value={editingTitle.startDate.split('T')[0]}
                onChange={e => setEditingTitle({ ...editingTitle, startDate: e.target.value })}
              />
            </label>
            <label className={`w-[100%] ${styles.modal_body_label}`}>
              <p>Дата окончания действия коллекции</p>
              <input
                type="date"
                value={editingTitle.endDate.split('T')[0]}
                onChange={e => setEditingTitle({ ...editingTitle, endDate: e.target.value })}
              />
            </label>

            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setEditingTitle(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit" onClick={editTitle}>
                Сохранить
              </button>
            </section>
          </form>
        </div>
      )}

      {creatingBrand && (
        <div className={`${styles.modal}`}>
          <form
            className={`w-[430px] max-w-[430px_!important]  ${styles.modal_body}`}
            onSubmit={e => e.preventDefault()}
          >
            <h2 id="h2">Добавление бренда</h2>
            <div className={`w-[100%] relative ${styles.modal_body_label}`}>
              <p>Бренд</p>
              <CustomSelect
                value={creatingBrand || { id: 0, value: '' }}
                onChange={(id, value) => setCreatingBrand({ id: id, value: value || '' })}
                data={
                  brands
                    ? brands
                        .filter(
                          (brand): brand is Brand & { id: number } => typeof brand.id === 'number'
                        )
                        .map(brand => ({ id: brand.id, value: brand.value }))
                        .filter(brand => !itemBrands.map(b => b.id).includes(brand.id))
                    : [{ id: 0, value: 'Нет брендов' }]
                }
                placeholder="Бренд"
              />
            </div>
            <div className="flex gap-[10px] mt-[20px] ml-auto">
              <button
                type="button"
                onClick={() => setCreatingBrand(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button
                id="admin-button"
                type="submit"
                onClick={handleAddBrand}
                disabled={creatingBrand.id === 0}
              >
                Добавить бренд
              </button>
            </div>
          </form>
        </div>
      )}

      {deletingRow && (
        <div className={`${styles.modal} flex p-[10px] `}>
          <form onSubmit={handleDelete} className={styles.modal_body}>
            <h2 id="h2">Вы точно хотите удалить строчку с артикулом {deletingRow.article}</h2>
            {/* <p id="p2">Вы уверены, что хотите удалить этот товар из коллекции?</p> */}
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setDeletingRow(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Удалить
              </button>
            </section>
          </form>
        </div>
      )}

      {brandsMenuOpened && (
        <div className={`${styles.modal} flex p-[10px] `}>
          <div className={`w-[430px] max-w-[430px_!important]  ${styles.modal_body} relative`}>
            <h2 id="h2">Настройка брендов</h2>
            <div className="flex flex-col max-h-[400px] overflow-y-auto">
              {itemBrands && itemBrands.length > 0 ? (
                itemBrands.map(brand => (
                  <div
                    key={brand.id}
                    className="py-[10px] border-b-[#DDE1E6] border-solid border-b-[1px] grid-cols-[1fr_40px_!important] gap-[20px] grid items-center"
                  >
                    <p className="px-[20px]">{brand.value}</p>
                    <button
                      onClick={() => setDeletingBrand(brand)}
                      className="text-[#E02844] rounded-[12px] cursor-pointer w-[36px] h-[36px] bg-[#FFF3F3] flex items-center justify-center text-[18px]"
                    >
                      <LuTrash2 />
                    </button>
                  </div>
                ))
              ) : (
                <p className="p2">Брендов нет</p>
              )}
            </div>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              {/* <button
                type="button"
                onClick={() => setBrandsMenuOpened(false)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button> */}
              <button id="admin-button" type="button" onClick={() => setBrandsMenuOpened(false)}>
                Сохранить
              </button>
            </section>
          </div>
        </div>
      )}

      {deletingBrand && (
        <div className={`${styles.modal} flex p-[10px] `}>
          <form
            onSubmit={e => {
              e.preventDefault()
              axios(
                `${import.meta.env.VITE_APP_API_URL}/collections/${item?.id}/brands/${deletingBrand.id}`,
                {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              )
                .then(() => {
                  refetchCollection()
                  toast.success('Бренд успешно удален из коллекции')
                  setDeletingBrand(null)
                  setBrandsMenuOpened(false)
                })
                .catch(err => {
                  const errorText = err.response.data.message || 'Ошибка получения данных'
                  toast.error(errorText)
                })
            }}
            className={styles.modal_body}
          >
            <h2 id="h2">Вы точно хотите удалить бренд {deletingBrand.value}</h2>
            <p id="p2">Удаление бренда так же удалит все товары под этим брендом</p>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                type="button"
                onClick={() => setDeletingBrand(null)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button id="admin-button" type="submit">
                Удалить
              </button>
            </section>
          </form>
        </div>
      )}
    </div>
  )
}

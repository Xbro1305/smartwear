import { FormEvent, useEffect, useState } from 'react'
import styles from './Atributes.module.scss'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { FeatureEditor } from '../Components/FeatureEditor/editor'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AiOutlineClose, AiOutlinePicture, AiOutlinePlus } from 'react-icons/ai'
import { FaCheck } from 'react-icons/fa'
import { NumericFormat } from 'react-number-format'

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
  const [creating, setCreating] = useState<null | { value: string; startDate: string }>(null)
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
        startDate: `${creating?.startDate}T00:00:00.000Z`,
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
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        value: editing?.value,
        startDate: `${editing?.meta?.startDate}T00:00:00.000Z`,
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
        onClick={() => setCreating({ value: '', startDate: '' })}
        className="ml-auto"
        id="admin-button"
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
                value={creating.startDate}
                onChange={e => setCreating({ ...creating, startDate: e.target.value })}
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

    console.log(item)

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
                        console.log(adding)
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
  sizeValue: { id: number; typeId: number; name: string; orderNum: number }
  chest: number
  waist: number
  hips: number
  height: number
}

interface Genders {
  id: number
  value: string
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
            className={` w-[1100px]  ${styles.modal_body}`}
            style={{ maxWidth: '825px' }}
            onSubmit={handleCreate}
          >
            <h2 id="h2">Добавление таблицы размеров</h2>
            <label className={`w-[370px] ${styles.modal_body_label}`}>
              <p>Название таблицы</p>
              <select
                autoFocus
                value={creating.brand.id}
                onChange={e =>
                  setCreating({
                    ...creating,
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
                value={creating.gender.id}
                onChange={e =>
                  setCreating({
                    ...creating,
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
              <p>Вид размера</p>
              <select
                value={creating.type.id}
                onChange={e =>
                  setCreating({
                    ...creating,
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
            {creating.type.id != 0 && sizeTypes?.find(i => i.id === creating.type.id) && (
              <div className={`${styles.modal_body_label}`}>
                <p>Размеры</p>
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
                  {sizeTypes
                    .find(i => i.id === creating.type.id)!
                    .values.sort((a, b) => a?.orderNum! - b.orderNum!)
                    .map((value, index) => (
                      <div
                        key={index}
                        className="grid p-[10px] grid-cols-[140px_140px_140px_140px_140px_1fr_!important] items-center gap-[10px] mb-[10px]"
                      >
                        <input type="text" value={value.name} readOnly name="" id="" />
                        <NumericFormat
                          value={creating.rows.find(i => i.sizeValueId === value.id)?.height || ''}
                          onChange={(e: { target: { value: string } }) => {
                            const height = e.target.value === '' ? 0 : Number(e.target.value)
                            if (creating.rows.find(i => i.sizeValueId === value.id)) {
                              setCreating({
                                ...creating,
                                rows: creating.rows.map(i =>
                                  i.sizeValueId === value.id ? { ...i, height } : i
                                ),
                              })
                            } else {
                              setCreating({
                                ...creating,
                                rows: [
                                  ...creating?.rows,
                                  {
                                    sizeValueId: value.id ?? 0,
                                    orderNum: value.orderNum ?? 0,
                                    sizeValue: {
                                      ...value,
                                      id: value.id ?? 0,
                                      typeId: value.typeId ?? 0,
                                      orderNum: value.orderNum ?? 0,
                                    },
                                    chest: 0,
                                    waist: 0,
                                    hips: 0,
                                    height,
                                  },
                                ],
                              })
                            }
                          }}
                          placeholder="Рост"
                        />
                        <NumericFormat
                          value={creating.rows.find(i => i.sizeValueId === value.id)?.chest || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const chest: number = e.target.value === '' ? 0 : Number(e.target.value)
                            if (
                              creating.rows.find((i: SizeTableRow) => i.sizeValueId === value.id)
                            ) {
                              setCreating({
                                ...creating,
                                rows: creating.rows.map((i: SizeTableRow) =>
                                  i.sizeValueId === value.id ? { ...i, chest } : i
                                ),
                              })
                            } else {
                              setCreating({
                                ...creating,
                                rows: [
                                  ...creating.rows,
                                  {
                                    sizeValueId: value.id ?? 0,
                                    orderNum: value.orderNum ?? 0,
                                    sizeValue: {
                                      ...value,
                                      id: value.id ?? 0,
                                      orderNum: value.orderNum ?? 0,
                                    },
                                    chest,
                                    waist: 0,
                                    hips: 0,
                                    height: 0,
                                  } as SizeTableRow,
                                ],
                              })
                            }
                          }}
                          placeholder="Обхват груди"
                        />
                        <NumericFormat
                          value={
                            creating.rows.find((i: SizeTableRow) => i.sizeValueId === value.id)
                              ?.waist || ''
                          }
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const waist = e.target.value === '' ? 0 : Number(e.target.value)
                            if (creating.rows.find(i => i.sizeValueId === value.id)) {
                              setCreating({
                                ...creating,
                                rows: creating.rows.map(i =>
                                  i.sizeValueId === value.id ? { ...i, waist } : i
                                ),
                              })
                            } else {
                              setCreating({
                                ...creating,
                                rows: [
                                  ...creating.rows,
                                  {
                                    sizeValueId: value.id ?? 0,
                                    orderNum: value.orderNum ?? 0,
                                    sizeValue: {
                                      ...value,
                                      id: value.id ?? 0,
                                      orderNum: value.orderNum ?? 0,
                                    },
                                    chest: 0,
                                    waist,
                                    hips: 0,
                                    height: 0,
                                  } as SizeTableRow,
                                ],
                              })
                            }
                          }}
                          placeholder="Обхват талии"
                        />
                        <NumericFormat
                          value={creating.rows.find(i => i.sizeValueId === value.id)?.hips || ''}
                          onChange={(e: { target: { value: string } }) => {
                            const hips = e.target.value === '' ? 0 : Number(e.target.value)
                            if (creating.rows.find(i => i.sizeValueId === value.id)) {
                              setCreating({
                                ...creating,
                                rows: creating.rows.map(i =>
                                  i.sizeValueId === value.id ? { ...i, hips } : i
                                ),
                              })
                            } else {
                              setCreating({
                                ...creating,
                                rows: [
                                  ...creating.rows,
                                  {
                                    sizeValueId: value.id ?? 0,
                                    orderNum: value.orderNum ?? 0,
                                    sizeValue: {
                                      ...value,
                                      id: value.id ?? 0,
                                      orderNum: value.orderNum ?? 0,
                                    },
                                    chest: 0,
                                    waist: 0,
                                    hips,
                                    height: 0,
                                  } as SizeTableRow,
                                ],
                              })
                            }
                          }}
                          placeholder="Обхват бедер"
                        />
                        <div></div>
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
              <button id="admin-button" type="submit">
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
            className={` w-[1100px]  ${styles.modal_body}`}
            style={{ maxWidth: '825px' }}
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
              <p>Размеры</p>
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
                    <input type="text" value={row.sizeValue.name} readOnly name="" id="" />
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
                    <div></div>
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

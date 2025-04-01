import { FormEvent, useEffect, useState } from 'react'
import styles from './Atributes.module.scss'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import autojackLogo from '@/assets/images/autojcak.png'
import limoladyLogo from '@/assets/images/limolady.png'
import nordwindLogo from '@/assets/images/nordwind.png'
import { Link } from 'react-router-dom'
import { FeatureEditor } from '../Components/FeatureEditor/editor'
import axios from 'axios'
import { toast } from 'react-toastify'

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
        setItems(res.data)
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
        setItems(prev => ({
          ...prev!,
          values: prev!.values.filter(i => i.id !== deleting?.id),
        }))
        alert('Вы удалили ' + deleting?.value)
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
        setItems(prev => ({
          ...prev!,
          values: [...prev!.values, res.data],
        }))
        alert('Вы создали ' + creating?.value)
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
            items.values?.map((item, index) => (
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

export const SeasonAttrCase = ({ id }: { id: number }) => {
  const [items, setItems] = useState({
    name: 'Сезоны',
    id: 2,
    values: [
      { value: 'Лето', attributeId: 1, startDate: '2023-06-01' },
      { value: 'Зима', attributeId: 2, startDate: '2023-12-01' },
      { value: 'Весна', attributeId: 3, startDate: '2023-03-01' },
    ],
  })
  const [deleting, setDeleting] = useState<null | {
    value: string
    startDate: string
    attributeId: number
  }>(null)
  const [creating, setCreating] = useState<null | { value: string; startDate: string }>(null)
  const [editing, setEditing] = useState<null | {
    value: string
    startDate: string
    attributeId: number
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
        setItems(res.data)
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }, [])

  const handleDelete = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/values/${deleting?.attributeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        setItems(prev => ({
          ...prev,
          values: prev.values.filter(i => i.value !== deleting?.value),
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
      .then(res => {
        setItems(prev => ({
          ...prev,
          values: [...prev.values, res.data],
        }))
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
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/values/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        attributeId: editing?.attributeId,
        value: editing?.value,
        startDate: `${editing?.startDate}T00:00:00.000Z`,
      },
    })
      .then(res => {
        setItems(prev => ({
          ...prev,
          values: prev.values.map(i => (i.value === editing?.value ? res.data : i)),
        }))
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
        {items.values?.map((item, index) => (
          <div key={index} className={styles.seasonAtributes_list_item}>
            <label>{item.value}</label>
            <label>{item.startDate.replace('-', '.').replace('-', '.').split('T')[0]}</label>
            <section>
              <button onClick={() => setDeleting(item)}>
                <LuTrash2 />
              </button>
              <button
                onClick={() =>
                  setEditing({
                    attributeId: item.attributeId,
                    value: item.value,
                    startDate: item.startDate.split('T')[0],
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
                value={editing?.startDate}
                onChange={e =>
                  setEditing({
                    ...editing,
                    startDate: e.target.value,
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

  const [items, setItems] = useState({
    name: 'Целевые группы',
    id: 3,
    values: [
      { value: 'Мужчины', id: 1 },
      { value: 'Женщины', id: 2 },
      { value: 'Дети', id: 3 },
    ],
  })

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}`, {
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
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }, [])

  const handleDelete = () => {
    setDeleting(null)
    alert('Вы удалили ' + deleting?.value)
  }

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    setCreating(null)
    alert('Вы создали ' + creating?.value)
  }

  return (
    <>
      <button onClick={() => setCreating({ value: '' })} className="ml-auto" id="admin-button">
        Добавить целевую группу
      </button>
      <div className={styles.atributes_list}>
        <h3 id="h3">{items.name}</h3>
        <div className={styles.atributes_list_items}>
          {items.values?.map((item, index) => (
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
  title: string
  description: string
  logo: string
  url: string
  metaTitle: string
  metaDescription: string
}

const data: Brand[] = [
  {
    title: 'AutoJack',
    description:
      'AutoJack & LimoLady — российско-немецкий бренд по производству высокотехнологичной верхней одежды. Компания выпускает мужскую и женскую одежду, а также толстовки, брюки и аксессуары.',
    logo: autojackLogo,
    url: 'autojack',
    metaTitle: 'Мета заголовок 1',
    metaDescription: 'Мета описание 1',
  },
  {
    title: 'LimoLady',
    description:
      'LimoLady — немецко-российская компания по производству верхней одежды. Бренд выпускает моделидля мобильного горожанина, который проводит минимум 2–3 часа в день за рулём. ',
    logo: limoladyLogo,
    url: 'limolady',
    metaTitle: 'Мета заголовок 2',
    metaDescription: 'Мета описание 2',
  },
  {
    title: 'Nordwind',
    description:
      'Nordwind Airlines (юридическое название — ООО «Северный ветер») — российская авиакомпания, образованная в 2008 году. Является дочерней компанией «Пегас Туристик»',
    logo: nordwindLogo,
    url: 'nordwind',
    metaTitle: 'Мета заголовок 3',
    metaDescription: 'Мета описание 3',
  },
]

export const Brands = ({ id }: { id: number }) => {
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState<null | Brand>(null)
  const [editing, setEditing] = useState<null | Brand>(null)
  const [deleting, setDeleting] = useState<null | Brand>(null)
  const [items, setItems] = useState<Brand[]>(data)

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        const data: Brand[] = res.data.values.map((item: any) => ({
          title: item.value,
          metaDescription: item.description,
          logo: item.imageUrl,
          url: item.seoSlug,
          description: item.description || '',
          metaTitle: 'Мета заголовок 3',
        }))
        setItems(data)
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
  }, [])

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    const item = { ...(creating as Brand), description }
    console.log(item)
    setItems([...items, item])
    alert('Вы создали ' + creating?.title)
    setDescription('')
    setCreating(null)
  }

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault()
    const item = { ...(editing as Brand), description }
    console.log(item)
    setItems(items.map(i => (i.title === item.title ? item : i)))
    alert('Вы изменили ' + editing?.title)
    setDescription('')
    setEditing(null)
  }

  const handleDelete = (e: FormEvent) => {
    e.preventDefault()
    setItems(items.filter(i => i.title !== deleting?.title))
    alert('Вы удалили ' + deleting?.title)
    setDeleting(null)
  }

  return (
    <>
      <div className={styles.brands}>
        <button
          onClick={() =>
            setCreating({
              title: '',
              description: '',
              logo: '',
              url: '',
              metaTitle: '',
              metaDescription: '',
            })
          }
          className="ml-auto"
          id="admin-button"
        >
          Добавить бренд
        </button>

        <div className={styles.brands_list}>
          {items.map((item, index) => (
            <div key={index} className={styles.brands_list_item}>
              <section className={styles.brands_list_item_top}>
                <img src={item.logo} alt={item.title} />
                <h3 id="h3">{item.title}</h3>
              </section>
              <div className="flex flex-col gap-[5px]">
                <p style={{ color: 'var(--dark-gray)' }} id="p2">
                  Описание
                </p>
                <p dangerouslySetInnerHTML={{ __html: item.description }} id="p2"></p>
              </div>
              <div className="flex flex-1 flex-col gap-[5px]">
                <p style={{ color: 'var(--dark-gray)' }} id="p2">
                  Ссылка
                </p>
                <Link
                  className="border-b-[1px] border-b-solid border-b-[var(--dark-gray)] w-[fit-content]"
                  to={`https://test.maxiscomfort.ru/${item.url}`}
                  id="p2"
                >
                  {`https://test.maxiscomfort.ru/${item.url}`}
                </Link>
              </div>

              <section className="flex gap-[10px] mt-[20px] ml-auto">
                <button
                  id="admin-button"
                  onClick={() => {
                    setEditing(item)
                    setDescription(item.description)
                  }}
                >
                  Редактировать
                </button>
                <button
                  onClick={() => setDeleting(item)}
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
        <div className={`${styles.modal} flex`}>
          <form onSubmit={e => handleCreate(e)} className={styles.modal_body}>
            <h2 id="h2">Добавление бренда</h2>
            <label className={styles.modal_body_label}>
              <p>Название</p>
              <input
                type="text"
                value={creating.title}
                onChange={e => setCreating({ ...creating, title: e.target.value })}
                placeholder={`Название бренда`}
              />
            </label>
            <section className={styles.modal_body_label}>
              <p>Описание</p>
              <FeatureEditor value={description} onChange={value => setDescription(value)} />
            </section>
            <label className={styles.modal_body_label}>
              <p>Логотип</p>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  if (e.target.files) {
                    const file = e.target.files[0]
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setCreating({ ...creating, logo: reader.result as string })
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />

              {creating.logo && (
                <img
                  className="w-[100px] h-[100px] object-cover rounded-[12px] mt-[10px]"
                  src={creating.logo}
                  alt={creating.title}
                />
              )}
            </label>
            <label className={styles.modal_body_label}>
              <p>Ссылка на бренд</p>
              <input
                type="text"
                value={creating.url}
                onChange={e => setCreating({ ...creating, url: e.target.value })}
                placeholder={`Ссылка`}
              />
            </label>
            <label className={styles.modal_body_label}>
              <p>Мета заголовок</p>
              <input
                type="text"
                value={creating.metaTitle}
                onChange={e => setCreating({ ...creating, metaTitle: e.target.value })}
                placeholder={`Мета заголовок`}
              />
            </label>
            <label className={styles.modal_body_label}>
              <p>Мета описание</p>
              <textarea
                value={creating.metaDescription}
                onChange={e => setCreating({ ...creating, metaDescription: e.target.value })}
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
        <div className={`${styles.modal} flex`}>
          <form onSubmit={e => handleUpdate(e)} className={styles.modal_body}>
            <h2 id="h2">Редактирование бренда</h2>
            <label className={styles.modal_body_label}>
              <p>Название</p>
              <input
                type="text"
                value={editing.title}
                onChange={e => setEditing({ ...editing, title: e.target.value })}
                placeholder={`Название бренда`}
              />
            </label>
            <section className={styles.modal_body_label}>
              <p>Описание</p>
              <FeatureEditor value={description} onChange={value => setDescription(value)} />
            </section>
            <label className={styles.modal_body_label}>
              <p>Логотип</p>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  if (e.target.files) {
                    const file = e.target.files[0]
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setEditing({ ...editing, logo: reader.result as string })
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />

              {editing.logo && (
                <img
                  className="w-[100px] h-[100px] object-cover rounded-[12px] mt-[10px]"
                  src={editing.logo}
                  alt={editing.title}
                />
              )}
            </label>
            <label className={styles.modal_body_label}>
              <p>Ссылка на бренд</p>
              <input
                type="text"
                value={editing.url}
                onChange={e => setEditing({ ...editing, url: e.target.value })}
                placeholder={`Ссылка`}
              />
            </label>
            <label className={styles.modal_body_label}>
              <p>Мета заголовок</p>
              <input
                type="text"
                value={editing.metaTitle}
                onChange={e => setEditing({ ...editing, metaTitle: e.target.value })}
                placeholder={`Мета заголовок`}
              />
            </label>
            <label className={styles.modal_body_label}>
              <p>Мета описание</p>
              <textarea
                value={editing.metaDescription}
                onChange={e => setEditing({ ...editing, metaDescription: e.target.value })}
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
            <h2 id="h2">Вы точно хотите удалить бренд {deleting.title}?</h2>
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

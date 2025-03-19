import { useState } from 'react'
import styles from './Features.module.scss'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import { Editor } from '../../articles/Create/editor'
import axios from 'axios'
import { toast } from 'react-toastify'

interface Feature {
  id: number
  name: string
  description: string
}

export const ProductFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 1,
      name: 'Водонепроницаемая',
      description: 'Не пропускает воду',
    },
    {
      id: 2,
      name: 'Градусник',
      description: 'Не пропускает воду',
    },
  ])

  const [editing, setEditing] = useState<false | Feature>(false)
  const [isCreating, setIsCreating] = useState<false | Feature>(false)
  const [deleting, setDeleting] = useState<false | Feature>(false)

//   useEffect(() => {
//     axios(`${import.meta.env.VITE_API_URL}/features`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//     })
//       .then(res => {
//         setFeatures(res.data)
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }, [])

  const handleEdit = () => {
    if (!editing) return
    axios(`${import.meta.env.VITE_API_URL}/features/${editing?.id}`, {
      method: 'PUT',
      data: {
        name: editing?.name,
        description: editing?.description,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        setEditing(false)
        setFeatures(features.map(feature => (feature.id === editing?.id ? editing : feature)))
        toast.success('Успешно обновлено', {
          position: 'top-right',
          autoClose: 3000,
        })
      })
      .catch(err => {
        toast.error('Ошибка', {
          position: 'top-right',
          autoClose: 3000,
        })
        console.log(err)
      })
  }

  const handleSubmit = () => {
    if (!isCreating) return
    axios(`${import.meta.env.VITE_API_URL}/features`, {
      method: 'POST',
      data: {
        name: isCreating?.name,
        description: isCreating?.description,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        setIsCreating(false)
        setFeatures([...features, { ...isCreating, id: features.length + 1 }])
        toast.success('Успешно добавлено', {
          position: 'top-right',
          autoClose: 3000,
        })
      })
      .catch(err => {
        toast.error('Ошибка', {
          position: 'top-right',
          autoClose: 3000,
        })
        console.log(err)
      })
  }

  const handleDelete = () => {
    if (!deleting) return
    axios(`${import.meta.env.VITE_API_URL}/features/${deleting?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        setDeleting(false)
        setFeatures(features.filter(feature => feature.id !== deleting?.id))
        toast.success('Успешно удалено', {
          position: 'top-right',
          autoClose: 3000,
        })
      })
      .catch(err => {
        toast.error('Ошибка', {
          position: 'top-right',
          autoClose: 3000,
        })
        console.log(err)
      })
  }

  return (
    <div className={styles.features}>
      <h1 id="h1">Особенности товаров</h1>
      <button id="admin-button" onClick={() => setIsCreating({ id: 1, name: '', description: '' })}>
        + Создать особенность
      </button>
      <div className={styles.features_list}>
        {features.map(feature => (
          <div key={feature.id} className={styles.features_item}>
            <h2>{feature.name}</h2>
            <button onClick={() => setEditing(feature)} className={styles.features_button}>
              <LuPencil />
            </button>
            <button onClick={() => setDeleting(feature)} className={styles.features_button}>
              <LuTrash2 />
            </button>
          </div>
        ))}
      </div>
      {editing && (
        <div className={`${styles.features_modal} flex`}>
          <div className={styles.features_modal_body}>
            <h2 id="h2">Редактирование особенности</h2>
            <label className={styles.features_modal_body_label}>
              <p>Название</p>
              <input
                type="text"
                placeholder="Название особенности"
                value={editing ? editing.name : ''}
                onChange={e => setEditing({ ...editing, name: e.target.value })}
              />
            </label>
            <label className={styles.features_modal_body_label}>
              <p>Описание</p>
              <Editor
                isimg={true}
                value={editing ? editing.description : ''}
                onChange={value => setEditing({ ...editing, description: value })}
              />
            </label>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button onClick={handleEdit} id="admin-button">
                Сохранить
              </button>
            </section>
          </div>
        </div>
      )}
      {isCreating && (
        <div className={`${styles.features_modal} flex`}>
          <div className={styles.features_modal_body}>
            <h2 id="h2">Редактирование особенности</h2>
            <label className={styles.features_modal_body_label}>
              <p>Название</p>
              <input
                type="text"
                placeholder="Название особенности"
                value={isCreating ? isCreating.name : ''}
                onChange={e => setIsCreating({ ...isCreating, name: e.target.value })}
              />
            </label>
            <label className={styles.features_modal_body_label}>
              <p>Описание</p>
              <Editor
                isimg={true}
                value={isCreating ? isCreating.description : ''}
                onChange={value => setIsCreating({ ...isCreating, description: value })}
              />
            </label>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                onClick={() => setIsCreating(false)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button onClick={handleSubmit} id="admin-button">
                Сохранить
              </button>
            </section>
          </div>
        </div>
      )}

      {deleting && (
        <div className={`${styles.features_modal} flex`}>
          <div className={styles.features_modal_body}>
            <h2 id="h2">Вы точно хотите удалить особенность {deleting.name}?</h2>
            <section className="ml-auto flex gap-[10px] mt-[20px]">
              <button
                onClick={() => setDeleting(false)}
                className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
              >
                Отмена
              </button>
              <button onClick={handleDelete} id="admin-button">
                Сохранить
              </button>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}

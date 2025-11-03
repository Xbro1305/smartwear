import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styles from '../products/atributes/Atributes.module.scss'
import { BsBag } from 'react-icons/bs'
import { PatternFormat } from 'react-number-format'
import { FaEye, FaEyeSlash, FaRegCheckCircle, FaRegCircle } from 'react-icons/fa'
import { CustomSwitch } from '../products/Components/CustomSwitch/switch'
import { LuPencil, LuTrash2 } from 'react-icons/lu'

interface Store {
  name: string
  shortName: string
  address: string
  phone: string
  email: string
  passwordHash: string
  isOnlineSender: boolean
  syncKey: string
  id?: number
}

export const AdminStores = () => {
  const [data, setData] = useState<Store[]>([])
  const [creating, setCreating] = useState<Store | null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [deleting, setDeleting] = useState<Store | null>(null)
  const [editing, setEditing] = useState<Store | null>(null)

  const passwordSecurityLevel = (password: string) => {
    let level = 0
    if (password.length >= 8) level++
    if (/[A-ZА-Я]/.test(password) && /[a-zа-я]/.test(password)) level++
    if (/[0-9]/.test(password)) level++
    if (/[!@#$%^&*]/.test(password)) level++
    return level
  }

  useEffect(() => {
    document.title = 'Магазины - Панель администратора'

    axios(`${import.meta.env.VITE_APP_API_URL}/stores`)
      .then(res => {
        setData(res.data)
      })
      .catch(err => {
        toast.error('Ошибка при загрузке магазинов')
        console.error(err)
      })
  }, [])

  const handleSubmit = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: { ...creating, passwordHash: '' },
    })
      .then(res => {
        toast.success('Магазин создан')
        setData([...data, res.data])
        setCreating(null)
        setIsPasswordVisible(false)
      })
      .catch(err => {
        toast.error('Ошибка при создании магазина')
        console.error(err)
      })
  }

  const handleUpdate = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/stores/${editing?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: { ...editing, passwordHash: '' },
    })
      .then(res => {
        toast.success('Магазин обновлен')
        setData(data.map(store => (store.id === editing?.id ? res.data : store)))
        setEditing(null)
        setIsPasswordVisible(false)
      })
      .catch(err => {
        toast.error('Ошибка при обновлении магазина')
        console.error(err)
      })
  }

  const handleDelete = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/stores/${deleting?.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        toast.success('Магазин удален')
        setData(data.filter(store => store.id !== deleting?.id))
        setDeleting(null)
      })
      .catch(err => {
        toast.error('Ошибка при удалении магазина')
        console.error(err)
      })
  }

  return (
    <div className="py-[80px] px-[36px] flex flex-col gap-[50px]">
      <h1 id="h1">Магазины</h1>
      <button
        id="admin-button"
        className="ml-auto"
        onClick={() =>
          setCreating({
            name: '',
            shortName: '',
            address: '',
            phone: '',
            email: '',
            passwordHash: '',
            isOnlineSender: false,
            syncKey: '',
          })
        }
      >
        + Добавить магазин
      </button>
      <div className={`${styles.seasonAtributes_list}`}>
        <div className={styles.seasonAtributes_list_top}>
          <p>Название</p>
          <p>Отправитель МойСклад</p>
          <p></p>
        </div>
        {data.length ? (
          data.map((store, index) => (
            <div key={index} className={styles.seasonAtributes_list_item}>
              <label>{store.name}</label>
              <label>{store.isOnlineSender ? 'Да' : 'Нет'}</label>
              <div className="flex items-center p-[33px] justify-end gap-[20px]">
                {!store.isOnlineSender && (
                  <button
                    className="w-[40px] h-[40px] rounded-[8px] bg-[#FFF3F3] text-[#E02844] flex items-center justify-center text-[18px]"
                    onClick={() => setDeleting(store || 0)}
                  >
                    <LuTrash2 />
                  </button>
                )}
                <button
                  className="w-[40px] h-[40px] rounded-[8px] bg-[#F8F8F8] text-[#202224f0] flex items-center justify-center text-[18px]"
                  onClick={() => setEditing(store)}
                >
                  <LuPencil />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-[30px] items-center justify-center w-full h-[200px]">
            <BsBag className="text-4xl" />
            <p className="text-[18px] font-medium">Магазины не найдены</p>
          </div>
        )}
        <div className={`rotate-[180deg] ${styles.seasonAtributes_list_top}`}>
          <p></p>
          <p></p>
          <p></p>
        </div>
      </div>
      {creating && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50">
          <div className="max-h-[90vh] overflow-auto bg-white p-[36px] rounded-[12px] flex flex-col gap-[24px] w-[1100px]">
            <h2 id="h2">Создать магазин</h2>
            <label className="flex flex-col gap-sm">
              <p className="font-semibold text-[14px]">Полное название</p>
              <input
                type="text"
                className="admin-input"
                required
                value={creating.name}
                onChange={e => setCreating({ ...creating, name: e.target.value })}
                placeholder="Название магазина"
              />
            </label>
            <label className="flex flex-col gap-sm">
              <p className="font-semibold text-[14px]">Краткое название</p>
              <input
                type="text"
                className="admin-input"
                required
                value={creating.shortName}
                onChange={e => setCreating({ ...creating, shortName: e.target.value })}
                placeholder="Краткое название магазина"
              />
            </label>
            <div className="flex gap-[12px]">
              <label className="flex flex-col gap-sm w-full">
                <p className="font-semibold text-[14px]">Телефон магазина</p>
                <PatternFormat
                  format="+7 (###) ###-##-##"
                  mask="_"
                  className="admin-input"
                  required
                  value={creating.phone}
                  onChange={(e: { target: { value: string } }) =>
                    setCreating({ ...creating, phone: e.target.value })
                  }
                  placeholder="Телефон магазина"
                />
              </label>
              <label className="flex flex-col gap-sm w-full">
                <p className="font-semibold text-[14px]">Email магазина</p>
                <input
                  type="email"
                  className="admin-input"
                  required
                  value={creating.email}
                  onChange={e => setCreating({ ...creating, email: e.target.value })}
                  placeholder="Email магазина"
                />
              </label>
            </div>
            <label className="flex flex-col gap-sm w-full">
              <p className="font-semibold text-[14px]">Пароль магазина</p>
              <div className="relative">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  className="admin-input w-full pr-[40px]"
                  required
                  value={creating.passwordHash}
                  onChange={e => setCreating({ ...creating, passwordHash: e.target.value })}
                  placeholder="Пароль магазина"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-[12px] -translate-y-1/2 text-lg text-gray-500"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </label>
            <div className="flex flex-col gap-[12px]">
              <div className="w-full h-[8px] rounded-[8px] bg-[#EDECEF]">
                <div
                  className={`h-full rounded-[8px] min-w-[20px] w-full transition-all duration-500 ease-ease`}
                  style={{
                    maxWidth: `${(passwordSecurityLevel(creating.passwordHash) / 4) * 100}%`,
                    background:
                      passwordSecurityLevel(creating.passwordHash) === 4
                        ? '#02ba21'
                        : passwordSecurityLevel(creating.passwordHash) == 1
                          ? '#fa0505'
                          : passwordSecurityLevel(creating.passwordHash) == 0
                            ? '#605D67'
                            : '#fac905',
                  }}
                ></div>
              </div>
              <div className="flex items-center gap-[12px]">
                <span className="text-xl">
                  {creating.passwordHash.length >= 8 ? <FaRegCheckCircle /> : <FaRegCircle />}
                </span>
                <p>Минимум 8 символов</p>
              </div>
              <div className="flex items-center gap-[12px]">
                <span className="text-xl">
                  {/[A-ZА-Я]/.test(creating.passwordHash) &&
                  /[a-zа-я]/.test(creating.passwordHash) ? (
                    <FaRegCheckCircle />
                  ) : (
                    <FaRegCircle />
                  )}
                </span>
                <p>Содержит строчные и прописные буквы</p>
              </div>
              <div className="flex items-center gap-[12px]">
                <span className="text-xl">
                  {/[0-9]/.test(creating.passwordHash) ? <FaRegCheckCircle /> : <FaRegCircle />}
                </span>
                <p>Цифра</p>
              </div>
              <div className="flex items-center gap-[12px]">
                <span className="text-xl">
                  {/[!@#$%^&*]/.test(creating.passwordHash) ? (
                    <FaRegCheckCircle />
                  ) : (
                    <FaRegCircle />
                  )}
                </span>
                <p>Один специальный символ !@#$%^&*</p>
              </div>
            </div>
            <div className="flex items-center gap-[20px]">
              <CustomSwitch
                value={creating.isOnlineSender}
                onClick={(value: boolean) => setCreating({ ...creating, isOnlineSender: value })}
              />
              Магазин отправитель МойСклад
            </div>
            {creating.isOnlineSender && (
              <div className="flex flex-col">
                <h3 className="h4">Синхронизация с МойСклад</h3>
                <label className="flex flex-col gap-sm w-full">
                  <p className="font-semibold text-[14px]">Ключ синхронизации</p>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    value={creating.syncKey}
                    onChange={e => setCreating({ ...creating, syncKey: e.target.value })}
                    placeholder="Ключ синхронизации с МойСклад"
                  />
                </label>
              </div>
            )}
            <div className="flex gap-[12px] ml-auto">
              <button
                id="admin-button"
                className="bg-[#20222450_!important]"
                onClick={() => setCreating(null)}
              >
                Отмена
              </button>
              <button id="admin-button" onClick={handleSubmit}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
      {editing && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50">
          <div className="max-h-[90vh] overflow-auto bg-white p-[36px] rounded-[12px] flex flex-col gap-[24px] w-[1100px]">
            <h2 id="h2">Редактировать магазин</h2>
            <label className="flex flex-col gap-sm">
              <p className="font-semibold text-[14px]">Полное название</p>
              <input
                type="text"
                className="admin-input"
                required
                value={editing.name}
                onChange={e => setEditing({ ...editing, name: e.target.value })}
                placeholder="Название магазина"
              />
            </label>
            <label className="flex flex-col gap-sm">
              <p className="font-semibold text-[14px]">Краткое название</p>
              <input
                type="text"
                className="admin-input"
                required
                value={editing.shortName}
                onChange={e => setEditing({ ...editing, shortName: e.target.value })}
                placeholder="Краткое название магазина"
              />
            </label>
            <div className="flex gap-[12px]">
              <label className="flex flex-col gap-sm w-full">
                <p className="font-semibold text-[14px]">Телефон магазина</p>
                <PatternFormat
                  format="+7 (###) ###-##-##"
                  mask="_"
                  className="admin-input"
                  required
                  value={editing.phone}
                  onChange={(e: { target: { value: string } }) =>
                    setEditing({ ...editing, phone: e.target.value })
                  }
                  placeholder="Телефон магазина"
                />
              </label>
              <label className="flex flex-col gap-sm w-full">
                <p className="font-semibold text-[14px]">Email магазина</p>
                <input
                  type="email"
                  className="admin-input"
                  required
                  value={editing.email}
                  onChange={e => setEditing({ ...editing, email: e.target.value })}
                  placeholder="Email магазина"
                />
              </label>
            </div>
            <label className="flex flex-col gap-sm w-full">
              <p className="font-semibold text-[14px]">Пароль магазина</p>
              <div className="relative">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  className="admin-input w-full pr-[40px]"
                  required
                  value={editing.passwordHash}
                  onChange={e => setEditing({ ...editing, passwordHash: e.target.value })}
                  placeholder="Пароль магазина"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-[12px] -translate-y-1/2 text-lg text-gray-500"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </label>
            <div className="flex flex-col gap-[12px]">
              <div className="w-full h-[8px] rounded-[8px] bg-[#EDECEF]">
                <div
                  className={`h-full rounded-[8px] min-w-[20px] w-full transition-all duration-500 ease-ease`}
                  style={{
                    maxWidth: `${(passwordSecurityLevel(editing.passwordHash) / 4) * 100}%`,
                    background:
                      passwordSecurityLevel(editing.passwordHash) === 4
                        ? '#02ba21'
                        : passwordSecurityLevel(editing.passwordHash) == 1
                          ? '#fa0505'
                          : passwordSecurityLevel(editing.passwordHash) == 0
                            ? '#605D67'
                            : '#fac905',
                  }}
                ></div>
              </div>
              <div className="flex items-center gap-[12px]">
                <span className="text-xl">
                  {editing.passwordHash.length >= 8 ? <FaRegCheckCircle /> : <FaRegCircle />}
                </span>
                <p>Минимум 8 символов</p>
              </div>
              <div className="flex items-center gap-[12px]">
                <span className="text-xl">
                  {/[A-ZА-Я]/.test(editing.passwordHash) &&
                  /[a-zа-я]/.test(editing.passwordHash) ? (
                    <FaRegCheckCircle />
                  ) : (
                    <FaRegCircle />
                  )}
                </span>
                <p>Содержит строчные и прописные буквы</p>
              </div>
              <div className="flex items-center gap-[12px]">
                <span className="text-xl">
                  {/[0-9]/.test(editing.passwordHash) ? <FaRegCheckCircle /> : <FaRegCircle />}
                </span>
                <p>Цифра</p>
              </div>
              <div className="flex items-center gap-[12px]">
                <span className="text-xl">
                  {/[!@#$%^&*]/.test(editing.passwordHash) ? <FaRegCheckCircle /> : <FaRegCircle />}
                </span>
                <p>Один специальный символ !@#$%^&*</p>
              </div>
            </div>
            <div className="flex items-center gap-[20px]">
              <CustomSwitch
                value={editing.isOnlineSender}
                onClick={(value: boolean) => setEditing({ ...editing, isOnlineSender: value })}
              />
              Магазин отправитель МойСклад
            </div>
            {editing.isOnlineSender && (
              <div className="flex flex-col">
                <h3 className="h4">Синхронизация с МойСклад</h3>
                <label className="flex flex-col gap-sm w-full">
                  <p className="font-semibold text-[14px]">Ключ синхронизации</p>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    value={editing.syncKey}
                    onChange={e => setEditing({ ...editing, syncKey: e.target.value })}
                    placeholder="Ключ синхронизации с МойСклад"
                  />
                </label>
              </div>
            )}
            <div className="flex gap-[12px] ml-auto">
              <button
                id="admin-button"
                className="bg-[#20222450_!important]"
                onClick={() => setEditing(null)}
              >
                Отмена
              </button>
              <button id="admin-button" onClick={handleUpdate}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
      {deleting && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-[36px] rounded-[12px] flex flex-col gap-[24px] w-[800px]">
            <h2 id="h2">Вы уверены, что хотите удалить магазин {deleting.name}?</h2>
            <div className="flex gap-[12px] ml-auto">
              <button
                id="admin-button"
                className="bg-[#20222450_!important]"
                onClick={() => setDeleting(null)}
              >
                Отмена
              </button>
              <button id="admin-button" className="bg-[#E02844]" onClick={handleDelete}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

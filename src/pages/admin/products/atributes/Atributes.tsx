import styles from './Atributes.module.scss'
import { SeasonAttrCase, TargetGroups, Types, Brands, Colors, SimpleAttributeList } from './items'
import { Sizes, Collections, Lengths, SimpleAttributeType } from './items'
import { useDispatch, useSelector } from 'react-redux'
import { setAttributePage } from '@/app/store/attributePageSlice'
import { FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const Atributes = () => {
  const [opened, setOpened] = useState(false)
  const [simpleAttributes, setSimpleAttributes] = useState<SimpleAttributeType[]>([])
  const [creating, setCreating] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const currentAttribute = useSelector((state: RootState) => state.attributePage)
  const sysComponent = systemAttributes.find(i => i.name === currentAttribute.value)?.component
  const component = currentAttribute.isSystem ? (
    sysComponent
  ) : (
    <SimpleAttributeList id={currentAttribute.id} onDelete={() => deleteSimpleAttribute()} />
  )

  const deleteSimpleAttribute = () => {
    if (simpleAttributes.length > 0) {
      dispatch(
        setAttributePage({
          value: simpleAttributes[0].name,
          id: simpleAttributes[0].id || 0,
          isSystem: false,
        })
      )
    }
  }

  const refetch = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/simple`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res: { data: SimpleAttributeType[] }) =>
        setSimpleAttributes(res.data.sort((a, b) => a.orderNum - b.orderNum))
      )
      .catch(err => console.log(err))
  }

  useEffect(() => refetch(), [])

  const handleAdd = (e: FormEvent) => {
    e.preventDefault()
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { name: creating },
    })
      .then(() => {
        refetch()
        setCreating(null)
        toast.success('Успешно создано')
      })
      .catch(err => console.log(err))
  }

  return (
    <div className={styles.atributes}>
      <h1 id="h1">Характеристики товара</h1>

      <div className={styles.atributes_top}>
        <div className={styles.atributes_menu}>
          {systemAttributes.map(item => (
            <div
              key={item.name}
              onClick={() =>
                dispatch(setAttributePage({ value: item.name, id: 0, isSystem: true }))
              }
              className={`${styles.atributes_menu_item} ${currentAttribute.isSystem && currentAttribute.value === item.name ? styles.atributes_menu_item_active : ''}`}
            >
              <h2>{item.name}</h2>
            </div>
          ))}
        </div>

        <div className={styles.atributes_menu}>
          <div className="relative">
            <p
              style={{ width: '100%', height: '38px' }}
              className={`${styles.atributes_menu_item} ${!currentAttribute.isSystem ? styles.atributes_menu_item_active : ''}`}
              onClick={() => setOpened(!opened)}
            >
              Простые атрибуты
            </p>
            {opened && (
              <div className="absolute top-[calc(100%+20px)] right-[-15px] bg-white p-[15px] rounded-[12px] shadow-[0px_4px_30px_0px_#00000010] flex flex-col gap-[12px]">
                <div className="flex flex-col gap-[10px] max-h-[400px] overflow-y-auto">
                  {simpleAttributes.map(i => (
                    <div
                      key={i.id}
                      className={`bg-[#F9F9F9] cursor-pointer p-[12px] rounded-[12px] w-[240px] ${i.id == currentAttribute.id ? 'bg-[#20222480_!important] text-white' : ''}`}
                      onClick={() => {
                        dispatch(
                          setAttributePage({ value: i.name, id: i?.id || 0, isSystem: false })
                        )
                        setOpened(false)
                      }}
                    >
                      {i.name}
                    </div>
                  ))}
                </div>
                <span className="border-[1px] border-solid border-[#DDE1E6]"></span>
                <button
                  className={`text-[#F9F9F9] cursor-pointer p-[12px] rounded-[12px] w-[240px] bg-[#20222480] text-white text-center`}
                  onClick={() => setCreating('')}
                >
                  Создать атрибут
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {component}

      {creating !== null && (
        <div className={`${styles.modal}`}>
          <form
            className={`w-[700px] max-w-[700px_!important]  ${styles.modal_body}`}
            onSubmit={e => e.preventDefault()}
          >
            <h2 id="h2">Создание простого атрибута</h2>
            <label className={`w-[100%] ${styles.modal_body_label}`}>
              <p>Название</p>
              <input
                autoFocus
                placeholder="Название"
                value={creating}
                onChange={e => setCreating(e.target.value)}
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
              <button id="admin-button" type="submit" onClick={handleAdd}>
                Добавить
              </button>
            </section>
          </form>
        </div>
      )}
    </div>
  )
}

const systemAttributes: {
  id: 0
  name: string
  component: JSX.Element
}[] = [
  { id: 0, name: 'Вид изделия', component: <Types /> },
  { id: 0, name: 'Сезон', component: <SeasonAttrCase /> },
  { id: 0, name: 'Целевая группа', component: <TargetGroups /> },
  { id: 0, name: 'Бренд', component: <Brands /> },
  { id: 0, name: 'Цвет', component: <Colors /> },
  { id: 0, name: 'Размер', component: <Sizes /> },
  { id: 0, name: 'Длина изделия', component: <Lengths /> },
  { id: 0, name: 'Коллекция', component: <Collections /> },
]

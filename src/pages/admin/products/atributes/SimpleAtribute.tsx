import axios from 'axios'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SimpleAttributeItem, SimpleAttributeType } from './items'
import styles from './Atributes.module.scss'
import { toast } from 'react-toastify'
import { HiPlus } from 'react-icons/hi'
import { CustomSwitch } from '../Components/CustomSwitch/switch'
import { CustomSelect } from '../Components/CustomSelect/CustomSelect'

export interface ItemDependency {
  id?: number
  type: 'SHOW' | 'HIDE'
  attributeId: number
  targetAttrId: number
  targetValueId: number
  targetAttr?: {
    id?: number
    name?: string
    isSystem?: boolean
    orderNum?: number
    isFreeValue?: boolean
  }
  targetValue?: {
    id?: number
    value?: string
    attributeId?: number
    meta?: object
  }
}

export const SimpleAtribute = () => {
  const [attribute, setAttribute] = useState<SimpleAttributeType | null>(null)
  const [deletingValue, setDeletingValue] = useState<SimpleAttributeItem | null>(null)
  const [creatingValue, setCreatingValue] = useState<SimpleAttributeItem | null>(null)
  const [showDependency, setShowDependency] = useState<ItemDependency | null | false>(null)
  const [hideDependency, setHideDependency] = useState<ItemDependency | null | false>(null)
  const [attributes, setAttributes] = useState<SimpleAttributeType[] | null>()
  const [depIds, setDepIds] = useState<number[]>([])

  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const refetch = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res: { data: SimpleAttributeType }) => {
        setAttribute(res.data)
      })
      .catch(err => {
        console.log(err)
      })

    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}/dependencies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res: { data: ItemDependency[] }) => {
        const showDep = res.data.find(item => item.type === 'SHOW')
        setShowDependency(showDep || null)
        const hideDep = res.data.find(item => item.type === 'HIDE')
        setHideDependency(hideDep || null)
        setDepIds(res.data.map(item => item?.id || 0))
        console.log(depIds)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getAttributes = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/simple`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res: { data: SimpleAttributeType[] }) => {
        setAttributes(res.data.filter(item => item.id != id))
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    refetch()
    getAttributes()
  }, [id])

  const depChange = (i: number, type: 'SHOW' | 'HIDE') => {
    const attr = attributes?.find(item => item.id == i)
    const firstValue = attr?.values[0]
    const obj = {
      attributeId: Number(id),
      targetAttrId: i,
      targetValueId: firstValue?.id ?? 0,
      targetValue: firstValue,
      targetAttr: attr,
      type,
    }

    type == 'SHOW' ? setShowDependency(obj) : setHideDependency(obj)
  }

  const handleDelete = (e: FormEvent) => {
    e.preventDefault()

    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/values/${deletingValue?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        refetch()
        toast.success('Успешно удалено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setDeletingValue(null)
  }

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()

    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${attribute?.id}/values/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: creatingValue,
    })
      .then(() => {
        refetch()
        setCreatingValue(null)
        toast.success('Успешно добавлено')
      })
      .catch(err => {
        const errorText = err.response.data.message || 'Ошибка получения данных'
        toast.error(errorText)
      })
    setDeletingValue(null)
  }

  const handleSubmit = () => {
    axios(`${import.meta.env.VITE_APP_API_URL}/attributes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        name: attribute?.name,
        orderNum: attribute?.orderNum,
        isFreeValue: attribute?.isFreeValue,
      },
    })
      .then(() => {
        navigate(-1)
        toast.success('Успешно обновлено')
      })
      .catch(err => {
        console.log(err)
      })

    depIds &&
      depIds.map(item =>
        axios(`${import.meta.env.VITE_APP_API_URL}/attributes/dependencies/${item}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).catch(err => {
          console.log(err)
        })
      )

    showDependency &&
      axios(`${import.meta.env.VITE_APP_API_URL}/attributes/dependencies/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
          attributeId: Number(id),
          targetAttrId: showDependency.targetAttrId,
          targetValueId: showDependency.targetValueId,
          type: 'SHOW',
        },
      }).catch(err => {
        console.log(err)
      })

    hideDependency &&
      axios(`${import.meta.env.VITE_APP_API_URL}/attributes/dependencies/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
          attributeId: Number(id),
          targetAttrId: hideDependency.targetAttrId,
          targetValueId: hideDependency.targetValueId,
          type: 'HIDE',
        },
      }).catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="px-[36px] py-[82px] flex flex-col gap-[48px] h-full overflow-y-auto">
      <h1 id="h1">Редактор Атрибута</h1>
      {attribute && (
        <>
          <div className="flex gap-[28px]">
            <label className={`w-[370px] ${styles.modal_body_label}`}>
              <p>Название</p>
              <input type="text" value={attribute?.name} />
            </label>{' '}
            <label className={`w-[370px] ${styles.modal_body_label}`}>
              <p>Порядок сортировки</p>
              <input type="text" value={attribute?.orderNum} placeholder="Порядок" />
            </label>
          </div>
          <div className="flex flex-col gap-[24px]">
            <h3 className="h5">Варианты атрибутов</h3>
            <div className="flex flex-col gap-[12px]">
              {attribute?.values.map(item => (
                <p
                  className="p2 bg-[#F2F3F5] w-fit p-[7px_16px] rounded-[12px] flex items-center gap-[5px] cursor-pointer"
                  onClick={() => setDeletingValue(item)}
                >
                  {item.value} &times;
                </p>
              ))}
              <button
                className="w-fit px-[16px] h-[40px] flex justify-center rounded-[12px] border-solid border-[1px] border-[var(--admin-light-gray)] items-center gap-[5px]"
                onClick={() =>
                  setCreatingValue({
                    value: '',
                    attributeId: attribute?.id || 0,
                  })
                }
              >
                <HiPlus /> Добавить вариант
              </button>
              <div className="flex items-center gap-[12px]">
                <CustomSwitch
                  value={attribute?.isFreeValue || false}
                  onClick={value => setAttribute({ ...attribute, isFreeValue: value })}
                />
                <p
                  onClick={() =>
                    setAttribute({ ...attribute, isFreeValue: !attribute?.isFreeValue })
                  }
                  className="cursor-pointer"
                >
                  Произвольное значение
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[24px]">
            <h5 className="h5">Зависимости</h5>
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center gap-[12px]">
                <CustomSwitch
                  value={showDependency !== null}
                  onClick={value => setShowDependency(value ? false : null)}
                />
                <p
                  onClick={() =>
                    setShowDependency(
                      showDependency == null
                        ? {
                            type: 'SHOW',
                            attributeId: attribute?.id ?? 0,
                            targetAttrId: 0,
                            targetValueId: 0,
                          }
                        : null
                    )
                  }
                  className="text-[16px] cursor-pointer"
                >
                  Задать правило связи
                </p>
              </div>
              <div className="flex items-center gap-[24px]">
                <p className="text-[16px]">Показывать, если в атрибуте</p>
                <CustomSelect
                  showSuggestions={false}
                  className={`w-[180px] ${!showDependency && 'bg-[#8484844D] rounded-[12px]'}`}
                  onChange={id => depChange(id, 'SHOW')}
                  data={
                    attributes
                      ? attributes.map(item => ({
                          id: item.id || 0,
                          value: item.name,
                        }))
                      : [{ id: 0, value: '' }]
                  }
                  value={
                    showDependency
                      ? {
                          id: showDependency?.targetAttrId,
                          value: showDependency?.targetAttr?.name || '',
                        }
                      : null
                  }
                  placeholder=""
                />
                {showDependency != null && showDependency && (
                  <>
                    <p className="text-[16px]">указано</p>
                    <CustomSelect
                      showSuggestions={false}
                      className="w-[180px]"
                      onChange={id =>
                        setShowDependency({
                          ...showDependency,
                          targetValueId: id,
                          targetValue: attributes
                            ?.find(item => item.id == showDependency.targetAttrId)
                            ?.values.find(item => item.id == id),
                        })
                      }
                      data={
                        attributes
                          ? (() => {
                              const found = attributes.find(
                                item => item.id == showDependency.targetAttrId
                              )
                              return found
                                ? found.values.map(item => ({
                                    value: item.value,
                                    id: item.id || 0,
                                  }))
                                : [{ id: 0, value: '' }]
                            })()
                          : [{ id: 0, value: '' }]
                      }
                      value={{
                        id: showDependency?.targetValueId || 0,
                        value: showDependency?.targetValue?.value || '',
                      }}
                      placeholder=""
                    />
                  </>
                )}
              </div>

              <div className="flex items-center gap-[12px]">
                <CustomSwitch
                  value={hideDependency !== null}
                  onClick={value => setHideDependency(value ? false : null)}
                />
                <p
                  onClick={() =>
                    setHideDependency(
                      hideDependency == null
                        ? {
                            type: 'HIDE',
                            attributeId: attribute?.id ?? 0,
                            targetAttrId: 0,
                            targetValueId: 0,
                          }
                        : null
                    )
                  }
                  className="text-[16px] cursor-pointer"
                >
                  Задать правило связи
                </p>
              </div>
              <div className="flex items-center gap-[24px]">
                <p className="text-[16px]">Скрывать, если в атрибуте</p>
                <CustomSelect
                  showSuggestions={false}
                  className={`w-[180px] ${!hideDependency && 'bg-[#8484844D] rounded-[12px]'}`}
                  onChange={id => depChange(id, 'HIDE')}
                  data={
                    attributes
                      ? attributes.map(item => ({
                          id: item.id || 0,
                          value: item.name,
                        }))
                      : [{ id: 0, value: '' }]
                  }
                  value={
                    hideDependency
                      ? {
                          id: hideDependency?.targetAttrId,
                          value: hideDependency?.targetAttr?.name || '',
                        }
                      : null
                  }
                  placeholder=""
                />
                {hideDependency && (
                  <>
                    <p className="text-[16px]">указано</p>
                    <CustomSelect
                      showSuggestions={false}
                      className="w-[180px]"
                      onChange={id =>
                        setHideDependency({
                          ...hideDependency,
                          targetValueId: id,
                          targetValue: attributes
                            ?.find(item => item.id == hideDependency.targetAttrId)
                            ?.values.find(item => item.id == id),
                        })
                      }
                      data={
                        attributes
                          ? (() => {
                              const found = attributes.find(
                                item => item.id == hideDependency.targetAttrId
                              )
                              return found
                                ? found.values.map(item => ({
                                    value: item.value,
                                    id: item.id || 0,
                                  }))
                                : [{ id: 0, value: '' }]
                            })()
                          : [{ id: 0, value: '' }]
                      }
                      value={{
                        id: hideDependency?.targetValueId || 0,
                        value: hideDependency?.targetValue?.value || '',
                      }}
                      placeholder=""
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <section className="ml-auto flex gap-[10px] mt-[20px]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-400 text-white px-[15px] h-[40px] rounded-[12px]"
            >
              Отмена
            </button>
            <button type="button" onClick={handleSubmit} id="admin-button">
              Сохранить
            </button>
          </section>
          {deletingValue && (
            <div className={`${styles.modal} flex p-[10px] `}>
              <form onSubmit={handleDelete} className={styles.modal_body}>
                <h2 id="h2">Вы точно хотите удалить вариант {deletingValue.value}?</h2>

                <section className="ml-auto flex gap-[10px] mt-[20px]">
                  <button
                    type="button"
                    onClick={() => setDeletingValue(null)}
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
          {creatingValue && (
            <div className={`${styles.modal} flex`}>
              <form onSubmit={e => handleCreate(e)} className={styles.modal_body}>
                <h2 id="h2">Добавление варианта атрибута</h2>
                <label className={styles.modal_body_label}>
                  <p>Название</p>
                  <input
                    autoFocus
                    value={creatingValue.value}
                    onChange={e => setCreatingValue({ ...creatingValue, value: e.target.value })}
                    type="text"
                    placeholder={`Название варианта атрибута`}
                  />
                </label>
                <section className="ml-auto flex gap-[10px] mt-[20px]">
                  <button
                    type="button"
                    onClick={() => setCreatingValue(null)}
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
      )}
    </div>
  )
}

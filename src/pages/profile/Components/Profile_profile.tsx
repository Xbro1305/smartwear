import sale from '../../../assets/images/sale.png'
import { NumericFormat, PatternFormat } from 'react-number-format'
import { Link } from 'react-router-dom'
import styles from './Components.module.scss'
import { useEffect, useState } from 'react'
import { FaCheck, FaPen } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import axios from 'axios'
import PvzMapWidget from '@/pages/pvz/PvzMapWidget'
import { InputLabel } from '@/widgets/InputLabel/InputLabel'

interface InitialData {
  surname?: string
  name?: string
  middlename?: string
  birthday?: string
  email?: string
  phone?: string
  gender?: string
  city?: string
  isSubscribed?: boolean
  id?: number
}

export const Profile_profile = () => {
  const getByKey = (key: string) => localStorage.getItem(key) || ''

  const current = 17200
  const next = 30000
  const percent = (current * 100) / next
  const [surname, setSurname] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [prefix, setPrefix] = useState<any>('+7')
  const [middlename, setMiddlename] = useState<string>('')
  const [birthday, setBirthday] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [isProfileEdited, setIsProfileEdited] = useState<boolean>(false)
  const [isEmailConfirmed, setIsEmailConfirmed] = useState<any>('')
  const [isPhoneComfirmed, setIsPhoneConfirmed] = useState<any>('')
  const [isSubscribed, setIsSubscribed] = useState<any>('')
  const [adresses, setAddresses] = useState<any[]>([])
  const [defaultAddress, setDefaultAddress] = useState<any>()
  const [deletingAddress, setDeletingAddress] = useState<any>(false)
  const [emailConfirm, setEmailConfirm] = useState<boolean>(false)
  const [phoneConfirm, setPhoneConfirm] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(30)
  const [code, setCode] = useState<string>()
  const [editingAddress, setEditingAddress] = useState<any>(false)
  const [initialData, setInitialData] = useState<InitialData>({})
  const baseUrl = 'https://test.maxiscomfort.ru/api'
  const token = getByKey('token')

  const refresh = () => {
    axios(`${baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        const response = res.data
        setSurname(response.surName || '')
        setName(response.name || '')
        setMiddlename(response.middleName || '')
        setEmail(response.email || '')
        setPhone(response.phone || '')
        setGender(response.gender || '')
        setIsSubscribed(response.isSubscribed || '')
        setCity(response.city || '')
        setIsEmailConfirmed(response.isEmailConfirmed || '')
        setIsPhoneConfirmed(response.isPhoneConfirmed || '')
        setAddresses(response.addresses || [])
        setInitialData(response)
        const defaultAddr = response?.addresses?.find((i: any) => i.isDefault)
        setDefaultAddress(defaultAddr)

        if (phone.startsWith('8')) {
          setPrefix('')
        } else {
          setPrefix('+')
        }

        setBirthday(response?.birthday?.split('T')[0] || '')
      })
      .catch(err => console.log(err))
  }

  useEffect(refresh, [])

  const editDefaultAddress = async (adress: any) => {
    if (adress.id == defaultAddress.id)
      return axios(`${baseUrl}/users/update-address/${initialData.id}/${editingAddress.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { isDefault: false },
      })
        .then(() => refresh())
        .catch(err => console.log(err))

    axios(`${baseUrl}/users/set-default-address/${adress.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => refresh())
      .catch(err => {
        console.log(err)
      })
  }

  const handleSubmit = () => {
    const data = {
      surName: surname,
      name,
      middleName: middlename,
      birthday,
      email,
      phone: `${prefix}${phone}`,
      gender,
      city,
      isSubscribed,
    }

    axios(`${baseUrl}/users/update/${initialData.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ''
        )
      ),
    })
      .then(() => {
        refresh()
        !isEmailConfirmed && setEmailConfirm(true)
        !isPhoneComfirmed && setPhoneConfirm(true)
        setIsProfileEdited(false)
      })
      .catch(err => console.log(err))
  }

  const handleConfirmEmail = () => {
    axios(`${baseUrl}/users/request-confirm-email/${initialData.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: { email },
    })
      .then(() => {
        refresh()
        setEmailConfirm(true)
      })
      .catch(err => console.log(err))
  }

  const getCode = () => {
    axios(`${baseUrl}/users/request-confirm-phone/${initialData.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: { phone },
    })
      .then(() => {
        setTimer(30)

        setPhoneConfirm(true)

        const interval = setInterval(() => {
          setTimer(prev => prev - 1)
        }, 1000)

        setTimeout(() => {
          clearInterval(interval)
        }, 30000)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getCodeAgain = () => {
    axios(`${baseUrl}/users/resend-phone-code/${initialData.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: { phone },
    })
      .then(() => {
        setTimer(30)

        setPhoneConfirm(true)

        const interval = setInterval(() => {
          setTimer(prev => prev - 1)
        }, 1000)

        setTimeout(() => {
          clearInterval(interval)
        }, 30000)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleConfirmPhone = () => {
    !isPhoneComfirmed && setIsPhoneConfirmed(!isPhoneComfirmed)

    axios(`${baseUrl}/users/confirm-phone-change/${initialData.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        code,
      },
    })
      .then(() => refresh())
      .catch(err => console.log(err))
  }

  const deleteAddress = (adress: any) => {
    // setAddresses(prev => prev.filter((_, i) => i !== index))
    // setDeletingAddress(false)

    axios(`${baseUrl}/users/remove-address/${adress.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        refresh()
        setDeletingAddress(false)
      })
      .catch(err => {
        console.log(err)
      })
  }

  // if (isLoading) return <div>Загрузка...</div>

  return (
    <>
      <h1 className={`${styles.profile_title} h2`}>Мой профиль</h1>
      <div className={styles.profile}>
        <div className={styles.profile_top}>
          <h5 className={`${styles.profile_top_title} h3`}>
            {surname} {name} {middlename}
          </h5>
          <span style={{ color: 'var(--service)' }} className="p2">
            Совершайте покупки и мы вернем вам от 3 до 15% стоимости заказа
          </span>
          <div className={styles.profile_top_sale}>
            <img alt={'sale'} src={sale} />
            <h3 className="h3">Ваша скидка 5%</h3>
            <div className={styles.profile_top_sale_bottom}>
              <div className={styles.profile_top_sale_bottom_process}>
                <p>
                  Куплено товаров на сумму {current} ₽ / {next} ₽
                </p>
                <div className={styles.profile_top_sale_bottom_process_line}>
                  <div style={{ width: `${percent}%` }}></div>
                </div>
              </div>
              <Link to={'/discount-program'} style={{ color: 'var(--red)' }}>
                Подробнее
              </Link>
            </div>
          </div>
          <div className={styles.profile_top_orders_info}>
            <div className={styles.profile_top_orders_info_item}>
              <p className="p2">Вы сэкономили</p>
              <NumericFormat
                className="h5"
                value={1322}
                thousandSeparator=" "
                suffix=" ₽"
                displayType="text"
              />
            </div>
            <div className={styles.profile_top_orders_info_item}>
              <p className="p2">Всего потратили</p>
              <NumericFormat
                className="h5"
                value={435}
                thousandSeparator=" "
                suffix=" ₽"
                displayType="text"
              />
            </div>
            <div className={styles.profile_top_orders_info_item}>
              <p className="p2">Заказали товаров</p>
              <NumericFormat className="h5" value={15} thousandSeparator=" " displayType="text" />
            </div>
          </div>
        </div>
        <div className={styles.profile_personality}>
          <h5 className="h5">Контактные данные</h5>
          <form className={styles.profile_form}>
            <InputLabel
              value={name}
              onChange={e => {
                const value = e.target.value
                setName(value)
                initialData.name != value ? setIsProfileEdited(true) : setIsProfileEdited(false)
              }}
              title="Имя"
              required={true}
              name={'name'}
            />
            <InputLabel
              value={surname}
              onChange={e => {
                const value = e.target.value
                setSurname(value)
                initialData.surname != value ? setIsProfileEdited(true) : setIsProfileEdited(false)
              }}
              name={'surname'}
              title="Фамилия"
              required={true}
            />
            {/* <label
              className={`${styles.profile_form_label} ${middlename.length ? styles.profile_form_label_active : ''}`}
            >
              <p>Отчество</p>
              <input
                value={middlename}
                onChange={e => setMiddlename(e.target.value)}
                name={'patronomic'}
                type={'text'}
              />
            </label> */}
            <InputLabel
              title={'Отчество'}
              onChange={e => {
                const value = e.target.value
                setMiddlename(value)
                initialData.middlename != value
                  ? setIsProfileEdited(true)
                  : setIsProfileEdited(false)
              }}
              value={middlename}
              name={'middlename'}
            />
            <label className={`${styles.profile_form_label} ${styles.profile_form_label_active}`}>
              <p>Дата рождения</p>
              <input
                type="text"
                value={birthday}
                onChange={e => {
                  const value = e.target.value
                  setBirthday(value)
                  initialData.birthday != value
                    ? setIsProfileEdited(true)
                    : setIsProfileEdited(false)
                }}
                placeholder="дд.мм.гггг"
                onFocus={e => (e.target.type = 'date')}
                onBlur={e => (e.target.type = 'text')}
              />
            </label>
            <div className={styles.profile_form_gender}>
              <h6 className="h6">Пол</h6>
              <label className={styles.profile_form_gender_label}>
                <input
                  type="radio"
                  value="male"
                  name="gender"
                  checked={gender == 'male'}
                  onChange={e => {
                    const value = e.target.value
                    setGender(value)
                    initialData.gender != value
                      ? setIsProfileEdited(true)
                      : setIsProfileEdited(false)
                  }}
                  className="radio"
                />
                <p className="p2">Мужской</p>
              </label>
              <label className={styles.profile_form_gender_label}>
                <input
                  type="radio"
                  value="female"
                  name="gender"
                  checked={gender == 'female'}
                  onChange={e => {
                    const value = e.target.value
                    setGender(value)
                    initialData.gender != value
                      ? setIsProfileEdited(true)
                      : setIsProfileEdited(false)
                  }}
                  className="radio"
                />
                <p className="p2">Женский</p>
              </label>
            </div>
            <div className={styles.profile_form_email_label}>
              <label
                style={{
                  border: `1px solid ${isEmailConfirmed ? 'var(--green)' : 'var(--red)'}`,
                }}
                className={`${styles.profile_form_label} ${email.length ? styles.profile_form_label_active : ''} ${isEmailConfirmed ? styles.profile_form_label_confirmed : styles.profile_form_label_not_confirmed}`}
              >
                <p>E-mail</p>
                <input
                  value={email}
                  onChange={e => {
                    const value = e.target.value
                    setEmail(value)
                    initialData.email != value
                      ? setIsProfileEdited(true)
                      : setIsProfileEdited(false)
                  }}
                  name={'email'}
                  type={'email'}
                />
                <span
                  style={{
                    border: `2px solid ${isEmailConfirmed ? 'var(--green)' : 'var(--red)'}`,
                    borderRadius: '50%',
                    color: `${isEmailConfirmed ? 'var(--green)' : 'var(--red)'}`,
                  }}
                >
                  {isEmailConfirmed ? <FaCheck /> : <IoClose />}
                </span>
              </label>
              <p
                onClick={handleConfirmEmail}
                style={{
                  color: isEmailConfirmed ? 'var(--green)' : 'var(--red)',
                  textDecoration: isEmailConfirmed ? '' : 'underline',
                }}
              >
                {isEmailConfirmed ? 'Подтвержден' : 'Подтвердить почту'}
              </p>
            </div>
            <div className={styles.profile_form_email_label}>
              <label
                style={{
                  border: `1px solid ${isPhoneComfirmed ? 'var(--green)' : 'var(--red)'}`,
                }}
                className={`${styles.profile_form_label} ${email.length ? styles.profile_form_label_active : styles.profile_form_label_active} ${isPhoneComfirmed ? styles.profile_form_label_confirmed : styles.profile_form_label_not_confirmed}`}
              >
                <p>Номер телефона</p>
                <section className={styles.profile_form_phonesect}>
                  <i>{prefix}</i>
                  <PatternFormat
                    format={'# (###) ### ##-##'}
                    mask={'X'}
                    name={'phone'}
                    onChange={(e: any) => {
                      if (e.target.value.split('')[0] == 9) {
                        setPhone('+7' + e.target.value)
                        setPrefix('+')
                      } else if (e.target.value.split('')[0] == 8) {
                        setPrefix('')
                      } else if (e.target.value.split('')[0] == 7) {
                        setPrefix('+')
                      } else {
                        setPhone('+79' + e.target.value)
                        setPrefix('+')
                      }

                      const value = e.target.value
                      initialData.phone != value
                        ? setIsProfileEdited(true)
                        : setIsProfileEdited(false)
                    }}
                    value={phone}
                    style={{ paddingLeft: prefix == '+7' ? '30px' : '15px' }}
                  />
                </section>
                <span
                  style={{
                    border: `2px solid ${isPhoneComfirmed ? 'var(--green)' : 'var(--red)'}`,
                    borderRadius: '50%',
                    color: `${isPhoneComfirmed ? 'var(--green)' : 'var(--red)'}`,
                  }}
                >
                  {isPhoneComfirmed ? <FaCheck /> : <IoClose />}
                </span>
              </label>
              <p
                onClick={() => (!isPhoneComfirmed ? getCode() : '')}
                style={{
                  color: isPhoneComfirmed ? 'var(--green)' : 'var(--red)',
                  textDecoration: isPhoneComfirmed ? '' : 'underline',
                }}
              >
                {isPhoneComfirmed ? 'Подтвержден' : 'Подтвердить'}
              </p>
            </div>
            <label className={styles.profile_form_confirmLabel}>
              <input
                checked={isSubscribed}
                onChange={(e: any) => {
                  const value = e.target.checked
                  setIsSubscribed(value)
                  initialData.isSubscribed != value
                    ? setIsProfileEdited(true)
                    : setIsProfileEdited(false)
                }}
                className="checkbox"
                type={'checkbox'}
              />
              <p style={{ width: '100%' }} className="p2">
                Получать информацию о скидках, новинках и выгодных предложениях
              </p>
            </label>

            {isProfileEdited && (
              <div className={styles.profile_form_edited}>
                <button className="button" type="button" onClick={handleSubmit}>
                  Сохранить изменения
                </button>
                <button
                  className="button"
                  type="button"
                  style={{ background: 'none', color: 'var(--dark-gray)' }}
                  onClick={() => {
                    refresh()
                    setIsProfileEdited(false)
                  }}
                >
                  Отмена
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className={styles.profile_addresses}>
        {adresses && defaultAddress && (
          <>
            <h5 className="h5">Адрес по умолчанию</h5>
            <div className={styles.profile_addresses_item}>
              <button onClick={() => setDeletingAddress(defaultAddress)}>
                <IoClose />
              </button>
              <p className="p2">{defaultAddress?.fullAddress}</p>
              <button onClick={() => setEditingAddress(defaultAddress)}>
                <FaPen />
              </button>
            </div>
          </>
        )}

        <h5 className="h5">Список всех адресов</h5>

        {adresses &&
          adresses.map((adress, index) => (
            <div key={index} className={styles.profile_addresses_item}>
              <button onClick={() => setDeletingAddress(adress)}>
                <IoClose />
              </button>
              <p className="p2">{adress?.fullAddress}</p>
              <button onClick={() => setEditingAddress(adress)}>
                <FaPen />
              </button>
            </div>
          ))}

        <PvzMapWidget
          isEditing={false}
          onSelect={pvz => {
            const requestData = {
              fullAddress: pvz.location?.address_full,
              longitude: String(pvz.location.longitude),
              latitude: String(pvz.location.latitude),
              type: pvz.type,
              city: pvz.location.city,
              apartment: pvz.apartment,
              intercom: pvz.intercom,
              floor: pvz.floor,
              entrance: pvz.entrance,
              comment: pvz.comment,
            }

            // Удаляем пустые поля
            const filteredData = Object.fromEntries(
              Object.entries(requestData).filter(([_, value]) => value)
            )

            axios(`${baseUrl}/users/add-address/${initialData.id}`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              data: filteredData,
            })
              .then(async res => {
                const data = res
                axios(`${baseUrl}/users/me`, {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then(res => {
                    const response = res.data
                    setCity(response.city || '')
                    setAddresses(response.addresses || [])
                    setInitialData(response)
                    const defaultAddr = response?.addresses?.find((i: any) => i.isDefault)
                    setDefaultAddress(defaultAddr)

                    const editing = response.addresses.find(
                      (i: any) => i.fullAddress == data.data.fullAddress
                    )

                    console.log(response.addresses, data)

                    setEditingAddress(editing)
                  })
                  .catch(err => console.log(err))
              })
              .catch(err => console.log(err))
          }}
        />
      </div>
      <div
        className={`${styles.profile_modal} ${styles.profile_modal_deleteAddress}`}
        style={{ display: deletingAddress ? 'flex' : 'none' }}
      >
        <div className={styles.profile_modal_body}>
          <h3 className="h3">Удаление адреса</h3>
          <p className="p1">
            Вы точно хотите удалить выбранный адрес? Отменить действие будет невозможно
          </p>
          <button
            className="button"
            onClick={() => {
              deletingAddress !== null && deleteAddress(deletingAddress)
            }}
          >
            Удалить
          </button>
          <button
            className={styles.profile_modal_body_closeButton}
            onClick={() => setDeletingAddress(false)}
          >
            <IoClose />
          </button>
        </div>
      </div>
      <div
        className={`${styles.profile_modal}`}
        style={{ display: emailConfirm ? 'flex' : 'none' }}
      >
        <div className={styles.profile_modal_body}>
          <h3 className="h3">Подтверждение email</h3>
          <p className="p1">
            Мы отправили письмо с подтверждением на {email}. Перейдите по ссылке в письме.
          </p>
          <button className="button" onClick={() => setEmailConfirm(false)}>
            Хорошо
          </button>
          <button
            className={styles.profile_modal_body_closeButton}
            onClick={() => setEmailConfirm(false)}
          >
            <IoClose />
          </button>
        </div>
      </div>
      <div
        className={`${styles.profile_modal} ${styles.profile_phone_modal}`}
        style={{ display: phoneConfirm ? 'flex' : 'none' }}
      >
        <div className={styles.profile_modal_body}>
          <h3 className="h3">Подтверждение телефона</h3>
          <p className="p1">
            На ваш номер придёт сообщение с кодом. <br />
            <button onClick={() => timer == 0 && getCodeAgain()}>
              Отправить повторно {timer ? `через ${timer}` : ''}
            </button>
          </p>
          <label>
            <p className="p2" style={{ color: 'var(--service)' }}>
              Введите смс код
            </p>
            <PatternFormat
              value={code}
              onChange={(e: any) => setCode(e.target.value)}
              format="#####"
              mask={'_'}
              allowEmptyFormatting
            />
          </label>
          <button className="button" onClick={handleConfirmPhone}>
            Отправить
          </button>
          <button
            className={styles.profile_modal_body_closeButton}
            onClick={() => setPhoneConfirm(false)}
          >
            <IoClose />
          </button>
        </div>
      </div>
      <div
        className={`${styles.profile_modal}`}
        style={{ display: editingAddress ? 'flex' : 'none' }}
      >
        <div className={styles.profile_modal_body}>
          <h3 className="h3">Адрес доставки</h3>
          {editingAddress !== false && <p className="p1">{editingAddress?.fullAddress}</p>}

          <label onClick={() => editDefaultAddress(editingAddress)} style={{ cursor: 'pointer' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                checked={
                  editingAddress !== false &&
                  defaultAddress?.fullAddress == editingAddress?.fullAddress
                }
                onChange={() => console.log('ok')}
                type="checkbox"
                className="checkbox"
                style={{ border: 'none' }}
              />
              Адрес по умолчанию
            </p>
          </label>
          <section>
            <button className="button" onClick={() => setEditingAddress(false)}>
              Сохранить
            </button>
            {editingAddress && (
              <PvzMapWidget
                isEditing={true}
                lat={Number(editingAddress.latitude)}
                long={Number(editingAddress.longitude)}
                type={editingAddress?.type}
                comment={editingAddress?.comment}
                intercom={editingAddress?.intercom}
                apartment={editingAddress?.apartment}
                floor={editingAddress?.floor}
                deliveryAddr={editingAddress.fullAddress}
                entrance={editingAddress.entrance}
                onSelect={pvz => {
                  const requestData = {
                    type: pvz.type,
                    fullAddress: pvz.location?.address_full,
                    longitude: String(pvz.location.longitude),
                    latitude: String(pvz.location.latitude),
                    city: pvz.location.city,
                    apartment: pvz.apartment,
                    intercom: pvz.intercom,
                    floor: pvz.floor,
                    entrance: pvz.entrance,
                    comment: pvz.comment,
                  }

                  // Удаляем пустые поля
                  const filteredData = Object.fromEntries(
                    Object.entries(requestData).filter(([_, value]) => value)
                  )

                  axios(`${baseUrl}/users/update-address/${initialData.id}/${editingAddress.id}`, {
                    method: 'PUT',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    data: filteredData,
                  })
                    .then(() => refresh())
                    .catch(err => console.log(err))
                }}
              />
            )}
          </section>
          <button
            className={styles.profile_modal_body_closeButton}
            onClick={() => setEditingAddress(false)}
          >
            <IoClose />
          </button>
        </div>
      </div>
    </>
  )
}

/* eslint-disable react/jsx-key */
/* eslint-disable max-lines */
import { useEffect, useState } from 'react'
import { NumericFormat, PatternFormat } from 'react-number-format'
import { Link } from 'react-router-dom'

import {
  useConfirmEmailMutation,
  useConfirmPhoneChangeMutation,
  useGetMeQuery,
  useRequestEmailConfirmationMutation,
} from '@/entities/auth'
import { FaCheck, FaPen } from 'react-icons/fa'
//import { FaCheck, FaPen } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

import styles from './Components.module.scss'

import sale from '../../../assets/images/sale.png'

export const Profile_profile = () => {
  const { data: userData, isLoading } = useGetMeQuery()
  const [confirmEmail] = useRequestEmailConfirmationMutation()
  const [confirmPhoneChange] = useConfirmPhoneChangeMutation()

  const current = 17200
  const next = 30000
  const percent = (current * 100) / next

  const [surname, setSurname] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [middlename, setMiddlename] = useState<string>('')
  const [birthday, setBirthday] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [isProfileEdited, setIsProfileEdited] = useState<boolean>(false)
  const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(false)
  const [isPhoneConfirmed, setIsPhoneConfirmed] = useState<boolean>(false)
  const [notifications, setNotifications] = useState<boolean>(false)
  const [deletingAddress, setDeletingAddress] = useState<{ index: number } | boolean>(false)
  const [emailConfirm, setEmailConfirm] = useState<boolean>(false)
  const [phoneConfirm, setPhoneConfirm] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(30)
  const [code, setCode] = useState<string>('')
  const [editingAddress, setEditingAddress] = useState<{ index: number } | false>(false)

  const [addresses, setAddresses] = useState(userData?.addresses || [])
  const defaultAddress = userData?.addresses.find(addr => addr.isDefault) || null

  useEffect(() => {
    if (userData) {
      setSurname(userData.surName || '')
      setName(userData.name || '')
      setMiddlename(userData.middleName || '')
      setBirthday(userData.birthday || '')
      setEmail(userData.email || '')
      setPhone(userData.phone || '')
      setGender(userData.gender || '')
      setCity(userData?.defaultAddress?.city || '')
      setIsEmailConfirmed(userData.isEmailConfirmed || false)
      setIsPhoneConfirmed(userData.isPhoneConfirmed || false)
      setNotifications(userData.notifications || false)
    }
  }, [userData])

  useEffect(() => {
    if (!phoneConfirm) {
      return
    }

    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [phoneConfirm])

  const handleConfirmEmail = async () => {
    if (!isEmailConfirmed) {
      try {
        await confirmEmail({ userId: userData?.id as number }).unwrap()
        setIsEmailConfirmed(true)
        setEmailConfirm(true)
      } catch (error) {
        console.error('Ошибка подтверждения email:', error)
      }
    }
  }

  const getCode = () => {
    setTimer(30)
    setPhoneConfirm(true)
  }

  const handleConfirmPhone = async () => {
    if (!isPhoneConfirmed) {
      try {
        await confirmPhoneChange({ code, userId: userData?.id as number }).unwrap()
        setIsPhoneConfirmed(true)
      } catch (error) {
        console.error('Ошибка подтверждения телефона:', error)
      }
    }
  }

  const deleteAddress = (index: number) => {
    setAddresses(prev => prev.filter((_, i) => i !== index))
    setDeletingAddress(false)
  }

  const cancelEditing = () => {
    if (userData) {
      setSurname(userData.surName)
      setName(userData.name)
      setMiddlename(userData.middleName)
      setBirthday(userData.birthday)
      setEmail(userData.email)
      setPhone(userData.phone)
      setGender(userData.gender)
      setNotifications(userData.notifications)
      setCity(userData?.defaultAddress?.city as string)
    }
    setIsProfileEdited(false)
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <>
      <h1 className={`${styles.profile_title} h2`}>Мой профиль</h1>
      <div className={styles.profile}>
        <div className={styles.profile_top}>
          <h5 className={`${styles.profile_top_title} h3`}>
            {surname} {name} {middlename}
          </h5>
          <span className={'p2'} style={{ color: 'var(--service)' }}>
            Совершайте покупки и мы вернем вам от 3 до 15% стоимости заказа
          </span>
          <div className={styles.profile_top_sale}>
            <img alt={'sale'} src={sale} />
            <h3 className={'h3'}>Ваша скидка 5%</h3>
            <div className={styles.profile_top_sale_bottom}>
              <div className={styles.profile_top_sale_bottom_process}>
                <p>
                  Куплено товаров на сумму {current} ₽ / {next} ₽
                </p>
                <div className={styles.profile_top_sale_bottom_process_line}>
                  <div style={{ width: `${percent}%` }}></div>
                </div>
              </div>
              <Link style={{ color: 'var(--red)' }} to={'/discount-program'}>
                Подробнее
              </Link>
            </div>
          </div>
          <div className={styles.profile_top_orders_info}>
            <div className={styles.profile_top_orders_info_item}>
              <p className={'p2'}>Вы сэкономили</p>
              <NumericFormat
                className={'h5'}
                displayType={'text'}
                suffix={' ₽'}
                thousandSeparator={' '}
                value={1322}
              />
            </div>
            <div className={styles.profile_top_orders_info_item}>
              <p className={'p2'}>Всего потратили</p>
              <NumericFormat
                className={'h5'}
                displayType={'text'}
                suffix={' ₽'}
                thousandSeparator={' '}
                value={435}
              />
            </div>
            <div className={styles.profile_top_orders_info_item}>
              <p className={'p2'}>Заказали товаров</p>
              <NumericFormat
                className={'h5'}
                displayType={'text'}
                thousandSeparator={' '}
                value={15}
              />
            </div>
          </div>
        </div>
        <div className={styles.profile_personality}>
          <h5 className={'h5'}>Контактные данные</h5>
          <form className={styles.profile_form}>
            <label
              className={`${styles.profile_form_label} ${name.length ? styles.profile_form_label_active : ''}`}
            >
              <p>Имя</p>
              <input
                name={'name'}
                onChange={e => {
                  const value = e.target.value

                  setName(value)
                  userData?.name != value ? setIsProfileEdited(true) : setIsProfileEdited(false)
                }}
                type={'text'}
                value={name}
              />
            </label>
            <label
              className={`${styles.profile_form_label} ${surname.length ? styles.profile_form_label_active : ''}`}
            >
              <p>Фамилия</p>
              <input
                name={'surname'}
                onChange={e => {
                  const value = e.target.value

                  setSurname(value)
                  userData?.surName != value ? setIsProfileEdited(true) : setIsProfileEdited(false)
                }}
                type={'text'}
                value={surname}
              />
            </label>
            <div className={styles.profile_form_gender}>
              <h6 className={'h6'}>Пол</h6>
              <label className={styles.profile_form_gender_label}>
                <input
                  checked={gender == 'male'}
                  className={'radio'}
                  name={'gender'}
                  onChange={e => {
                    const value = e.target.value

                    setGender(value)
                    userData?.gender != value ? setIsProfileEdited(true) : setIsProfileEdited(false)
                  }}
                  type={'radio'}
                  value={'male'}
                />
                <p className={'p2'}>Мужской</p>
              </label>
              <label className={styles.profile_form_gender_label}>
                <input
                  checked={gender == 'female'}
                  className={'radio'}
                  name={'gender'}
                  onChange={e => {
                    const value = e.target.value

                    setGender(value)
                    userData?.gender != value ? setIsProfileEdited(true) : setIsProfileEdited(false)
                  }}
                  type={'radio'}
                  value={'female'}
                />
                <p className={'p2'}>Женский</p>
              </label>
            </div>
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
            <label className={`${styles.profile_form_label} ${styles.profile_form_label_active}`}>
              <p>Дата рождения</p>
              <input
                name={'birthday'}
                onChange={e => {
                  const value = e.target.value

                  setBirthday(value)
                  userData?.birthday != value ? setIsProfileEdited(true) : setIsProfileEdited(false)
                }}
                type={'date'}
                value={birthday}
              />
            </label>
            <label
              className={`${styles.profile_form_label} ${city.length ? styles.profile_form_label_active : ''}`}
            >
              <p>Город</p>
              <input
                name={'city'}
                onChange={e => {
                  const value = e.target.value

                  setCity(value)
                  userData?.defaultAddress?.city != value
                    ? setIsProfileEdited(true)
                    : setIsProfileEdited(false)
                }}
                type={'text'}
                value={city}
              />
            </label>
            <div className={styles.profile_form_email_label}>
              <label
                className={`${styles.profile_form_label} ${email.length ? styles.profile_form_label_active : ''} ${isEmailConfirmed ? styles.profile_form_label_confirmed : styles.profile_form_label_not_confirmed}`}
                style={{
                  border: `1px solid ${isEmailConfirmed ? 'var(--green)' : 'var(--red)'}`,
                }}
              >
                <p>E-mail</p>
                <input
                  name={'email'}
                  onChange={e => {
                    const value = e.target.value

                    setEmail(value)
                    userData?.email != value ? setIsProfileEdited(true) : setIsProfileEdited(false)
                  }}
                  type={'email'}
                  value={email}
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
                className={`${styles.profile_form_label} ${email.length ? styles.profile_form_label_active : ''} ${isPhoneConfirmed ? styles.profile_form_label_confirmed : styles.profile_form_label_not_confirmed}`}
                style={{
                  border: `1px solid ${isPhoneConfirmed ? 'var(--green)' : 'var(--red)'}`,
                }}
              >
                <p>Номер телефона</p>
                <PatternFormat
                  format={'+7 (###) ### ##-##'}
                  mask={'X'}
                  name={'phone'}
                  onChange={(e: any) => {
                    const value = e.target.value

                    setPhone(value)
                    userData?.phone != value ? setIsProfileEdited(true) : setIsProfileEdited(false)
                  }}
                  placeholder={' '}
                  value={phone}
                />{' '}
                <span
                  style={{
                    border: `2px solid ${isPhoneConfirmed ? 'var(--green)' : 'var(--red)'}`,
                    borderRadius: '50%',
                    color: `${isPhoneConfirmed ? 'var(--green)' : 'var(--red)'}`,
                  }}
                >
                  {isPhoneConfirmed ? <FaCheck /> : <IoClose />}
                </span>
              </label>
              <p
                onClick={getCode}
                style={{
                  color: isPhoneConfirmed ? 'var(--green)' : 'var(--red)',
                  textDecoration: isPhoneConfirmed ? '' : 'underline',
                }}
              >
                {isPhoneConfirmed ? 'Подтвержден' : 'Подтвердить'}
              </p>
            </div>
            <label className={styles.profile_form_confirmLabel}>
              <input
                checked={notifications}
                className={'checkbox'}
                onChange={(e: any) => {
                  const value = e.target.checked

                  setNotifications(value)
                  userData?.notifications != value
                    ? setIsProfileEdited(true)
                    : setIsProfileEdited(false)
                }}
                type={'checkbox'}
              />
              <p className={'p2'} style={{ width: '100%' }}>
                Получать информацию о скидках, новинках и выгодных предложениях
              </p>
            </label>

            {isProfileEdited && (
              <div className={styles.profile_form_edited}>
                <button className={'button'} onClick={handleSubmit} type={'button'}>
                  Сохранить изменения
                </button>
                <button
                  className={'button'}
                  onClick={cancelEditing}
                  style={{ background: 'none', color: 'var(--dark-gray)' }}
                  type={'button'}
                >
                  Отмена
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className={styles.profile_addresses}>
        {addresses && addresses[0] && (
          <>
            <h5 className={'h5'}>Адрес по умолчанию</h5>
            <div className={styles.profile_addresses_item}>
              <button onClick={() => setDeletingAddress({ index: defaultAddress?.id })}>
                <IoClose />
              </button>
              <p className={'p2'}>{addresses[0]?.fullAddress}</p>
              <button onClick={() => setEditingAddress({ index: defaultAddress })}>
                <FaPen />
              </button>
            </div>
          </>
        )}

        <h5 className={'h5'}>Список всех адресов</h5>

        {addresses &&
          addresses.map((adress, index) => (
            <div className={styles.profile_addresses_item}>
              <button onClick={() => setDeletingAddress({ index })}>
                <IoClose />
              </button>
              <p className={'p2'}>{adress?.fullAddress}</p>
              <button onClick={() => setEditingAddress({ index })}>
                <FaPen />
              </button>
            </div>
          ))}

        <button className={'p2'}> + Добавить адрес доставки</button>
      </div>
      <div
        className={`${styles.profile_modal} ${styles.profile_modal_deleteAddress}`}
        style={{ display: deletingAddress ? 'flex' : 'none' }}
      >
        <div className={styles.profile_modal_body}>
          <h3 className={'h3'}>Удаление адреса</h3>
          <p className={'p1'}>
            Вы точно хотите удалить выбранный адрес? Отменить действие будет невозможно
          </p>
          <button
            className={'button'}
            onClick={() => {
              typeof deletingAddress === 'object' &&
                deletingAddress !== null &&
                deleteAddress(deletingAddress.index)
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
      </div>{' '}
      <div
        className={`${styles.profile_modal}`}
        style={{ display: emailConfirm ? 'flex' : 'none' }}
      >
        <div className={styles.profile_modal_body}>
          <h3 className={'h3'}>Подтверждение email</h3>
          <p className={'p1'}>
            Мы отправили письмо с подтверждением на {email}. Перейдите по ссылке в письме.
          </p>
          <button className={'button'} onClick={() => setEmailConfirm(false)}>
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
        className={`${styles.profile_modal}`}
        style={{ display: phoneConfirm ? 'flex' : 'none' }}
      >
        <div className={styles.profile_modal_body}>
          <h3 className={'h3'}>Подтверждение телефона</h3>
          <p className={'p1'}>
            На ваш номер придёт сообщение с кодом. <br />
            <button onClick={() => timer == 0 && getCode()}>
              Отправить повторно {timer ? `через ${timer}` : ''}
            </button>
          </p>
          <label>
            <p className={'p2'} style={{ color: 'var(--service)' }}>
              Введите смс код
            </p>
            <PatternFormat
              allowEmptyFormatting
              format={'#####'}
              mask={'_'}
              onChange={(e: any) => setCode(e.target.value)}
              value={code}
            />
          </label>
          <button className={'button'} onClick={handleConfirmPhone}>
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
          <h3 className={'h3'}>Адрес доставки</h3>
          {editingAddress !== false && (
            <p className={'p1'}>{addresses[editingAddress.index]?.fullAddress}</p>
          )}

          <label
            onClick={() => editingAddress !== false && editDefaultAddress(editingAddress.index)}
            style={{ cursor: 'pointer' }}
          >
            <p style={{ alignItems: 'center', display: 'flex', gap: '10px' }}>
              <input
                checked={editingAddress !== false && defaultAddress == editingAddress.index}
                className={'checkbox'}
                style={{ border: 'none' }}
                type={'checkbox'}
              />
              Адрес по умолчанию
            </p>
          </label>
          <section>
            <button className={'button'} onClick={() => setEditingAddress(false)}>
              Сохранить
            </button>
            <button className={'button'} style={{ background: 'var(--dark)', marginLeft: '20px' }}>
              Изменить адрес
            </button>
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

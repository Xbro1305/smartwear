import { FormEvent, useState } from 'react'
import { PatternFormat } from 'react-number-format'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import {
  useConfirmRegistrationMutation,
  useRegisterMutation,
  useRequestCodeMutation,
} from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { enqueueSnackbar } from 'notistack'

import styles from '../Signup.module.scss'

interface FormData {
  code?: string
  email?: string
  isSubscribed?: boolean
  name?: string
  patronomic?: string
  phone?: string
  surname?: string
}

export const SignUpPage: React.FC = () => {
  const [cb, setCb] = useState<boolean>(false)
  const [stage, setStage] = useState<number>(1)
  const [timer, setTimer] = useState<number>(30)
  const [data, setData] = useState<FormData>({})
  const navigate = useNavigate()

  const [register] = useRegisterMutation()
  const [confirmRegister] = useConfirmRegistrationMutation()
  const [request] = useRequestCodeMutation()

  const handleRequest = () => {
    request({ phone: data.phone as string })
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const value = Object.fromEntries(formData) as FormData

    setData(value)

    const registerData = {
      email: value.email as string,
      isSubscribed: cb,
      middleName: value.patronomic as string,
      name: value.name as string,
      phone: value.phone as string,
      surName: value.surname as string,
    }

    try {
      await register(registerData).unwrap()
      setStage(2)
      let tm = 30
      const interval = setInterval(() => {
        tm -= 1
        setTimer(tm)
      }, 1000)

      setTimeout(() => clearInterval(interval), 30000)
    } catch (error) {
      enqueueSnackbar('Ошибка при регистрации', {
        variant: 'error',
      })
    }
  }

  const handleConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const value = Object.fromEntries(formData) as FormData

    if (value.code?.includes('-')) {
      return enqueueSnackbar('Неправильный код', {
        variant: 'error',
      })
    }

    confirmRegister({ code: value.code!, phone: data.phone! })
      .unwrap()
      .then(() => {
        enqueueSnackbar('Вы успешно зарегистрировались', {
          variant: 'success',
        })
        navigate('/sign-in')
      })
      .catch(() => {
        enqueueSnackbar('Ошибка при подтверждении регистрации', {
          variant: 'error',
        })
      })
  }

  return (
    <div className={styles.signup}>
      {stage === 1 && (
        <form className={styles.signup_form} onSubmit={handleRegister}>
          <h1 className={styles.signup_form_h1}>Регистрация</h1>
          <label className={styles.signup_form_label}>
            <p>
              Фамилия <span style={{ color: 'red' }}>*</span>
            </p>
            <input name={'surname'} required type={'text'} />
          </label>
          <label className={styles.signup_form_label}>
            <p>
              Имя <span style={{ color: 'red' }}>*</span>
            </p>
            <input name={'name'} required type={'text'} />
          </label>
          <label className={styles.signup_form_label}>
            <p>Отчество</p>
            <input name={'patronomic'} type={'text'} />
          </label>
          <label className={styles.signup_form_label}>
            <p>Номер телефона</p>
            <PatternFormat
              allowEmptyFormatting
              format={'+7 (###) ### ##-##'}
              mask={'_'}
              name={'phone'}
            />
          </label>
          <label className={styles.signup_form_label}>
            <p>
              E-mail <span style={{ color: 'red' }}>*</span>
            </p>
            <input name={'email'} required type={'email'} />
          </label>
          <label className={styles.signup_form_confirmLabel}>
            <input onChange={() => setCb(!cb)} type={'checkbox'} />
            <p>Получать информацию о новинках и распродажах</p>
          </label>
          <h3 className={styles.signup_form_confirm}>
            Продолжив регистрацию, я соглашаюсь с{' '}
            <Link to={ROUTER_PATHS.POLITICS}>политикой конфиденциальности</Link> и{' '}
            <Link to={ROUTER_PATHS.OFERTA}>публичной офертой</Link>
          </h3>
          <button type="submit" className={styles.signup_form_button}>
            Продолжить
          </button>
          <h2 className={styles.signup_form_link}>
            Уже есть аккаунт? <Link to={ROUTER_PATHS.SIGN_IN}>Войти</Link>
          </h2>
        </form>
      )}

      {stage === 2 && (
        <form className={styles.signup_form} onSubmit={handleConfirm}>
          <h1 className={styles.signup_form_h1}>Регистрация</h1>
          <p className={styles.signup_form_againButton}>
            На ваш номер придёт сообщение с кодом.
            <button className={styles.signup_form_againButton} onClick={() => handleRequest()}>
              Отправить повторно {timer !== 0 ? 'через ' + timer : ''}
            </button>
          </p>
          <label className={styles.signup_form_label}>
            <p>Введите смс код</p>
            <PatternFormat
              allowEmptyFormatting
              format={'#####'}
              mask={'_'}
              name={'code'}
              required
            />
          </label>
          <button type="submit" className={styles.signup_form_button}>
            Перейти в личный кабинет
          </button>
        </form>
      )}
    </div>
  )
}

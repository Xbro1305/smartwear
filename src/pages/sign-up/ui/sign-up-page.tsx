import { useState, FormEvent } from 'react'
import styles from '../Signup.module.scss'
import { PatternFormat } from 'react-number-format'
import { enqueueSnackbar } from 'notistack'
import { useRegisterMutation, useConfirmRegistrationMutation } from '@/entities/auth'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ROUTER_PATHS } from '@/shared/config/routes'

interface FormData {
  surname?: string
  name?: string
  patronomic?: string
  phone?: string
  email?: string
  code?: string
  isSubscribed?: boolean
}

export const SignUpPage: React.FC = () => {
  const [cb, setCb] = useState<boolean>(false)
  const [stage, setStage] = useState<number>(1)
  const [timer, setTimer] = useState<number>(30)
  const [data, setData] = useState<FormData>({})
  const navigate = useNavigate()

  const [register] = useRegisterMutation()
  const [confirmRegister] = useConfirmRegistrationMutation()

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const value = Object.fromEntries(formData) as FormData
    setData(value)

    const registerData = {
      surName: value.surname as string,
      name: value.name as string,
      middleName: value.patronomic as string,
      phone: value.phone as string,
      email: value.email as string,
      isSubscribed: cb,
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

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const value = Object.fromEntries(formData) as FormData

    if (value.code?.includes('-')) {
      return enqueueSnackbar('Неправильный код', {
        variant: 'error',
      })
    }

    try {
      await confirmRegister({ phone: data.phone!, code: value.code! }).unwrap()
      enqueueSnackbar('Вы успешно зарегистрировались', {
        variant: 'success',
      })
      navigate(ROUTER_PATHS.SIGN_IN)
    } catch (error) {
      enqueueSnackbar('Ошибка при подтверждении регистрации', {
        variant: 'error',
      })
    }
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
            <input type="text" name="surname" required />
          </label>
          <label className={styles.signup_form_label}>
            <p>
              Имя <span style={{ color: 'red' }}>*</span>
            </p>
            <input type="text" name="name" required />
          </label>
          <label className={styles.signup_form_label}>
            <p>Отчество</p>
            <input type="text" name="patronomic" />
          </label>
          <label className={styles.signup_form_label}>
            <p>Номер телефона</p>
            <PatternFormat format="+7 (###) ### ##-##" allowEmptyFormatting mask="_" name="phone" />
          </label>
          <label className={styles.signup_form_label}>
            <p>
              E-mail <span style={{ color: 'red' }}>*</span>
            </p>
            <input type="email" name="email" required />
          </label>
          <label className={styles.signup_form_confirmLabel}>
            <input type="checkbox" onChange={() => setCb(!cb)} />
            <p>Получать информацию о новинках и распродажах</p>
          </label>
          <h3 className={styles.signup_form_confirm}>
            Продолжив регистрацию, я соглашаюсь с{' '}
            <Link to={ROUTER_PATHS.POLITICS}>политикой конфиденциальности</Link> и{' '}
            <Link to={ROUTER_PATHS.OFERTA}>публичной офертой</Link>
          </h3>
          <button className={styles.signup_form_button}>Продолжить</button>
          <h2 className={styles.signup_form_link}>
            Уже есть аккаунт? <Link to={ROUTER_PATHS.SIGN_IN}>Войти</Link>
          </h2>
        </form>
      )}

      {stage === 2 && (
        <form onSubmit={handleConfirm} className={styles.signup_form}>
          <h1 className={styles.signup_form_h1}>Регистрация</h1>
          <p className={styles.signup_form_againButton}>
            На ваш номер придёт сообщение с кодом.
            <button className={styles.signup_form_againButton}>
              Отправить повторно {timer !== 0 ? 'через ' + timer : ''}
            </button>
          </p>
          <label className={styles.signup_form_label}>
            <p>Введите смс код</p>
            <PatternFormat format="### ###" allowEmptyFormatting mask="-" name="code" required />
          </label>
          <button className={styles.signup_form_button}>Перейти в личный кабинет</button>
        </form>
      )}
    </div>
  )
}

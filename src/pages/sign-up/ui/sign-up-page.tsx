import { FormEvent, useEffect, useState } from 'react'
import { PatternFormat } from 'react-number-format'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import {
  useConfirmRegistrationMutation,
  useRegisterMutation,
  useRequestCodeMutation,
} from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'

import styles from '../Signup.module.scss'

interface FormData {
  code?: string
  email?: string
  isSubscribed?: boolean
  name?: string
  patronomic?: string
  phone?: string
  surname?: string
  prefix?: string
}

const RESEND_SECONDS = 30

/**
 * Приводит любой ввод к десяти национальным цифрам.
 * Номер могут вставить как +7 926…, 8 926… или 926… —
 * значимы всегда последние десять цифр.
 */
function toNational(input: string): string {
  let digits = input.replace(/\D/g, '')

  if (digits.length > 10 && (digits.startsWith('7') || digits.startsWith('8'))) {
    digits = digits.slice(1)
  }

  return digits.slice(0, 10)
}

export const SignUpPage: React.FC = () => {
  const [cb, setCb] = useState<boolean>(false)
  const [stage, setStage] = useState<number>(1)
  const [timer, setTimer] = useState<number>(0)
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [data, setData] = useState<FormData>({})
  // Номер из адресной строки читаем один раз при монтировании,
  // а не на каждое нажатие клавиши, как было раньше.
  const [phone, setPhone] = useState<null | string>(() =>
    toNational(new URLSearchParams(window.location.search).get('phone') ?? '')
  )
  const [prefix] = useState<any>('+7')
  const navigate = useNavigate()

  // Получение пути возврата из state или использование "/"

  const [register] = useRegisterMutation()
  const [confirmRegister] = useConfirmRegistrationMutation()
  const [request] = useRequestCodeMutation()

  useEffect(() => {
    if (!expiresAt) return

    let id: ReturnType<typeof setInterval>
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))
      setTimer(remaining)
      if (remaining <= 0) clearInterval(id)
    }

    id = setInterval(tick, 250)
    tick()

    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [expiresAt])

  const handleRequest = () => {
    request({ phone: data.phone as string })
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const value = Object.fromEntries(formData) as FormData

    // В FormData лежит отображаемое значение со скобками и дефисами —
    // нормализуем, чтобы дальше по коду номер был в виде +79261234567.
    const normalizedPhone = '+7' + toNational(value.phone as string)

    setData({ ...value, phone: normalizedPhone })

    const registerData = {
      email: value.email as string,
      isSubscribed: cb,
      middleName: value.patronomic as string,
      name: value.name as string,
      phone: normalizedPhone,
      surName: value.surname as string,
    }

    try {
      await register(registerData).unwrap()
      setStage(2)
      setTimer(RESEND_SECONDS) // чтобы кнопка сразу была disabled, без мигания
      setExpiresAt(Date.now() + RESEND_SECONDS * 1000)
    } catch (error) {
      console.log(error)
    }
  }

  const handleConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const value = Object.fromEntries(formData) as FormData

    if (value.code?.includes('-')) {
      console.log('вы не ввели код')
    }

    confirmRegister({ code: value.code!, phone: data.phone! })
      .unwrap()
      .then(() => {
        navigate('/sign-in')
      })
      .catch(error => {
        console.log(error)
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
            <section className={styles.signup_form_phonesect}>
              <span>{prefix}</span>
              <PatternFormat
                format={'(###) ###-##-##'}
                mask={'_'}
                name={'phone'}
                value={phone ?? ''}
                onValueChange={({ value }) => {
                  // Человек по привычке может начать с 8 или 7 — код страны
                  // уже показан слева, поэтому первую такую цифру не принимаем.
                  if (value.length === 1 && (value === '7' || value === '8')) return
                  setPhone(value)
                }}
                /* Вставленный номер маска обрезала бы по первым десяти символам:
     из «+7 926 123-45-67» получалось бы «7926123456». Разбираем сами. */
                onPaste={e => {
                  e.preventDefault()
                  setPhone(toNational(e.clipboardData.getData('text')))
                }}
                style={{ paddingLeft: '30px' }}
                inputMode={'numeric'}
                autoComplete={'tel'}
              />
            </section>
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
          <button className={styles.signup_form_button} type={'submit'}>
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
              mask={'-'}
              name={'code'}
              required
              autoFocus
            />
          </label>
          <button className={styles.signup_form_button} type={'submit'}>
            Перейти в личный кабинет
          </button>
        </form>
      )}
    </div>
  )
}

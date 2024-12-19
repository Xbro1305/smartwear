import { FormEvent, useState } from 'react'
import { PatternFormat } from 'react-number-format'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { useLoginMutation, useRequestCodeMutation } from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'

import styles from '../../sign-up/Signup.module.scss'

interface FormData {
  code?: string
  phone?: string
}

export const SignInPage: React.FC = () => {
  const [stage, setStage] = useState<number>(1)
  const [timer, setTimer] = useState<number>(30)
  const [phone, setPhone] = useState<null | string>(null)
  // const [data, setData] = useState<FormData>({});
  const navigate = useNavigate()

  const [requestCode] = useRequestCodeMutation()
  const [login] = useLoginMutation()

  const getCode = async (phone: string) => {
    try {
      await requestCode({ phone }).unwrap()
      setStage(2)
      let tm = 30
      const interval = setInterval(() => {
        tm -= 1
        setTimer(tm)
      }, 1000)

      setTimeout(() => clearInterval(interval), 30000)
    } catch (error: any) {
      if (error?.data?.message === 'User not found') {
        alert('Пользователь с таким номером телефона не найден')
      } else {
        alert('Произошла ошибка при запросе кода. Попробуйте снова.')
      }
      console.log(error)
    }
  }

  const setSt = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const value = Object.fromEntries(formData) as FormData

    setPhone(value.phone!)
    getCode(value.phone!)
  }

  const requestCodeAgain = () => {
    if (phone) {
      getCode(phone)
    }
  }

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const value = Object.fromEntries(formData) as FormData

    if (value.code?.includes('-')) {
      alert('вы не ввели код')
    }

    login({ code: value.code! })
      .unwrap()
      .then(({ access_token, user }) => {
        localStorage.setItem('token', access_token)
        localStorage.setItem('username', user.name)
        localStorage.setItem('usersurname', user.surName)
        localStorage.setItem('usermiddlename', user.middleName)
        localStorage.setItem('useremail', user.email)
        localStorage.setItem('userphone', user.phone)

        navigate('/profile')
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div className={styles.signup}>
      {stage === 1 && (
        <form className={styles.signup_form} onSubmit={setSt}>
          <h1 className={styles.signup_form_h1}>Вход</h1>
          <label className={styles.signup_form_label}>
            <p>Номер телефона</p>
            <PatternFormat
              autoFocus
              displayType={'input'}
              allowEmptyFormatting
              format={'+# (###) ### ##-##'}
              mask={'_'}
              name={'phone'}
            />
          </label>
          <button className={styles.signup_form_button} type={'submit'}>
            Получить код
          </button>
          <h2 className={styles.signup_form_link}>
            Нет аккаунта? <Link to={ROUTER_PATHS.SIGN_UP}>Зарегистрироваться</Link>
          </h2>
        </form>
      )}

      {stage === 2 && (
        <form className={styles.signup_form} onSubmit={submit}>
          <h1 className={styles.signup_form_h1}>Вход</h1>
          <p className={styles.signup_form_againButton}>
            На ваш номер придёт сообщение с кодом.
            <button
              className={styles.signup_form_againButton}
              disabled={timer > 0}
              onClick={requestCodeAgain}
              type={'button'}
            >
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

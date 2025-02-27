import { FormEvent, useState } from 'react'
import { PatternFormat } from 'react-number-format'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

// import { useGetMeQuery } from '@/entities/auth'
import { useLoginMutation, useRequestCodeMutation } from '@/entities/auth'
import { ROUTER_PATHS } from '@/shared/config/routes'

import styles from '../../sign-up/Signup.module.scss'

export const SignInPage: React.FC = () => {
  const [stage, setStage] = useState<number>(1)
  const [timer, setTimer] = useState<number>(30)
  const [prefix, setPrefix] = useState<any>('+7')
  const [phone, setPhone] = useState<string>('')
  const location = useLocation()

  // Получение пути возврата из state или использование "/"
  const searchParams = new URLSearchParams(location.search)
  const from = searchParams.get('redirectUrl') || ROUTER_PATHS.PROFILE

  console.log(from)

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
        alert('Пользователь с таким номером телефона не наиден')
      } else {
        alert('Произошла ошибка при запросе кода. Попробуйте снова.')
      }
      console.log(error)
    }
  }

  const setSt = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const value = Object.fromEntries(formData) as { phone: string }

    const fullPhone = prefix + value.phone

    setPhone(fullPhone)
    getCode(fullPhone)
  }

  const requestCodeAgain = () => {
    if (phone) {
      getCode(phone)
    }
  }

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const value = Object.fromEntries(formData) as { code: string }

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

        navigate(`${from}`, { replace: true })
        window.location.reload()
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
            <section className={styles.signup_form_phonesect}>
              <span>{prefix}</span>
              <PatternFormat
                format={'# (###) ### ##-##'}
                mask={'_'}
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
                }}
                value={phone}
                style={{ paddingLeft: prefix == '+7' ? '30px' : '15px' }}
              />
            </section>
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
              autoFocus
              format={'#####'}
              mask={'-'}
              name={'code'}
              required
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

import { ChangeEvent, FormEvent, KeyboardEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { useLoginMutation, useRequestAdminCodeMutation } from '@/entities/auth'

import styles from './Login.module.scss'

import eye from '../../../../assets/images/eye-off-outline.svg'
import eyeon from '../../../../assets/images/eye-outline.svg'
import send from '../../../../assets/images/message-sent.svg'

export const AdminLogin = () => {
  const [stage, setStage] = useState<number>(1)
  const [inputType, setInputType] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(60)
  const [phone, setPhone] = useState<string>('')
  const [values, setValues] = useState<string[]>(Array(5).fill(''))
  const [code, setCode] = useState<string>('')
  const [codeId, setCodeId] = useState<number>(0)
  const [requestAdminCode, { error }] = useRequestAdminCodeMutation()
  const [login] = useLoginMutation()
  const navigate = useNavigate()
  const [err, setErr] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [pass, setPass] = useState<string>('')

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login({ code })
      .unwrap()
      .then(({ access_token, user }) => {
        localStorage.setItem('token', access_token)
        localStorage.setItem('username', user.name)
        localStorage.setItem('usersurname', user.surName)
        localStorage.setItem('usermiddlename', user.middleName)
        localStorage.setItem('useremail', user.email)
        localStorage.setItem('userphone', user.phone)

        navigate('/admin')
      })
      .catch(error => {
        console.log(error)
      })
  }

  const setSt = (e: any, num: number) => {
    if (num === 2) {
      setInputType(false)
      handleRequestCodeSubmit(e)
    }
  }

  const sendCode = () => {
    let tm = 60
    const interval = setInterval(() => {
      tm -= 1
      setTimer(tm)
    }, 1000)

    setTimeout(() => clearInterval(interval), 60000)
  }

  const handleRequestCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const value = Object.fromEntries(formData) as Record<string, string>
    const { email, password } = value

    try {
      await requestAdminCode({ email, password })
        .unwrap()
        .then(({ phone }) => setPhone(phone))
      setStage(2)
      sendCode()
    } catch (err) {
      console.error('Ошибка при отправке кода:', error)
      sendCode()
      setErr('Произошла ошибка. Попробуйте снова.')
    }
  }

  const handleChange = (value: string, index: number) => {
    if (/^\d$/.test(value)) {
      const newValues = [...values]
      newValues[index] = value
      setValues(newValues)

      if (index === newValues.length - 1) {
        setCode(newValues.join(''))
      } else {
        setCodeId(index + 1)
        const nextInput = document.getElementById(`code-input-${index + 1}`) as HTMLInputElement
        nextInput.readOnly = false
        nextInput.disabled = false
        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (key: string, index: number) => {
    if (key === 'Backspace') {
      const newValues = [...values]
      newValues[index] = ''
      setValues(newValues)

      if (index > 0) {
        const prevInput = document.getElementById(`code-input-${index - 1}`) as HTMLInputElement
        prevInput?.focus()
      }
    }
  }

  return (
    <div className={styles.adminLogin}>
      {stage === 1 && (
        <form onSubmit={e => setSt(e, 2)}>
          <h1>Вход</h1>
          <p className={styles.adminLogin_infoP}>
            Введите данные от личного кабинета администратора
          </p>
          <div className="form-element">
            <input
              style={{ border: err != '' ? '1px solid #DC2A1E' : '' }}
              autoFocus
              onChange={e => {
                setEmail(e.target.value)
                setErr('')
              }}
              name={'email'}
              className="form-input"
              required
              type={'text'}
            />
            <label className="form-label">Логин</label>
          </div>
          <section>
            <div className="form-element">
              <input
                name={'password'}
                style={{ border: err != '' ? '1px solid #DC2A1E' : '' }}
                onChange={e => {
                  setPass(e.target.value)
                  setErr('')
                }}
                className="form-input"
                required
                type={!inputType ? 'password' : 'text'}
              />
              <label className="form-label">Пароль</label>
            </div>
            <p className={styles.adminLogin_err}>{err}</p>
            <button onClick={() => setInputType(!inputType)} type={'button'}>
              <img alt={''} src={!inputType ? eye : eyeon} />
            </button>
          </section>
          <input
            value={'Войти'}
            disabled={email == '' || pass == '' ? true : false}
            style={{ cursor: 'pointer' }}
            type={'submit'}
          />
          {/* <Link to={'/admin/restore-pass'}>Не получается войти</Link> */}
          <Link to={''}>Не получается войти</Link>
        </form>
      )}
      {stage === 2 && (
        <form onSubmit={handleLogin}>
          <div className={styles.adminLogin_sendSect}>
            <img alt={''} src={send} />
          </div>
          <h1 style={{ marginBottom: '0' }}>Введите код подтверждения</h1>
          <p>
            Мы отправили код на телефон <b>{phone}</b>
          </p>
          <section className={styles.adminLogin_code_sect}>
            {values.map((value, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                autoFocus={index === 0}
                value={value}
                className="code-inp"
                maxLength={1}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value, index)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e.key, index)}
                pattern="[0-9]"
                placeholder="0"
                style={{
                  height: '80px',
                  width: '80px',
                  textAlign: 'center',
                  fontSize: '24px',
                }}
                type="text"
                disabled={codeId < index ? true : false}
              />
            ))}
          </section>
          <input placeholder={'Продолжить'} style={{ cursor: 'pointer' }} type={'submit'} />
          <p
            onClick={() => (timer <= 0 ? sendCode() : '')}
            style={{ cursor: timer <= 0 ? 'pointer' : 'default' }}
          >
            Отправить код ещё раз{' '}
            {timer ? 'можно через 0:' + (timer >= 10 ? timer : '0' + timer) : ''}
          </p>
        </form>
      )}
    </div>
  )
}

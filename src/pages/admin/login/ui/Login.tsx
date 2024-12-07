import { ChangeEvent, FormEvent, KeyboardEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useLoginMutation, useRequestAdminCodeMutation } from '@/entities/auth'

import styles from './Login.module.scss'

import eye from '../../../../assets/images/eye-off-outline.svg'
import eyeon from '../../../../assets/images/eye-outline.svg'
import send from '../../../../assets/images/message-sent.svg'
import { PatternFormat } from 'react-number-format'

export const AdminLogin = () => {
  const [stage, setStage] = useState<number>(1)
  const [inputType, setInputType] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(60)
  const [phone, setPhone] = useState<string>('')
  const [values, setValues] = useState<string[]>(Array(5).fill(''))
  const [code, setCode] = useState<string>('')
  const [requestAdminCode, { error }] = useRequestAdminCodeMutation()
  const [login] = useLoginMutation()
  const navigate = useNavigate()

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

    setStage(2)
    try {
      await requestAdminCode({ email, password })
        .unwrap()
        .then(({ phone }) => setPhone(phone))
      sendCode()
    } catch (err) {
      console.error('Ошибка при отправке кода:', error)
      sendCode()
      alert('Произошла ошибка. Попробуйте снова.')
    }
  }

  // function moveToNext(elem: any, index: any, inputs: any) {
  //   if (elem.length === 1) {
  //     if (index < inputs.length) {
  //       inputs[index].focus()
  //     } else {
  //       checkCode(inputs)
  //     }
  //   }
  // }

  // function checkBackspace(ek: any, index: any, inputs: any) {
  //   if (ek === 'Backspace') {
  //     if (index > 0) {
  //       inputs[index - 1].focus()
  //     }
  //   }
  // }

  // function checkCode(inps: any) {
  //   let code = ''

  //   inps.forEach((inp: any) => {
  //     code += inp.value
  //   })
  //   if (code.length === 5) {
  //     inps.forEach((inp: any) => {
  //       inp.blur()
  //     })
  //     setCode(code)
  //   }
  // }

  // const handleFocus = (index: number) => {
  //   if (index > 0 && !values[index - 1]) {
  //     const prevInput = document.getElementById(`code-input-${index - 1}`) as HTMLInputElement
  //     prevInput?.focus()
  //   }
  // }

  const handleChange = (value: string, index: number) => {
    if (/^\d$/.test(value)) {
      const newValues = [...values]
      newValues[index] = value
      setValues(newValues)

      if (index === newValues.length - 1) {
        setCode(newValues.join(''))
      } else {
        const nextInput = document.getElementById(`code-input-${index + 1}`) as HTMLInputElement
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
          <input autoFocus name={'email'} placeholder={'Логин'} type={'text'} />
          <section>
            <input
              name={'password'}
              placeholder={'Пароль'}
              type={!inputType ? 'password' : 'text'}
            />
            <button onClick={() => setInputType(!inputType)} type={'button'}>
              <img alt={''} src={!inputType ? eye : eyeon} />
            </button>
          </section>
          <input placeholder={'Продолжить'} style={{ cursor: 'pointer' }} type={'submit'} />
          <Link to={'/admin/restore-pass'}>Восстановить доступ</Link>
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
            {/* <input
              autoFocus
              className={'code-inp'}
              onFocus={() => {
                document.querySelectorAll('.codeinp')[1].setAttribute("readonly")
              }}
              maxLength={1}
              onChange={e => moveToNext(e.target.value, 1, document.querySelectorAll('.code-inp'))}
              onKeyDown={e => {
                checkBackspace(e.key, this, document.querySelectorAll('.code-inp'))
              }}
              pattern={'[0-9]'}
              placeholder={'0'}
              style={{ height: '80px', padding: '0', textAlign: 'center', width: '80px' }}
              type={'text'}
            />
            <input
              className={'code-inp'}
              onFocus={() => {
                document.querySelectorAll('.codeinp')[2].setAttribute("readonly")
              }}
              maxLength={1}
              onChange={e => moveToNext(e.target.value, 2, document.querySelectorAll('.code-inp'))}
              onKeyDown={e => {
                checkBackspace(e.key, this, document.querySelectorAll('.code-inp'))
              }}
              pattern={'[0-9]'}
              placeholder={'0'}
              style={{ height: '80px', padding: '0', textAlign: 'center', width: '80px' }}
              type={'text'}
            />
            <input
              className={'code-inp'}
              onFocus={() => {
                document.querySelectorAll('.codeinp')[3].setAttribute("readonly")
              }}
              maxLength={1}
              onChange={e => moveToNext(e.target.value, 3, document.querySelectorAll('.code-inp'))}
              onKeyDown={e => {
                checkBackspace(e.key, this, document.querySelectorAll('.code-inp'))
              }}
              pattern={'[0-9]'}
              placeholder={'0'}
              style={{ height: '80px', padding: '0', textAlign: 'center', width: '80px' }}
              type={'text'}
            />
            <input
              className={'code-inp'}
              onFocus={() => {
                document.querySelectorAll('.codeinp')[4].setAttribute("readonly")
              }}
              maxLength={1}
              onChange={e => moveToNext(e.target.value, 4, document.querySelectorAll('.code-inp'))}
              onKeyDown={e => {
                checkBackspace(e.key, this, document.querySelectorAll('.code-inp'))
              }}
              pattern={'[0-9]'}
              placeholder={'0'}
              style={{ height: '80px', padding: '0', textAlign: 'center', width: '80px' }}
              type={'text'}
            />
            <input
              className={'code-inp'}
              onFocus={() => {
                document.querySelectorAll('.codeinp')[5].setAttribute("readonly")
              }}
              maxLength={1}
              onChange={e => moveToNext(e.target.value, 5, document.querySelectorAll('.code-inp'))}
              onKeyDown={e => {
                checkBackspace(e.key, this, document.querySelectorAll('.code-inp'))
              }}
              pattern={'[0-9]'}
              placeholder={'0'}
              style={{ height: '80px', padding: '0', textAlign: 'center', width: '80px' }}
              type={'text'}
              <PatternFormat format="#####" allowEmptyFormatting autoFocus />
            /> */}
            {values.map((value, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
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
                // onFocus={()=>handleFocus(index)}
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

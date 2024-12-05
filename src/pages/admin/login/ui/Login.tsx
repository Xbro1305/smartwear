import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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

        navigate('/main')
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
      setStage(2)
      sendCode()
      alert('Произошла ошибка. Попробуйте снова.')
    }
  }

  function moveToNext(elem: any, index: any, inputs: any) {
    if (elem.length === 1) {
      if (index < inputs.length) {
        inputs[index].focus()
      } else {
        checkCode(inputs)
      }
    }
  }

  function checkBackspace(ek: any, index: any, inputs: any) {
    if (ek === 'Backspace') {
      if (index > 0) {
        inputs[index - 1].focus()
      }
    }
  }

  function checkCode(inps: any) {
    let code = ''

    inps.forEach((inp: any) => {
      code += inp.value
    })
    if (code.length === 5) {
      inps.forEach((inp: any) => {
        inp.blur()
      })
      setCode(code)
    }
  }

  return (
    <div className={styles.adminLogin}>
      {stage === 1 && (
        <form onSubmit={e => setSt(e, 2)}>
          <h1>Вход</h1>
          <input name={'email'} placeholder={'Логин'} type={'text'} />
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
            <input
              className={'code-inp'}
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
              maxLength={1}
              onChange={e => moveToNext(e.target.value, 5, document.querySelectorAll('.code-inp'))}
              onKeyDown={e => {
                checkBackspace(e.key, this, document.querySelectorAll('.code-inp'))
              }}
              pattern={'[0-9]'}
              placeholder={'0'}
              style={{ height: '80px', padding: '0', textAlign: 'center', width: '80px' }}
              type={'text'}
            />
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

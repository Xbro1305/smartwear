import { useState } from 'react'
import { Link } from 'react-router-dom'

import styles from '@/pages/admin/login/ui/Login.module.scss'

import eye from '../../../../assets/images/eye-off-outline.svg'
import eyeon from '../../../../assets/images/eye-outline.svg'

export const RestorePass = () => {
  const [stage, setStage] = useState<number>(1)
  const [inputType, setInputType] = useState<boolean>(false)

  const setSt = (e: any, num: any) => {
    e.preventDefault()
    if (num == 2) {
      console.log(e, num)
      setStage(2)
    }
  }

  return (
    <div className={styles.adminLogin}>
      {stage == 1 && (
        <form onSubmit={e => setSt(e, 2)}>
          <h1 style={{ marginBottom: '0' }}>Забыли пароль?</h1>
          <p>Введите логин от аккаунта, чтобы установить новый пароль</p>
          <input name={'login'} placeholder={'Логин'} type={'text'} />
          <input placeholder={'Сбросить пароль'} style={{ cursor: 'pointer' }} type={'submit'} />
          <Link to={'/admin/login'}>← Вернуться ко входу</Link>
        </form>
      )}
      {stage == 2 && (
        <form onSubmit={e => setSt(e, 3)}>
          <h1>Установите новый пароль</h1>
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
          <section>
            <input
              name={'password'}
              placeholder={'Повторите пароль'}
              type={!inputType ? 'password' : 'text'}
            />
            <button onClick={() => setInputType(!inputType)} type={'button'}>
              <img alt={''} src={!inputType ? eye : eyeon} />
            </button>
          </section>
          <input placeholder={'Установить новый'} style={{ cursor: 'pointer' }} type={'submit'} />
          <p onClick={() => setStage(1)} style={{ cursor: 'pointer' }}>
            ← Назад
          </p>
        </form>
      )}
    </div>
  )
}

import styles from '@/pages/admin/login/ui/Login.module.scss'
import eye from '../../../../assets/images/eye-off-outline.svg'
import eyeon from '../../../../assets/images/eye-outline.svg'
import { useState } from 'react'
import { Link } from 'react-router-dom'

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
          <input type="text" name="login" placeholder="Логин" />
          <input style={{ cursor: 'pointer' }} type="submit" placeholder="Сбросить пароль" />
          <Link to="/admin/login">← Вернуться ко входу</Link>
        </form>
      )}
      {stage == 2 && (
        <form onSubmit={e => setSt(e, 3)}>
          <h1>Установите новый пароль</h1>
          <section>
            <input type={!inputType ? 'password' : 'text'} name="password" placeholder="Пароль" />
            <button onClick={() => setInputType(!inputType)} type="button">
              <img src={!inputType ? eye : eyeon} alt="" />
            </button>
          </section>
          <section>
            <input
              type={!inputType ? 'password' : 'text'}
              name="password"
              placeholder="Повторите пароль"
            />
            <button onClick={() => setInputType(!inputType)} type="button">
              <img src={!inputType ? eye : eyeon} alt="" />
            </button>
          </section>
          <input style={{ cursor: 'pointer' }} type="submit" placeholder="Установить новый" />
          <p style={{ cursor: 'pointer' }} onClick={() => setStage(1)}>
            ← Назад
          </p>
        </form>
      )}
    </div>
  )
}

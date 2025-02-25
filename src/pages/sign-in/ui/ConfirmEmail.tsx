import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export const ConfirmEmail = () => {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  const [message, setMessage] = useState('Загрузка...')

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res =>
        axios(`${import.meta.env.VITE_APP_API_URL}/users/confirm-email/${res.data.id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          data: { code },
        })
          .then(() => {
            setMessage('E-mail подтевржден успешно!')
          })
          .catch(err => {
            console.log(err)
            setMessage('Ошибка при подтверждении E-mail')
          })
      )
      .catch(err => {
        console.log(err)
        setMessage('Ошибка при получении токена')
      })
  }, [])

  return (
    <div
      style={{
        height: 'calc(100vh - 76px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2 className="h2">{message}</h2>
    </div>
  )
}

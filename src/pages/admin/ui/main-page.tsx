import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGetMeQuery } from '@/entities/auth'

export const MainPage = () => {
  const navigate = useNavigate()
  const { data: user, isLoading } = useGetMeQuery()

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      navigate('/admin/login')
    }
  }, [isLoading, user, navigate])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#2c3e50' }}>MainPage</h1>

      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>Добро пожаловать на главную страницу</p>

      <footer style={{ color: '#7f8c8d', fontSize: '14px', marginTop: '40px' }}>
        <p>
          Если у вас есть вопросы или предложения, не стесняйтесь обращаться к нам. Мы всегда рады
          получить ваш отклик!
        </p>
      </footer>
    </div>
  )
}

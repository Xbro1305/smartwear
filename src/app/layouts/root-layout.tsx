import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { useGetMeQuery } from '@/entities/auth'

export const RootLayout = () => {
  const { isError, isLoading } = useGetMeQuery()
  const isAuthenticated = !isError && !isLoading

  if (isLoading) {
    return <div>Проверка ваших полномочий...</div>
  }

  const renderMain = (
    <main>
      <Outlet />
    </main>
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    return (
      <>
        <Header />
        <div>{renderMain}</div>
        <Footer />
      </>
    )
  }

  return (
    <div>
      <Header />
      {!isLoading && renderMain}
      <Footer />
    </div>
  )
}

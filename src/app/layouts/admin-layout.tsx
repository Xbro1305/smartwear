import { Outlet } from 'react-router-dom'
import { useGetMeQuery } from '@/entities/auth'

export const AdminLayout = () => {
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
        <div>{renderMain}</div>
      </>
    )
  }

  return <div className={'h-screen min-w-full flex flex-col'}>{!isLoading && renderMain}</div>
}

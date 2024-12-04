import { Outlet } from 'react-router-dom'
import { useGetMeQuery } from '@/entities/auth'

export const AdminLayout = () => {
  const { isError, isLoading } = useGetMeQuery()
  const isAuthenticated = !isError && !isLoading

  if (isLoading) {
    return <div>Проверка ваших полномочий...</div>
  }

  const renderMain = (
    <main
      className={
        'grow flex  flex-col lg:justify-center lg:items-center justify-center items-center pt-[var(--header-height)]'
      }
    >
      <Outlet />
    </main>
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    return (
      <>
        <div
          className={
            'px-8 flex h-screen flex-1 gap-5 md:grid  lg:justify-center lg:items-center justify-center items-center'
          }
          translate={'no'}
        >
          {renderMain}
        </div>
      </>
    )
  }

  return <div className={'h-screen min-w-full flex flex-col'}>{!isLoading && renderMain}</div>
}

import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { useMeQuery } from '@/entities/auth'


export const RootLayout = () => {
  const { isError, isLoading } = useMeQuery()
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
        <Header />
        <div
          className={
            'px-8 flex h-screen flex-1 gap-5 md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:justify-center lg:items-center justify-center items-center lg:grid-cols-[220px_minmax(0,1fr)]'
          }
          translate={'no'}
        >
          
          {renderMain}
        </div>
        < Footer />
      </>
    )
  }

  return (
    <div className={'h-screen min-w-full flex flex-col'}>
      <Header />
      {!isLoading && renderMain}
    </div>
  )
}

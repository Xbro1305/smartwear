import { Outlet } from 'react-router-dom'

export const AdminLayout = () => {
  const renderMain = (
    <main>
      <Outlet />
    </main>
  )

  return (
    <>
      <div>{renderMain}</div>
    </>
  )
}

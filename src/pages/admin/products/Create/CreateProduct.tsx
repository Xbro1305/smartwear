import { useEffect } from 'react'

export const CreateProduct = () => {
  useEffect(() => {
    document.title = 'Создать товар - Панель администратора'
  }, [])

  return (
    <div className="py-[80px] px-[36px] flex gap-[50px] justify-between">
      <div className="flex flex-col gap-[48px]">
        <h1 id="h1">Редактор товара</h1>
        <div className="flex flex-col gap-[24px]">
          <h3 id="h3">Основные параметры</h3>
          <label className="flex flex-col gap-sm w-[370px]">
            <p className="font-semibold text-[14px]">Артикул</p>
            <input type="text" className="admin-input" placeholder="Артикул товара" />
          </label>
          <label className="flex flex-col gap-sm w-[370px]">
            <p className="font-semibold text-[14px]">Название товара</p>
            <input type="text" className="admin-input" placeholder="Название" />
          </label>
        </div>
      </div>
    </div>
  )
}

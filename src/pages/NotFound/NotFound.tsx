import { HiOutlineEmojiSad } from 'react-icons/hi'
import banner from '@/assets/images/catalogBanner.svg'
import { useEffect, useState } from 'react'
import axios from 'axios'

export const NotFound = () => {
  const [categories, setCategories] = useState<any>(null)

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/categories`)
      .then(res => {
        const data = res?.data?.filter((cat: any) => cat.showInMenu)
        setCategories(data)
      })
      .catch(() => setCategories([]))
  }, [])

  return (
    <div className="flex flex-col py-[48px]">
      <img src={banner} alt="" />
      <div className="flex flex-col gap-[24px] items-center justify-center">
        <HiOutlineEmojiSad className="text-[#E9AFAF] text-[200px]" />
        <h2 className="h2">Что-то пошло не так</h2>
        <p className="p1 max-w-[400px] text-center">
          Обновите страницу или выберите что-нибудь в каталоге
        </p>
        <div className="flex items-center gap-[24px]">
          {categories ? (
            categories.slice(0, 2).map((cat: any, index: number) => (
              <a
                key={cat.id}
                href={`${cat.slug}`}
                className={`px-[24px] py-[12px] text-[#fff] ${index % 2 ? 'bg-[#DC2A1F] hover:text-[#DC2A1F]' : 'bg-[#282B32] hover:text-[#282B32]'} rounded-[8px] text-[#333333] hover:bg-[#E0E0E0]`}
              >
                {cat.name}
              </a>
            ))
          ) : (
            <p>Загрузка категорий...</p>
          )}
        </div>
      </div>
    </div>
  )
}

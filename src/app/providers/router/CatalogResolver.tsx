import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

import { CatalogCategory } from '@/pages/catalog-category'
import { ProductPage } from '@/pages/ProductPage/ProductPage'
import { NotFound } from '@/pages/NotFound/NotFound'
import { Article } from '@/pages/article'

type EntityType = 'category' | 'product' | 'article' | 'loading' | 'not-found'

export const CatalogResolver = () => {
  const location = useLocation()
  const slug = location.pathname.split('/').pop() as string

  const [type, setType] = useState<EntityType>('loading')
  const [data, setData] = useState<any>(null)

  const baseUrl = import.meta.env.VITE_APP_API_URL

  const category = window.location.pathname

  const getCategoryBySlug = () =>
    axios
      .get(`${baseUrl}/catalog/products?category=${category}&attributeIds=25&priceTo=10000`)
      .then(r => r.data)

  const getProductBySlug = () => axios.get(`${baseUrl}/products/slug/${slug}`).then(r => r.data)

  const getArticleByKeyword = () =>
    axios.get(`${baseUrl}/articles/search/${slug}`).then(r => {
      const art = r.data
      // API может вернуть 200 с null, если статьи нет — считаем это «не найдено»
      if (!art) throw new Error('article not found')
      // точное совпадение слага: бэкенд иногда отдаёт похожую статью
      // (напр. /climate-control → /climate-control-stirka) — тогда это 404 (Правки 3, п.2)
      if (art.keyword && (art.keyword !== slug || `/${art.keyword}` !== slug))
        return console.log('slug mismatch')
      // удалённые статьи не показываем как страницу — 404 (Правки 3, п.10)
      if (art.isDeleted) return console.log('article deleted')
      return art
    })

  useEffect(() => {
    if (!slug) return

    setType('loading')
    setData(null)

    const load = async () => {
      try {
        const category = await getCategoryBySlug()
        setData(category)
        setType('category')
      } catch {
        try {
          const product = await getProductBySlug()
          setData(product)
          setType('product')
        } catch {
          try {
            // Статьи теперь без префикса /article/ — резолвим их прямо в корне
            const article = await getArticleByKeyword()
            setData(article)
            setType('article')
          } catch {
            setType('not-found')
          }
        }
      }
    }

    load()
  }, [slug])

  if (type === 'loading') return <div>Загрузка...</div>

  if (type === 'category') return <CatalogCategory data={data} />
  if (type === 'product') return <ProductPage data={data} />
  if (type === 'article') return <Article keyword={slug} />

  if (type === 'not-found') return <NotFound />
  return null
}

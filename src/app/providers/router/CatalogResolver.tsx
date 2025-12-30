import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

import { CatalogCategory } from '@/pages/catalog-category'
import { ProductPage } from '@/pages/ProductPage/ProductPage'

type EntityType = 'category' | 'product' | 'loading' | 'not-found'

export const CatalogResolver = () => {
  const location = useLocation()
  const slug = location.pathname.split('/').pop() as string

  const [type, setType] = useState<EntityType>('loading')
  const [data, setData] = useState<any>(null)

  const baseUrl = import.meta.env.VITE_APP_API_URL

  const category = window.location.pathname

  const getCategoryBySlug = () =>
    axios.get(`${baseUrl}/catalog/products?category=${category}`).then(r => r.data)

  const getProductBySlug = () => axios.get(`${baseUrl}/products/slug/${slug}`).then(r => r.data)

  useEffect(() => {
    if (!slug) return

    setType('loading')
    setData(null)

    const load = async () => {
      try {
        const category = await getCategoryBySlug(slug)
        setData(category)
        setType('category')
      } catch {
        try {
          const product = await getProductBySlug(slug)
          setData(product)
          setType('product')
        } catch {
          setType('not-found')
        }
      }
    }

    load()
  }, [slug])

  if (type === 'loading') return <div>Загрузка...</div>
  if (type === 'not-found') return <div>Ничего не найдено</div>

  if (type === 'category') return <CatalogCategory data={data} />
  if (type === 'product') return <ProductPage data={data} />

  return null
}

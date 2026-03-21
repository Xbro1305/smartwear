import styles from './catalog.module.scss'
import { Link } from 'react-router-dom'
import woman from '@/assets/images/homeWoman.jpeg'
import { useEffect, useState } from 'react'
import axios from 'axios'

export const CatalogPage = () => {
  const [categories, setCategories] = useState<any>(null)

  const hasBrand = (c: any, b: number) =>
    Array.isArray(c?.filters?.attributeValueIds) && c.filters.attributeValueIds.includes(b)

  useEffect(() => {
    ;(async () => {
      await axios(`${import.meta.env.VITE_APP_API_URL}/attributes/4`)
        .then(res => {
          const data = res?.data?.values
          const ids = data.map((item: any) => item.id)

          axios(`${import.meta.env.VITE_APP_API_URL}/categories`)
            .then(res => {
              const data = res?.data

              const cats = data
                ?.filter((c: any) => !ids.some((b: number) => hasBrand(c, b)))
                .filter((c: any) => c.parentId === null)

              setCategories(cats)
            })
            .catch(() => setCategories([]))
        })
        .catch(err => {
          console.error('Ошибка при запросе к API /attributes/4:', err)
        })
    })()
  }, [])

  return (
    <div className={styles.catalog}>
      <div className={styles.catalog_wrapper}>
        <h3 className="h2">Каталог</h3>
        <div className={styles.catalog_bottom}>
          {categories?.map((cat: any) => (
            <Link to={cat.slug} className={styles.catalog_item}>
              <img src={cat.imageUrl || woman} alt="" />
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

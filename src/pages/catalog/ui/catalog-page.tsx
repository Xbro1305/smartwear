import styles from './catalog.module.scss'
import { Link } from 'react-router-dom'
import woman from '@/assets/images/homeWoman.jpeg'
import { useEffect, useState } from 'react'
import axios from 'axios'

export const CatalogPage = () => {
  const [categories, setCategories] = useState<any>(null)

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/categories`)
      .then(res => {
        const data = res?.data
          ?.filter((cat: any) => cat.showOnSite)
          .filter((cat: any) => cat.parentId === null)
        setCategories(data)
      })
      .catch(() => setCategories([]))
  }, [])

  return (
    <div className={styles.catalog}>
      <div className={styles.catalog_wrapper}>
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

import { useParams } from 'react-router-dom'

import { useSearchArticleByKeywordQuery } from '@/entities/article'
import { useGetImageQuery } from '@/entities/image/image.api'

import styles from '@/pages/article/ui/Articles.module.scss'

export const New = () => {
  const { name } = useParams<{ name: string }>()
  const { data } = useSearchArticleByKeywordQuery(name || '')

  const {
    data: articleImage,
    error,
    isLoading,
  } = useGetImageQuery({
    id: data?.id.toString() || '',
    type: 'articles',
  })

  return (
    <div
      className={styles.articles_item}
      style={{ padding: 'var(--top-padding) var(--sides-padding)' }}
    >
      <div className={styles.articles_item_left}>
        <h1 style={{ inlineSize: '100%' }}>{data?.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: data?.description as string }} />
      </div>

      <div className={styles.articles_item_right}>
        {isLoading && <p>Загрузка изображения...</p>}
        {error && <p>Ошибка загрузки изображения</p>}
        {articleImage && !isLoading && !error && (
          <img alt={'Article'} src={URL.createObjectURL(articleImage)} />
        )}
        {!articleImage && !isLoading && !error && <p>Изображение не найдено</p>}
      </div>
    </div>
  )
}

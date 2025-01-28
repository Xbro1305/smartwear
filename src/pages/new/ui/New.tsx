import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useSearchArticleByKeywordQuery } from '@/entities/article'
import { useGetImageQuery } from '@/entities/image/image.api'

import styles from '@/pages/article/ui/Articles.module.scss'

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3001/api'

export const New = () => {
  const { name } = useParams<{ name: string }>()
  const {
    data: article,
    error: articleError,
    isLoading: isArticleLoading,
  } = useSearchArticleByKeywordQuery(name || '')

  const {
    data: articleImage,
    error: imageError,
    isLoading: isImageLoading,
  } = useGetImageQuery({
    id: article?.id.toString() || '',
    type: 'articles',
  })

  const [imagesByParagraph, setImagesByParagraph] = useState<Record<string, Blob>>({})

  useEffect(() => {
    if (article) {
      if (article.metaTitle) {
        document.title = article.metaTitle
      }
      if (article.metaDescription) {
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute('content', article.metaDescription)
      }
    }
  }, [article])

  useEffect(() => {
    const loadParagraphImages = async () => {
      if (article && article.paragraphs) {
        const paragraphImagePromises = article.paragraphs.map(async paragraph => {
          const imageUrl = `${API_URL}/images/article/${article.id}/paragraph/${paragraph.title}`
          const image = await fetch(imageUrl)

          if (image.ok) {
            const blob = await image.blob()

            return { blob, title: paragraph.title }
          }

          return { blob: null, title: paragraph.title }
        })

        const paragraphImages = await Promise.all(paragraphImagePromises)

        const imagesMap = paragraphImages.reduce((acc: Record<string, Blob>, { blob, title }) => {
          if (blob) {
            acc[title] = blob
          }

          return acc
        }, {})

        setImagesByParagraph(imagesMap)
      }
    }

    loadParagraphImages()
  }, [article])

  if (isArticleLoading) {
    return <div>Загрузка статьи...</div>
  }

  if (articleError || !article || article.isDeleted) {
    return <div>Ошибка: Статья не найдена или была удалена</div>
  }

  return (
    <div className={styles.articles}>
      <div
        className={styles.articles_item}
        style={{
          flexDirection: article.composition === 'RIGHT' ? 'row-reverse' : 'row',
        }}
      >
        <div className={styles.articles_item_left}>
          <h1>{article.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: article.description }} />
        </div>
        <div className={styles.articles_item_right}>
          {isImageLoading && <p>Загрузка изображения...</p>}
          {imageError && <p>Ошибка загрузки изображения</p>}
          {articleImage && <img alt={'Article'} src={URL.createObjectURL(articleImage)} />}
        </div>
      </div>

      {article.paragraphs.map(paragraph => (
        <div
          className={styles.articles_item}
          key={paragraph.id}
          style={{
            flexDirection: article.composition === 'RIGHT' ? 'row-reverse' : 'row',
          }}
        >
          <div className={styles.articles_item_left}>
            <h4>{paragraph.title}</h4>
            <div dangerouslySetInnerHTML={{ __html: paragraph.content }} />
          </div>
          <div className={styles.articles_item_right}>
            {imagesByParagraph[paragraph.title] && (
              <img
                alt={'Paragraph'}
                src={URL.createObjectURL(imagesByParagraph[paragraph.title])}
              />
            )}
          </div>
        </div>
      ))}

      <div className={styles.articles_like_dislike}>
        <h4>Статья была полезна?</h4>
        <div className={styles.articles_like_dislike_icons}>
          <span>👍</span>
          <span>👎</span>
        </div>
      </div>
    </div>
  )
}

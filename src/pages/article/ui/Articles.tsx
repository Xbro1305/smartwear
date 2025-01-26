import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useSearchArticleByKeywordQuery } from '@/entities/article/article.api'
import { useGetArticlesBySectionQuery } from '@/entities/article/article.api'
import { Section } from '@/entities/article/article.types'
import { useGetImageQuery } from '@/entities/image/image.api'
import { AiFillDislike, AiFillLike } from 'react-icons/ai'

import styles from './Articles.module.scss'

const enver = import.meta.env.VITE_APP_API_URL

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3001/api'

interface Article {
  category: Section
}

const Articles: React.FC<Article> = ({ category }) => {
  const { name } = useParams<{ name: string }>()
  const {data: articleData} = useGetArticlesBySectionQuery(category)
  const { data: article, error, isLoading } = useSearchArticleByKeywordQuery(name || '')

  console.log(category)

  const { data: articleImage, isLoading: isImageLoading } = useGetImageQuery({
    id: article?.id.toString() || '',
    type: 'articles',
  })

  const [imagesByParagraph, setImagesByParagraph] = useState<Record<string, Blob>>({})

  useEffect(() => {
    console.log('env: ' + enver)

    const loadParagraphImages = async () => {
      if (article && article.paragraphs) {
        const paragraphImagePromises = article.paragraphs.map(async paragraph => {
          console.log('title: ' + paragraph.title)
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

  useEffect(() => {
    if (article) {
      if (article.metaTitle) {
        document.title = article.metaTitle
        document
          .querySelector('meta[name="title"]')
          ?.setAttribute('content', article.metaDescription)
      }
      if (article.metaDescription) {
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute('content', article.metaDescription)
      }
    }
  }, [article])

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div>Ошибка при загрузке статьи</div>
  }

  if (!article || article.isDeleted) {
    return <div>Статья не найдена или была удалена</div>
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
          <h1 className={'h1'}>{article.title}</h1>
          <h4 className={'h4'} dangerouslySetInnerHTML={{ __html: article.description }} />
        </div>
        <div className={styles.articles_item_right}>
          {isImageLoading && <p>Загрузка изображения...</p>}
          {articleImage && (
            <img
              alt={'Article'}
              className={styles.article_image}
              src={URL.createObjectURL(articleImage)}
            />
          )}
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
            <h4 className={'h4'}>{paragraph.title}</h4>
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
        <h4 className={'h4'}>Статья была полезна?</h4>
        <div className={styles.articles_like_dislike_icons}>
          <AiFillLike />
          <AiFillDislike />
        </div>
      </div>
    </div>
  )
}

export default Articles

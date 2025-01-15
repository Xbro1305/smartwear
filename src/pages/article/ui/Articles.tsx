import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useSearchArticleByKeywordQuery } from '@/entities/article/article.api'
import { useGetParagraphsImagesQuery } from '@/entities/image/image.api'
import { useGetImageQuery } from '@/entities/image/image.api'
import { AiFillDislike, AiFillLike } from 'react-icons/ai'

import styles from './Articles.module.scss'

const Articles = () => {
  const { name } = useParams<{ name: string }>()
  const { data: article, error, isLoading } = useSearchArticleByKeywordQuery(name || '')

  const { data: paragraphImages, isLoading: isParagraphImagesLoading } =
    useGetParagraphsImagesQuery({
      articleId: article?.id.toString() || '',
    })
  const { data: articleImage, isLoading: isImageLoading } = useGetImageQuery({
    id: article?.id.toString() || '',
    type: 'articles',
  })

  const [imagesByParagraph, setImagesByParagraph] = useState<Blob[]>([])

  useEffect(() => {
    if (paragraphImages && article?.paragraphs) {
      setImagesByParagraph(paragraphImages)
    }
  }, [paragraphImages, article?.paragraphs])

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

  if (!article) {
    return <div>Статья не найдена</div>
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

        <div className={styles.articles_item_right}>
          {isParagraphImagesLoading && <p>Загрузка изображений...</p>}
          {!isParagraphImagesLoading && !paragraphImages && <p>Изображения не найдены</p>}
        </div>
      </div>

      {article.paragraphs.map((paragraph, index) => (
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
            {imagesByParagraph[index] && (
              <img
                alt={'Paragraph'}
                src={
                  imagesByParagraph[index]
                    ? URL.createObjectURL(imagesByParagraph[index] as Blob)
                    : ''
                }
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

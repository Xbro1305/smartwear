/* eslint-disable no-nested-ternary */
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useSearchArticleByKeywordQuery } from '@/entities/article/article.api'
import { useGetImageQuery } from '@/entities/image/image.api'
import { AiFillDislike, AiFillLike } from 'react-icons/ai'

import styles from './Articles.module.scss'

const Articles = () => {
  const { name } = useParams<{ name: string }>()
  const { data: article, error, isLoading } = useSearchArticleByKeywordQuery(name || '')
  const { data: articleImage, isLoading: isArticleImageLoading } = useGetImageQuery({
    id: article?.id.toString() as string,
    type: 'articles',
  })

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
      <div className={styles.articles_item}>
        <div className={styles.articles_item_left}>
          <h1 className={'h1'}>{article.title}</h1>
          <h4 className={'h4'} dangerouslySetInnerHTML={{ __html: article.description }} />
          {/* {article.description} */}
          {/* </h4> */}
        </div>
        <div className={styles.articles_item_right}>
          {isArticleImageLoading && <p>Загрузка изображения...</p>}

          {!isArticleImageLoading && articleImage && (
            <img alt={'Article'} src={URL.createObjectURL(articleImage)} />
          )}

          {!isArticleImageLoading && !articleImage && <p>Изображение не найдено</p>}
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
            {paragraph.imageUrl && <img alt={'Paragraph'} src={paragraph.imageUrl} />}
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

import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import img from '@/assets/images/Rectangle 992.png'
import { useGetArticlesBySectionQuery } from '@/entities/article/article.api'
import { Section } from '@/entities/article/article.types'

import styles from './Articles.module.scss'

export const Articles = () => {
  const { data: articles, isLoading } = useGetArticlesBySectionQuery(Section.USER)
  const [search, setSearch] = useState<string>('')
  const [tag, setTag] = useState<string>('Все')
  const [visibleArticles, setVisibleArticles] = useState<number>(12)
  const navigate = useNavigate()

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  // Фильтрация по тегам и поиску
  const filteredArticles = articles
    ?.filter(article => tag === 'Все' || article.tags?.includes(tag))
    .filter(article => article.title.toLowerCase().includes(search.toLowerCase()))

  // Показать больше статей
  const handleShowMore = () => {
    setVisibleArticles(prev => prev + 12)
  }

  return (
    <div className={styles.articles}>
      <div className={styles.articles_top}>
        <h1 id={'h1'}>Статьи и полезная информация</h1>
        <p className={'p1'} style={{ color: 'var(--service)' }}>
          Найди нужную статью через поиск
        </p>
        <form
          className={styles.articles_top_bottom}
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
          }}
        >
          <input
            onChange={e => setSearch(e.target.value)}
            placeholder={'Название статьи'}
            type={'text'}
            value={search}
          />
          <button className={'button'} type={'submit'}>
            Найти
          </button>
        </form>
      </div>

      <div className={styles.articles_list}>
        <div className={styles.articles_list_tags}>
          {['Все', 'Полезное', 'Об одежде'].map(tagOption => (
            <p
              className={'button'}
              key={tagOption}
              onClick={() => setTag(tagOption)}
              style={
                tagOption !== tag ? { background: 'var(--gray)', color: 'var(--service)' } : {}
              }
            >
              {tagOption}
            </p>
          ))}
        </div>

        <div className={styles.articles_list_items}>
          {filteredArticles && filteredArticles.length > 0 ? (
            filteredArticles.slice(0, visibleArticles).map((article, index) => (
              <div
                className={styles.articles_list_item}
                key={index}
                onClick={() => navigate(`/article/${article.keyword}`)}
              >
                <img alt={''} src={article.imageUrl || img} />
                <span className="p2">
                  {article.createdAt &&
                    new Date(article.createdAt.toString()).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                </span>
                <h5 className={'h5'}>{article.title}</h5>
                <div dangerouslySetInnerHTML={{ __html: article.description }} />
                <section className={styles.articles_list_item_tags}>
                  {article.tags?.map(tag => <span key={tag}>{tag}</span>)}
                </section>
              </div>
            ))
          ) : (
            <p className={'p1'} style={{ gridColumn: '1 / span 4', margin: '0 auto' }}>
              Ничего не найдено
            </p>
          )}
        </div>
      </div>

      {filteredArticles && filteredArticles.length > visibleArticles && (
        <div className={styles.articles_getmore}>
          <button onClick={handleShowMore}>Показать ещё</button>
        </div>
      )}
    </div>
  )
}

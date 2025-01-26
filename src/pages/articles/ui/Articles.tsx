// import { useGetArticlesQuery } from '@/entities/article'
// import { ArticleDto, SectionDto } from '@/entities/article/article.types'
import img from '@/assets/images/Rectangle 992.png'
import styles from './Articles.module.scss'
import { FormEvent, useEffect, useState } from 'react'

interface artcilesData {
  date: string
  title: string
  imageUrl?: string
  content: string
  tags?: string[]
}

const obj = {
  date: '20 января 2025',
  title: 'Какие ткани используются',
  imageUrl: img,
  content:
    'Мы хотим познакомить вас с правилами ухода за одеждой с климат-контролем, ведь от этого напрямую зависят ее свойства и ваш комфорт при ее использовании. Подробно об этом можно прочитать в нашей статье.',
  tags: ['Полезное', 'Об одежде'],
}

export const Articles = () => {
  //   const { data: articles, isLoading } = useGetArticlesQuery()
  const [search, setSearch] = useState<string>('')
  const [data, setData] = useState<artcilesData[]>(Array<artcilesData>(12).fill(obj))
  const [sections, setSections] = useState<artcilesData[]>(data)
  const [tags, setTags] = useState<string[]>([])
  const [tag, setTag] = useState<string>('Все')
  const [articlesCount, setArticlesCount] = useState<number>(sections.length / data.length)

  useEffect(() => {
    setData(Array<artcilesData>(12).fill(obj))
    setTags([
      'Все',
      'Полезное',
      'Об одежде',
      'Ничего не выйдет',
      'с этими тэгами',
      'т.к. их нету нигде',
    ])

    setArticlesCount(sections.length / data.length)
  }, [])

  const [getMoreButton, setGetMoreButton] = useState(
    <button onClick={getArticles}>Показать ещё</button>
  )

  //   const filtered = articles?.filter(article => !article.isDeleted)

  //   const sectionMapping = {
  //     NEWS: 'Новости',
  //     SEO: 'Seo',
  //     USER: 'Пользовательские',
  //   }

  //   if (isLoading) {
  //     return <div>Загрузка...</div>
  //   }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const d = data.filter(i => i.title.toLowerCase().includes(search))

    setSections(d)
  }

  const searchByTags = (tag: string) => {
    const d = data.filter(i => i.tags?.includes(tag))
    setTag(tag)

    setSections(tag == 'Все' ? data : d)
  }

  function getArticles() {
    setGetMoreButton(getMoreLoading)

    const articles = [...sections, ...data]
    setSections(articles)

    setGetMoreButton(articlesCount <= 3 ? getMoreBtn : <></>)
  }

  const getMoreBtn = <button onClick={getArticles}>Показать ещё</button>

  const getMoreLoading = <div></div>

  return (
    <div className={styles.articles}>
      <div className={styles.articles_top}>
        <h1 id={'h1'}>Статьи и полезная информация</h1>
        <p className="p1" style={{ color: 'var(--service)' }}>
          Найди нужную статью через поиск
        </p>
        <form className={styles.articles_top_bottom} onSubmit={e => handleSubmit(e)}>
          <input
            type="text"
            placeholder="Название статьи"
            onChange={e => setSearch(e.target.value.toLowerCase())}
            value={search}
          />

          <button className="button" type="submit">
            Найти
          </button>
        </form>
      </div>

      <div className={styles.articles_list}>
        <div className={styles.articles_list_tags}>
          {tags.map(i => (
            <p
              style={i != tag ? { color: 'var(--service)', background: 'var(--gray)' } : {}}
              className={'button'}
              onClick={() => searchByTags(i)}
            >
              {i}
            </p>
          ))}
        </div>
        <div className={styles.articles_list_items}>
          {sections.length != 0 ? (
            sections.map((section, index) => (
              <div className={styles.articles_list_item} key={index}>
                <img src={section.imageUrl} alt="" />
                <p className="p2">{section.date}</p>
                <h5 className="h5">{section.title}</h5>
                <p className="p2"> {section.content}</p>
                <section className={styles.articles_list_item_tags}>
                  {section.tags?.map(tag => <span>{tag}</span>)}
                </section>
              </div>
            ))
          ) : (
            <p className="p1" style={{ margin: '0 auto', gridColumn: '1 / span 3' }}>
              Ничего не найдено
            </p>
          )}
        </div>
      </div>
      {sections.length != 0 && <div className={styles.articles_getmore}>{getMoreButton}</div>}
    </div>
  )
}

// import { useGetArticlesQuery } from '@/entities/article'
// import { ArticleDto, SectionDto } from '@/entities/article/article.types'
import img from '@/assets/images/Rectangle 992.png'
import styles from './articles.module.scss'
import { FormEvent, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'

interface artcilesData {
  date: string
  title: string
  imageUrl?: string
  content: string
  tags?: string[]
}

export const Articles = () => {
  //   const { data: articles, isLoading } = useGetArticlesQuery()
  const [search, setSearch] = useState<string>('')
  const [allSections, setAllSections] = useState<artcilesData[]>(data)
  const [tags, setTags] = useState<string[]>([
    'Все',
    'Полезное',
    'Об одежде',
    'Ничего не выйдет',
    'с этими тэгами',
    'т.к. их нету нигде',
  ])
  const [tag, setTag] = useState<string>('Все')
  const [isMoreArticles, setIsMoreArticles] = useState<boolean>(true)
  const [articlesCount, setArticlesCount] = useState<number>(allSections.length / data.length)

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
  }

  const searchByTags = (tag: string) => {
    const d = data.filter(i => i.tags?.includes(tag))
    setTag(tag)

    setAllSections(tag == 'Все' ? data : d)
  }

  function getArticles() {
    setGetMoreButton(getMoreLoading)

    const articles = [...allSections, ...data]
    setAllSections(articles)

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
            onChange={e => setSearch(e.target.value)}
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
          {allSections.map((section, index) => (
            <div className={styles.articles_list_item} key={index}>
              <img src={section.imageUrl} alt="" />
              <p className="p2">{section.date}</p>
              <h5 className="h5">{section.title}</h5>
              <p className="p2"> {section.content}</p>
              <section className={styles.articles_list_item_tags}>
                {section.tags?.map(tag => <span>{tag}</span>)}
              </section>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.articles_getmore}>{getMoreButton}</div>
    </div>
  )
}

const data = Array<artcilesData>(12).fill({
  date: '20 января 2025',
  title: 'Какие ткани используются',
  imageUrl: img,
  content:
    'Мы хотим познакомить вас с правилами ухода за одеждой с климат-контролем, ведь от этого напрямую зависят ее свойства и ваш комфорт при ее использовании. Подробно об этом можно прочитать в нашей статье.',
  tags: ['Полезное', 'Об одежде'],
})

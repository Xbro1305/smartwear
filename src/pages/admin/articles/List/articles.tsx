import list from '@/assets/images/activity-source.svg'
import { useGetArticlesQuery } from '@/entities/article'
import { ArticleDto, SectionDto } from '@/entities/article/article.types'
import { Select } from '@/widgets/customSelect/select'
import { CiFilter } from 'react-icons/ci'
import { FaSearch } from 'react-icons/fa'

import styles from './articles.module.scss'

import { Article } from './article'

export const ArticlesList = () => {
  // Хук для получения списка статей
  const { data: articles, isLoading } = useGetArticlesQuery()

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <div className={styles.articles}>
      <div className={styles.articles_top}>
        <h1 id={'h1'}>Статьи</h1>
        <section className={styles.articles_top_left}>
          <label>
            <FaSearch />
            <input placeholder={'Поиск'} type={'text'} />
          </label>
          <Select options={[{ image: list, value: 'list' }]} />
          <button className={styles.articles_top_left_button}>
            <CiFilter />
          </button>
        </section>
      </div>

      <div className={styles.articles_list}>
        {articles
          ?.reduce<SectionDto[]>((sections, article: ArticleDto) => {
            const section = sections.find(s => s.category === article.section)

            if (section) {
              section.articles.push(article)
            } else {
              sections.push({ articles: [article], category: article.section })
            }

            return sections
          }, [])
          .map((section, index) => <Article index={index} key={index} section={section} />)}
      </div>
    </div>
  )
}

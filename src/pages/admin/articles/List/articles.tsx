import { Select } from '@/widgets/customSelect/select'
import styles from './articles.module.scss'
import { FaSearch } from 'react-icons/fa'
import list from '@/assets/images/activity-source.svg'
import { CiFilter } from 'react-icons/ci'
import { Article } from './article'

export const ArticlesList = () => {
  return (
    <div className={styles.articles}>
      <div className={styles.articles_top}>
        <h1 id="h1">Статьи</h1>
        <section className={styles.articles_top_left}>
          <label>
            <FaSearch />
            <input type="text" placeholder="Поиск" />
          </label>
          <Select options={[{ image: list, value: 'list' }]} />
          <button className={styles.articles_top_left_button}>
            <CiFilter />
          </button>
        </section>
      </div>

      <div className={styles.articles_list}>
        {articlesData.map((section, index) => (
          <Article section={section} index={index} />
        ))}
      </div>
    </div>
  )
}

// articlesData.ts
export const articlesData = [
  {
    category: 'Пользовательские',
    articles: [
      { title: 'Как сделать заказ', draft: false },
      { title: 'Как стирать одежду с климат-контролем', draft: false },
      { title: 'Утеплитель Valtherm (Вальтерм)', draft: false },
      { title: 'Утеплитель Valtherm (Вальтерм)', draft: true },
    ],
  },
  {
    category: 'SEO',
    articles: [
      { title: 'Как сделать заказ', draft: false },
      { title: 'Как стирать одежду с климат-контролем', draft: false },
      { title: 'Утеплитель Valtherm (Вальтерм)', draft: false },
    ],
  },
  {
    category: 'Новости',
    articles: [
      { title: 'Как сделать заказ', draft: false },
      { title: 'Как стирать одежду с климат-контролем', draft: false },
    ],
  },
]

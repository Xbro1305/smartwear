import { useState } from 'react'

import { FaEye, FaPen, FaTrash } from 'react-icons/fa'

import styles from './articles.module.scss'
const { ARTICLES, CLONEARTICLE, CREATEARTICLE, EDITARTICLE } = ROUTER_PATHS

import { useNavigate } from 'react-router-dom'

import { useGetArticlesQuery } from '@/entities/article'
import { useDeleteArticleMutation } from '@/entities/article'
import { Section, sectionMapping } from '@/entities/article/article.types'
import { SectionDto } from '@/entities/article/article.types'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { FaSortAmountUp } from 'react-icons/fa'
import { IoIosArrowDown } from 'react-icons/io'
import { IoCopy } from 'react-icons/io5'

interface ArticleProps {
  index: number
  section: SectionDto
}

export const Article: React.FC<ArticleProps> = ({ index, section }) => {
  const [opened, setOpened] = useState(true)
  const navigate = useNavigate()
  const [deleteArticle] = useDeleteArticleMutation()
  // const [createArticle] = useCreateArticleMutation()

  const { data: articles } = useGetArticlesQuery()

  const handleCopy = async (id: number) => {
    const confirm = window.confirm('Копировать статью?')

    if (!confirm) {
      return
    }

    const existingArticle = articles?.find(article => article.id === id)

    if (!existingArticle) {
      alert('Ошибка: статья не найдена.')

      return
    }

    navigate(`${CLONEARTICLE}/${existingArticle.id}`)
  }

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Вы точно хотите удалить эту статью?')

    if (!confirm) {
      return
    }

    try {
      await deleteArticle(id)
      alert('Удалено успешно!')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.articles_section} key={index}>
      <h2 id={'h2'}>
        <p onClick={() => setOpened(!opened)}>{sectionMapping[section.category as Section]}</p>
        <p
          onClick={() => setOpened(!opened)}
          style={{ transform: opened ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <IoIosArrowDown />
        </p>
        <button className={styles.articles_top_left_button}>
          <FaSortAmountUp />
        </button>
      </h2>
      {opened && (
        <button
          className={styles.articles_section_createButton}
          onClick={() => navigate(CREATEARTICLE)}
        >
          + Добавить новую статью
        </button>
      )}
      {opened && (
        <ul className={styles.articles_section_list}>
          {section.articles.map((article, articleIndex) => (
            <li
              className={styles.articles_section_list_item}
              key={articleIndex}
              style={{
                background: article.draft ? '#F7F7F7' : 'white',
                color: article.draft ? '#202224aa' : '#202224',
              }}
            >
              <h2>
                {article.draft ? <strong>Черновик:</strong> : null} {article.title}
              </h2>
              <button onClick={() => navigate(`${EDITARTICLE}/${article.id}`)}>
                <FaPen />
              </button>
              <button onClick={() => handleCopy(article.id)}>
                <IoCopy />
              </button>
              <a href={`${ARTICLES}/${article.keyword}`} rel={'noreferrer'} target={'_blank'}>
                <FaEye />
              </a>
              <button onClick={() => handleDelete(article.id)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

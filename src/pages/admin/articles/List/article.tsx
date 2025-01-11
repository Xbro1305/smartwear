import { useState } from 'react'

import { FaEye, FaPen, FaTrash } from 'react-icons/fa'

import styles from './articles.module.scss'
const { CREATEARTICLE, EDITARTICLE } = ROUTER_PATHS

import { useNavigate } from 'react-router-dom'

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

  return (
    <div className={styles.articles_section} key={index}>
      <h2 id={'h2'}>
        <p onClick={() => setOpened(!opened)}>{section.category}</p>
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
              <button>
                <IoCopy />
              </button>
              <button>
                <FaEye />
              </button>
              <button>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

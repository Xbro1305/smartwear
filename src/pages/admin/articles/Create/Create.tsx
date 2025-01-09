import { useState } from 'react'
import styles from './Create.module.scss'
import { FaCheck, FaPen } from 'react-icons/fa'
import { LuFilePen } from 'react-icons/lu'
import { Editor } from './editor'

import { ArticleDto, ParagraphDto } from '@/entities/article/article.types'

export const CreateArticle = () => {
  const [editingTitle, setEditingTitle] = useState<boolean>(true)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [metaTitle, setMetaTitle] = useState<string>('')
  const [metaDescription, setMetaDescription] = useState<string>('')
  const [paragraphs, setParagraphs] = useState<ParagraphDto[]>([])

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const articleData: ArticleDto = {
      composition: 'LEFT',
      description,
      id: Date.now(),
      metaDescription,
      metaTitle,
      paragraphs,
      Section: 'SEO',
      title,
      userId: 123,
    }
    console.log('Article Data:', articleData)
  }

  const addParagraph = () => {
    setParagraphs([
      ...paragraphs,
      { id: Date.now(), title: '', content: '', order: paragraphs.length + 1, articleId: 1 },
    ])
  }

  const handleParagraphChange = (index: number, content: string) => {
    const updatedParagraphs = [...paragraphs]
    updatedParagraphs[index].content = content
    setParagraphs(updatedParagraphs)
  }

  return (
    <form onSubmit={e => handleSubmit(e)} className={styles.createArticle}>
      <div className={styles.createArticle_left}>
        <div className={styles.createArticle_top}>
          {editingTitle == true && (
            <div className={styles.createArticle_top_title}>
              <input
                id="h2"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Заголовок статьи"
              />
              <button>
                <FaCheck
                  onClick={() => {
                    if (title != '') setEditingTitle(false)
                    else alert('Заполните заголовок')
                  }}
                />
              </button>
              <span className={styles.createArticle_top_type}>Seo</span>
            </div>
          )}
          {editingTitle == false && (
            <div className={styles.createArticle_top_title}>
              <h1 id="h2">{title}</h1>
              <button>
                <FaPen onClick={() => setEditingTitle(true)} />
              </button>
              <span className={styles.createArticle_top_type}>Seo</span>
            </div>
          )}
        </div>
        <Editor />
        {paragraphs.map((paragraph, index) => (
          <Editor
            key={paragraph.id}
            value={paragraph.content}
            onChange={content => handleParagraphChange(index, content)}
          />
        ))}
        <button
          className={styles.createArticle_paragraphs_add}
          type="button"
          onClick={addParagraph}
        >
          +
        </button>
      </div>

      <div className={styles.createArticle_right}>
        <div className={styles.createArticle_top_buttons}>
          <button className={styles.createArticle_top_buttons_left}>
            <LuFilePen />
            Сохранить черновик
          </button>
          <button className={styles.createArticle_top_buttons_right}>Опубликовать</button>
        </div>
        
      </div>
    </form>
  )
}

/* eslint-disable max-lines */
import { useEffect, useState } from 'react'

import cat from '@/assets/images/Cat.png'
import {
  useCreateParagraphMutation,
  useSearchArticleByKeywordQuery,
  useUpdateArticleMutation,
} from '@/entities/article'
import {
  ArticleDto,
  Composition,
  CreateParagraphDto,
  ParagraphDto,
  ParagraphinArticleDto,
  UpdateArticleDto,
} from '@/entities/article/article.types'
import { Section } from '@/entities/article/article.types'
import {
  useUploadArticleImageMutation,
  useUploadParagraphImageMutation,
} from '@/entities/image/image.api'
import { CiAlignLeft, CiAlignRight } from 'react-icons/ci'
import { FaCheck, FaPen } from 'react-icons/fa'
import { FaChartBar, FaRegNewspaper, FaUser } from 'react-icons/fa'
import { LuFilePen } from 'react-icons/lu'

import styles from '../Create/Create.module.scss'

import { Editor } from '../Create/editor'

export const EditArticle = () => {
  const [editingTitle, setEditingTitle] = useState<boolean>(true)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [metaTitle, setMetaTitle] = useState<string>('')
  const [metaDescription, setMetaDescription] = useState<string>('')
  const [paragraphs, setParagraphs] = useState<ParagraphinArticleDto[]>([])
  const [file, setFile] = useState<any>(null)
  const [url, setUrl] = useState<string>('')
  const [section, setSection] = useState<any>()
  const [composition, setComposition] = useState<any>()

  const { data: article, isLoading } = useSearchArticleByKeywordQuery(title || '')
  const [updateArticle] = useUpdateArticleMutation()
  const [createParagraph] = useCreateParagraphMutation()

  const [uploadArticleImage] = useUploadArticleImageMutation()
  const [uploadParagraphImage] = useUploadParagraphImageMutation()

  useEffect(() => {
    if (article) {
      setTitle(article.title)
      setDescription(article.description)
      setMetaTitle(article.metaTitle)
      setMetaDescription(article.metaDescription)
      setComposition(article.composition)
      setSection(article.section)
      setParagraphs(article.paragraphs)
    }
  }, [article])

  console.log(composition)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const articleData: UpdateArticleDto = {
      composition,
      description,
      metaDescription,
      metaTitle,
      section,
      title,
    }

    try {
      await updateArticle({ data: articleData, id: article?.id || 0 })

      if (paragraphs.length > 0) {
        for (const paragraph of paragraphs) {
          const paragraphData: CreateParagraphDto = {
            articleId: article?.id || 0,
            content: paragraph.content,
            order: paragraph.order,
            title: paragraph.title,
          }

          await createParagraph(paragraphData)
        }
      }

      if (file && article) {
        await uploadArticleImage({ file, id: article?.id })

        for (let i = 0; i < paragraphs.length; i++) {
          const paragraph = paragraphs[i]
          const paragraphId = `${article.id}-${paragraph.order}`

          if (paragraph.imageFile) {
            await uploadParagraphImage({ file: paragraph.imageFile, paragraphId })
          }
        }
      }

      console.log('Статья и параграфы успешно обновлены')
    } catch (error) {
      console.error('Ошибка при обновлении статьи или создании параграфов', error)
    }
  }

  const addParagraph = () => {
    setParagraphs([
      ...paragraphs,
      {
        content: '',
        id: Date.now(),
        order: paragraphs.length + 1,
        title: '',
      },
    ])
  }

  const handleParagraphChange = (index: number, content: string) => {
    const updatedParagraphs = [...paragraphs]

    updatedParagraphs[index].content = content
    setParagraphs(updatedParagraphs)
  }

  return (
    <form className={styles.createArticle} onSubmit={e => handleSubmit(e)}>
      <div className={styles.createArticle_left}>
        <div className={styles.createArticle_top}>
          {editingTitle == true && (
            <div className={styles.createArticle_top_title}>
              <input
                id={'h2'}
                onChange={e => setTitle(e.target.value)}
                placeholder={'Заголовок статьи'}
                value={title}
              />
              <button>
                <FaCheck
                  onClick={() => {
                    if (title != '') {
                      setEditingTitle(false)
                    } else {
                      alert('Заполните заголовок')
                    }
                  }}
                />
              </button>
              <span className={styles.createArticle_top_type}>Seo</span>
            </div>
          )}
          {editingTitle == false && (
            <div className={styles.createArticle_top_title}>
              <h1 id={'h2'}>{title}</h1>
              <button>
                <FaPen onClick={() => setEditingTitle(true)} />
              </button>
              <span className={styles.createArticle_top_type}>Seo</span>
            </div>
          )}
        </div>
        <div className={styles.createArticle_editorLabel}>
          <p>Описание статьи</p>
          <Editor onChange={setDescription} value={description} />
          <label className={styles.createArticle_photoLabel}>
            <p className={styles.createArticle_photoLabel_title}>Обложка для статьи</p>
            <div className={styles.createArticle_photoLabel_img}>
              <input
                accept={'image/*'}
                className={'inp'}
                name={'photo'}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    const img = URL.createObjectURL(e.target.files[0])

                    setFile(img)
                  }
                }}
                size={1}
                type={'file'}
              />
              <img alt={'cat'} src={cat} />
              <p>Загрузить изображение</p>
              <span>Добавьте фотографию с компьютера</span>
            </div>
          </label>
        </div>
        <div className={styles.createArticle_editorLabel}>
          {paragraphs.map((paragraph, index) => (
            <>
              <p>Описание абзаца {index + 1}</p>
              <Editor
                key={paragraph.id}
                onChange={content => handleParagraphChange(index, content)}
                value={paragraph.content}
              />
              <label className={styles.createArticle_photoLabel}>
                <p className={styles.createArticle_photoLabel_title}>
                  Картинка для абзацa {index + 1}
                </p>
                <div className={styles.createArticle_photoLabel_img}>
                  <input
                    accept={'image/*'}
                    className={'inp'}
                    name={'photo'}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        const img = URL.createObjectURL(e.target.files[0])

                        setFile(img)
                      }
                    }}
                    size={1}
                    type={'file'}
                  />
                  <img alt={'cat'} src={cat} />
                  <p>Загрузить изображение</p>
                  <span>Добавьте фотографию с компьютера</span>
                </div>
              </label>
            </>
          ))}
        </div>
        <button
          className={styles.createArticle_paragraphs_add}
          onClick={addParagraph}
          type={'button'}
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
        <div className={styles.createArticle_photoLabel}>
          <p className={styles.createArticle_photoLabel_title}>Абзацы</p>
          <div className={styles.createArticle_photoLabel_content}>
            {paragraphs.map((paragraph, index) => (
              <div className={styles.createArticle_photoLabel_paragraphs} key={paragraph.id}>
                <p>Абзац {index + 1}</p>
                <button
                  onClick={() => {
                    setParagraphs(paragraphs.filter(p => p.id !== paragraph.id))
                  }}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          <div className={styles.createArticle_photoLabel_buttons}>
            <button
              className={styles.createArticle_photoLabel_buttons_left}
              onClick={() => setParagraphs([])}
            >
              Очистить всё
            </button>
            <button
              className={styles.createArticle_photoLabel_buttons_right}
              onClick={addParagraph}
            >
              Добавить абзац
            </button>
          </div>
        </div>
        <div className={styles.createArticle_photoLabel}>
          <p className={styles.createArticle_photoLabel_title}>Тип статьи и композиция</p>
          <div className={styles.createArticle_photoLabel_content}>
            <p>Композиция</p>
            <div className={styles.createArticle_photoLabel_composition}>
              <label
                onClick={() => setComposition(Composition.RIGHT)}
                style={{
                  alignItems: 'center',
                  background: composition === Composition.RIGHT ? '#cbd5e1' : 'white',
                  display: 'flex',
                }}
              >
                <CiAlignRight />
                <input
                  name={'composition'}
                  onChange={() => setComposition(Composition.RIGHT)}
                  type={'radio'}
                  value={Composition.RIGHT}
                />
              </label>

              <label
                onClick={() => setComposition(Composition.LEFT)}
                style={{
                  alignItems: 'center',
                  background: composition === Composition.LEFT ? '#cbd5e1' : 'white',
                  display: 'flex',
                }}
              >
                <CiAlignLeft />
                <input
                  name={'composition'}
                  onChange={() => setComposition(Composition.LEFT)}
                  type={'radio'}
                  value={Composition.LEFT}
                />
              </label>
            </div>
            <label className={styles.createArticle_photoLabel_section}>
              <section>
                <FaChartBar />
                <p>Seo</p>{' '}
              </section>
              <input name={'section'} type={'radio'} value={Section.SEO} />
            </label>
            <label className={styles.createArticle_photoLabel_section}>
              <section>
                <FaUser />
                <p>Пользовательские</p>{' '}
              </section>
              <input name={'section'} type={'radio'} value={Section.USER} />
            </label>
            <label className={styles.createArticle_photoLabel_section}>
              <section>
                <FaRegNewspaper />
                <p>Новости</p>{' '}
              </section>
              <input name={'section'} type={'radio'} value={Section.NEWS} />
            </label>
          </div>
        </div>
        <div className={styles.createArticle_photoLabel}>
          <p className={styles.createArticle_photoLabel_title}>URL настройки</p>
          <div className={styles.createArticle_photoLabel_url}>
            <label>
              <p>URL на статью</p>
              <input
                id={''}
                name={'url'}
                onChange={e => setUrl(e.target.value)}
                placeholder={'Ссылка на статью'}
                type={'text'}
                value={url}
              />
            </label>
            <label>
              <p>Meta-tag title</p>
              <textarea
                id={''}
                name={'metaTitle'}
                onChange={e => setMetaTitle(e.target.value)}
                placeholder={'Seo-заголовок'}
                value={metaTitle}
              ></textarea>
            </label>
            <label>
              <p>Meta-tag description</p>
              <textarea
                id={''}
                name={'metaDescription'}
                onChange={e => setMetaDescription(e.target.value)}
                placeholder={'Seo-описание'}
                value={metaDescription}
              ></textarea>
            </label>
          </div>
          <div className={styles.createArticle_photoLabel_buttons}>
            {/* Очистить всё */}
            {/* Сохранить */}

            <button
              className={styles.createArticle_photoLabel_buttons_left}
              onClick={() => {
                setMetaDescription('')
                setMetaTitle('')
              }}
            >
              Очистить всё
            </button>
            <button className={styles.createArticle_photoLabel_buttons_right} type={'submit'}>
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

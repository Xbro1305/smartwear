/* eslint-disable max-lines */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import cat from '@/assets/images/Cat.png'
import {
  useCreateParagraphMutation,
  useGetArticleByIdQuery,
  useUpdateArticleMutation,
} from '@/entities/article'
import {
  Composition,
  CreateParagraphDto,
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
  const [paragraphsWithImg, setParagraphsWithImg] = useState<number[]>([])

  const { id } = useParams<{ id: string }>()
  const { data: article, isError, isLoading } = useGetArticleByIdQuery(Number(id))
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]) // Сохраняем файл в состоянии
    }
  }

  const handleParagraphImageChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null

    alert(file)

    if (file) {
      const updatedParagraphs = [...paragraphs]

      updatedParagraphs[index].imageFile = file
      setParagraphs(updatedParagraphs)
    }
  }

  const addParagraph = () => {
    if (section === Section.NEWS) return alert('Нельзя добавить абзац в новости')
    setParagraphs([
      ...paragraphs,
      {
        content: '',
        id: Date.now(),
        order: paragraphs.length + 1,
        title: 'Абзац' + (paragraphs.length + 1),
      },
    ])
  }

  const handleParagraphChange = (index: number, content: string) => {
    const updatedParagraphs = [...paragraphs]

    updatedParagraphs[index].content = content
    setParagraphs(updatedParagraphs)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error loading article</div>
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
          <Editor isimg onChange={setDescription} value={description} />
          <div className={styles.createArticle_photoLabel}>
            <p className={styles.createArticle_photoLabel_title}>Обложка для статьи</p>
            <label
              style={{ padding: file ? '20px' : '40px' }}
              className={styles.createArticle_photoLabel_img}
            >
              <input
                accept={'image/*'}
                className={'inp'}
                name={'photo'}
                onChange={handleFileChange}
                size={1}
                type={'file'}
              />

              {file != null ? (
                <img alt={'selected image'} src={URL.createObjectURL(file as Blob)} />
              ) : (
                <>
                  <img alt={'default'} src={cat} />
                  <p>Загрузить изображение</p>
                  <span>Добавьте фотографию с компьютера</span>
                </>
              )}
            </label>
          </div>
        </div>
        <div className={styles.createArticle_editorLabel}>
          {paragraphs.map((paragraph, index) => (
            <>
              <p>Описание {paragraph.title}</p>
              <Editor
                isimg={false}
                key={paragraph.id}
                onChange={content => handleParagraphChange(index, content)}
                setimg={() => {
                  setParagraphsWithImg([...paragraphsWithImg, index])
                }}
                value={paragraph.content}
              />
              {paragraphsWithImg.includes(index) && (
                <div className={styles.createArticle_photoLabel}>
                  <p className={styles.createArticle_photoLabel_title}>
                    Картинка для абзацa {index + 1}
                    <button
                      className={styles.createArticle_photoLabel_close}
                      onClick={() => {
                        const updatedParagraphs = [...paragraphs]

                        updatedParagraphs[index].imageFile = undefined
                        setParagraphs(updatedParagraphs)

                        setParagraphsWithImg(paragraphsWithImg.filter(i => i !== index))
                      }}
                    >
                      &times;
                    </button>
                  </p>
                  <label
                    className={styles.createArticle_photoLabel_img}
                    style={{ padding: paragraph.imageFile ? '20px' : '40px' }}
                  >
                    <input
                      accept={'image/*'}
                      className={'inp'}
                      name={'photo'}
                      onChange={e => handleParagraphImageChange(index, e)}
                      size={1}
                      type={'file'}
                    />
                    {/* Показываем изображение, если оно выбрано */}
                    {paragraph.imageFile ? (
                      <img
                        alt={'selected image'}
                        src={URL.createObjectURL(paragraph.imageFile as Blob)}
                      />
                    ) : (
                      <>
                        <img alt={'default'} src={cat} />
                        <p>Загрузить изображение</p>
                        <span>Добавьте фотографию с компьютера</span>
                      </>
                    )}
                  </label>
                </div>
              )}
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
                <input
                  onChange={e => {
                    const updatedParagraphs = [...paragraphs]

                    updatedParagraphs[index].title = e.target.value
                    setParagraphs(updatedParagraphs)
                  }}
                  type={'text'}
                  value={paragraph.title}
                />
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
            <label
              onClick={() => setSection(Section.SEO)}
              className={styles.createArticle_photoLabel_section}
            >
              <section>
                <FaChartBar />
                <p>Seo</p>{' '}
              </section>
              <input
                checked={section === Section.SEO}
                name={'section'}
                type={'radio'}
                value={Section.SEO}
              />
            </label>
            <label
              onClick={() => setSection(Section.USER)}
              className={styles.createArticle_photoLabel_section}
            >
              <section>
                <FaUser />
                <p>Пользовательские</p>{' '}
              </section>
              <input
                checked={section === Section.USER}
                name={'section'}
                type={'radio'}
                value={Section.USER}
              />
            </label>
            <label
              onClick={() => {
                setSection(Section.NEWS)
                setParagraphs([])
              }}
              className={styles.createArticle_photoLabel_section}
            >
              <section>
                <FaRegNewspaper />
                <p>Новости</p>{' '}
              </section>
              <input
                checked={section === Section.NEWS}
                name={'section'}
                type={'radio'}
                value={Section.NEWS}
              />
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

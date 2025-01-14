/* eslint-disable max-lines */
import { useEffect, useState } from 'react'

import cat from '@/assets/images/Cat.png'
import { useCreateArticleMutation, useGetArticleByIdQuery } from '@/entities/article'
import { sectionMapping } from '@/entities/article/article.types'
import {
  Composition,
  CreateArticleDto,
  CreateParagraphinArticleDto,
  Section,
} from '@/entities/article/article.types'
import { useGetMeQuery } from '@/entities/auth'
import {
  useGetImageQuery,
  useUploadArticleImageMutation,
  useUploadParagraphImageMutation,
} from '@/entities/image/image.api'
import { CiAlignLeft, CiAlignRight } from 'react-icons/ci'
import { FaCheck, FaPen } from 'react-icons/fa'
import { FaChartBar, FaRegNewspaper, FaUser } from 'react-icons/fa'
import { LuFilePen } from 'react-icons/lu'

import styles from '../Create/Create.module.scss'

import { Editor } from '../Create/editor'
import { useParams } from 'react-router-dom'

export const CloneArticle = () => {
  const [editingTitle, setEditingTitle] = useState<boolean>(true)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [metaTitle, setMetaTitle] = useState<string>('')
  const [draft, setDraft] = useState<boolean>(false)
  const [metaDescription, setMetaDescription] = useState<string>('')
  const [paragraphs, setParagraphs] = useState<CreateParagraphinArticleDto[]>([])
  const [file, setFile] = useState<any>(null)
  const [url, setUrl] = useState<string>('')
  const [section, setSection] = useState<Section>(Section.SEO)
  const [composition, setComposition] = useState<Composition>(Composition.LEFT)
  const [paragraphsWithImg, setParagraphsWithImg] = useState<number[]>([])
  const [buttonValue, setButtonValue] = useState<string>('Опубликовать')

  const [createArticle] = useCreateArticleMutation()
  const [uploadArticleImage] = useUploadArticleImageMutation()
  const [uploadParagraphImage] = useUploadParagraphImageMutation()

  const { id } = useParams<{ id: string }>()
  const { data: article, isError, isLoading } = useGetArticleByIdQuery(Number(id))
  const { data: articleImage } = useGetImageQuery({
    id: article?.id.toString() as string,
    type: 'articles',
  })

  const { data: user } = useGetMeQuery()

  useEffect(() => {
    if (article) {
      setTitle(article.title + ' (Копия)')
      setDescription(article.description)
      setMetaTitle(article.metaTitle)
      setMetaDescription(article.metaDescription)
      setComposition(article.composition)
      setSection(article.section)
      setParagraphs(article.paragraphs)
      setFile(article?.imageUrl || null)
      // setUrl(article.keyword)
      console.log(article)
    }
  }, [article])

  useEffect(() => {
    if (articleImage) {
      setFile(URL.createObjectURL(articleImage))
    }
  }, [articleImage])

  const handleSubmit = async (e: any, draft: boolean) => {
    e.preventDefault()

    const articleData: CreateArticleDto = {
      composition,
      description,
      draft,
      keyword: url,
      metaDescription,
      metaTitle,
      paragraphs,
      section,
      title,
      userId: user?.id || 1,
    }

    try {
      const result = await createArticle(articleData).unwrap()
      const articleId = result.id

      if (file) {
        await uploadArticleImage({ file, id: articleId })
      }

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i]
        const paragraphId = `${articleId}-${paragraph.order}`

        if (paragraph.imageFile) {
          await uploadParagraphImage({ file: paragraph.imageFile, paragraphId })
        }
      }
      setButtonValue('Опубликовано')

      alert('Статья успешно создана!')
    } catch (err) {
      console.error('Error creating article:', err)
      alert('Ошибка при создании статьи!')
    }
  }

  const addParagraph = () => {
    if (section === Section.NEWS) {
      return alert('Нельзя добавить абзац в новости')
    }
    setParagraphs([
      ...paragraphs,
      {
        content: '',

        imageFile: undefined,
        order: paragraphs.length + 1,
        title: 'Абзац ' + (paragraphs.length + 1),
      },
    ])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(URL.createObjectURL(e.target.files[0])) // Сохраняем файл в состоянии
    }
  }

  const handleParagraphChange = (index: number, content: string) => {
    const updatedParagraphs = [...paragraphs]

    updatedParagraphs[index].content = content
    setParagraphs(updatedParagraphs)
  }

  const handleFileDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile(URL.createObjectURL(event.dataTransfer.files[0]))
      event.dataTransfer.clearData()
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault() // Предотвращает открытие файла в новой вкладке
  }

  const handleParagraphImageChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null

    if (file) {
      const updatedParagraphs = [...paragraphs]

      updatedParagraphs[index].imageFile = file
      setParagraphs(updatedParagraphs)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error loading article</div>
  }

  return (
    <form className={styles.createArticle} onSubmit={e => handleSubmit(e, draft)}>
      <div className={styles.createArticle_left}>
        <div className={styles.createArticle_top}>
          {editingTitle == true && (
            <div className={styles.createArticle_top_title}>
              <input
                id={'h2'}
                onChange={e => {
                  setTitle(e.target.value)
                  setButtonValue('Опубликовать')
                }}
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
              <span className={styles.createArticle_top_type}>{sectionMapping[section]}</span>
            </div>
          )}
          {editingTitle == false && (
            <div className={styles.createArticle_top_title}>
              <h1 id={'h2'}>{title}</h1>
              <button>
                <FaPen onClick={() => setEditingTitle(true)} />
              </button>
              <span className={styles.createArticle_top_type}>{sectionMapping[section]}</span>
            </div>
          )}
        </div>
        <div className={styles.createArticle_editorLabel}>
          <p>Описание статьи</p>
          <Editor
            isimg
            onChange={content => {
              setDescription(content)
              setButtonValue('Опубликовать')
            }}
            value={description}
          />
          <div className={styles.createArticle_photoLabel}>
            <p className={styles.createArticle_photoLabel_title}>Обложка для статьи</p>
            <label
              className={styles.createArticle_photoLabel_img}
              onDragOver={handleDragOver}
              onDrop={handleFileDrop}
              style={{ padding: file ? '20px' : '40px' }}
            >
              <input
                accept={'image/*'}
                className={'inp'}
                name={'photo'}
                onChange={e => {
                  handleFileChange(e)
                  setButtonValue('Опубликовать')
                }}
                size={1}
                type={'file'}
              />

              {file != null ? (
                <img alt={'selected image'} src={file} />
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
                key={paragraph.order}
                onChange={content => {
                  handleParagraphChange(index, content)
                  setButtonValue('Опубликовать')
                }}
                setimg={() => {
                  paragraphsWithImg.includes(index)
                    ? setParagraphsWithImg(paragraphsWithImg.filter(i => i !== index))
                    : setParagraphsWithImg([...paragraphsWithImg, index])
                  setButtonValue('Опубликовать')
                }}
                value={paragraph.content}
              />
              {paragraphsWithImg.includes(index) && (
                <div className={styles.createArticle_photoLabel}>
                  <p className={styles.createArticle_photoLabel_title}>
                    <span>Картинка для {paragraph.title}</span>
                    <button
                      className={styles.createArticle_photoLabel_close}
                      onClick={() => {
                        const updatedParagraphs = [...paragraphs]

                        setButtonValue('Опубликовать')
                        updatedParagraphs[index].imageFile = undefined
                        setParagraphs(updatedParagraphs)
                        setParagraphsWithImg(paragraphsWithImg.filter(i => i !== index))
                      }}
                      style={{ marginLeft: 'auto' }}
                      type={'button'}
                    >
                      &times;
                    </button>
                  </p>
                  <label
                    className={styles.createArticle_photoLabel_img}
                    onDragOver={e => e.preventDefault()}
                    onDrop={event => {
                      event.preventDefault()
                      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                        const file = event.dataTransfer.files[0]
                          ? event.dataTransfer.files[0]
                          : null

                        if (file) {
                          const updatedParagraphs = [...paragraphs]

                          updatedParagraphs[index].imageFile = file
                          setParagraphs(updatedParagraphs)
                        }

                        event.dataTransfer.clearData()
                      }
                    }}
                    style={{ padding: paragraph.imageFile ? '20px' : '40px' }}
                  >
                    <input
                      accept={'image/*'}
                      className={'inp'}
                      name={'photo'}
                      onChange={e => {
                        handleParagraphImageChange(index, e)
                        setButtonValue('Опубликовать')
                      }}
                      size={1}
                      type={'file'}
                    />
                    {/* Показываем изображение, если оно выбрано */}
                    {paragraph.imageFile ? (
                      <img alt={'selected image'} src={paragraph.imageFile} />
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

          <button
            className={styles.createArticle_paragraphs_add}
            onClick={() => {
              addParagraph()
              setButtonValue('Опубликовать')
            }}
            type={'button'}
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.createArticle_right}>
        <div className={styles.createArticle_top_buttons}>
          <button
            className={styles.createArticle_top_buttons_left}
            onClick={e => {
              setDraft(true)
              handleSubmit(e, draft)
            }}
            type={'button'}
          >
            <LuFilePen />
            Сохранить черновик
          </button>
          <button
            className={styles.createArticle_top_buttons_right}
            disabled={buttonValue === 'Опубликовано'}
            onClick={e => {
              setDraft(false)
              handleSubmit(e, draft)
            }}
            type={'button'}
          >
            {buttonValue}
          </button>
        </div>
        <div className={styles.createArticle_photoLabel}>
          <p className={styles.createArticle_photoLabel_title}>Абзацы</p>
          <div className={styles.createArticle_photoLabel_content}>
            {paragraphs.map((paragraph, index) => (
              <div className={styles.createArticle_photoLabel_paragraphs} key={paragraph.order}>
                <input
                  onBlur={e => {
                    if (e.target.value === '') {
                      const updatedParagraphs = [...paragraphs]

                      updatedParagraphs[index].title = 'Абзац' + (index + 1)
                      setParagraphs(updatedParagraphs)
                    }
                  }}
                  onChange={e => {
                    const updatedParagraphs = [...paragraphs]

                    setButtonValue('Опубликовать')
                    updatedParagraphs[index].title = e.target.value
                    setParagraphs(updatedParagraphs)
                  }}
                  type={'text'}
                  value={paragraph.title}
                />
                <button
                  onClick={() => {
                    setButtonValue('Опубликовать')
                    setParagraphs(paragraphs.filter(p => p.order !== paragraph.order))
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
              onClick={() => {
                setParagraphs([])
                setButtonValue('Опубликовать')
              }}
              type={'button'}
            >
              Очистить всё
            </button>
            <button
              className={styles.createArticle_photoLabel_buttons_right}
              onClick={() => {
                addParagraph()
                setButtonValue('Опубликовать')
              }}
              type={'button'}
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
                onClick={() => {
                  setComposition(Composition.RIGHT)
                  setButtonValue('Опубликовать')
                }}
                style={{
                  alignItems: 'center',
                  background: composition === Composition.RIGHT ? '#cbd5e1' : 'white',
                  display: 'flex',
                }}
              >
                <CiAlignRight />
                <input
                  name={'composition'}
                  onChange={() => {
                    setComposition(Composition.RIGHT)
                    setButtonValue('Опубликовать')
                  }}
                  type={'radio'}
                  value={Composition.RIGHT}
                />
              </label>

              <label
                onClick={() => {
                  setComposition(Composition.LEFT)
                  setButtonValue('Опубликовать')
                }}
                style={{
                  alignItems: 'center',
                  background: composition === Composition.LEFT ? '#cbd5e1' : 'white',
                  display: 'flex',
                }}
              >
                <CiAlignLeft />
                <input
                  name={'composition'}
                  onChange={() => {
                    setComposition(Composition.LEFT)
                    setButtonValue('Опубликовать')
                  }}
                  type={'radio'}
                  value={Composition.LEFT}
                />
              </label>
            </div>
            <label
              className={styles.createArticle_photoLabel_section}
              onClick={() => {
                setSection(Section.SEO)
                setButtonValue('Опубликовать')
              }}
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
              className={styles.createArticle_photoLabel_section}
              onClick={() => {
                setSection(Section.USER)
                setButtonValue('Опубликовать')
              }}
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
              className={styles.createArticle_photoLabel_section}
              onClick={() => {
                setSection(Section.NEWS)
                setParagraphs([])
                setButtonValue('Опубликовать')
              }}
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
                onChange={e => {
                  setUrl(e.target.value)
                  setButtonValue('Опубликовать')
                }}
                placeholder={'Ссылка на статью'}
                required
                type={'text'}
                value={url}
              />
            </label>
            <label>
              <p>Meta-tag title</p>
              <textarea
                id={''}
                name={'metaTitle'}
                onChange={e => {
                  setMetaTitle(e.target.value)
                  setButtonValue('Опубликовать')
                }}
                placeholder={'Seo-заголовок'}
                required
                value={metaTitle}
              ></textarea>
            </label>
            <label>
              <p>Meta-tag description</p>
              <textarea
                id={''}
                name={'metaDescription'}
                onChange={e => {
                  setMetaDescription(e.target.value)
                  setButtonValue('Опубликовать')
                }}
                placeholder={'Seo-описание'}
                required
                value={metaDescription}
              ></textarea>
            </label>
          </div>
          <div className={styles.createArticle_photoLabel_buttons}>
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

/* eslint-disable max-lines */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import cat from '@/assets/images/Cat.png'
import { useDeleteParagraphMutation } from '@/entities/article'
import {
  useCreateParagraphMutation,
  useGetArticleByIdQuery,
  useUpdateArticleMutation,
} from '@/entities/article'
import {
  Composition,
  CreateParagraphDto,
  CreateParagraphinArticleDto,
  ParagraphDto,
  UpdateArticleDto,
  sectionMapping,
} from '@/entities/article/article.types'
import { Section } from '@/entities/article/article.types'
import {
  useGetImageQuery,
  useUploadArticleImageMutation,
  useUploadParagraphImageMutation,
} from '@/entities/image/image.api'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { CiAlignLeft, CiAlignRight } from 'react-icons/ci'
import { FaCheck, FaPen } from 'react-icons/fa'
import { FaChartBar, FaRegNewspaper, FaUser } from 'react-icons/fa'
import { LuFilePen } from 'react-icons/lu'

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3001/api'

import styles from '../Create/Create.module.scss'

import { Editor } from '../Create/editor'

export const EditArticle = () => {
  const [editingTitle, setEditingTitle] = useState<boolean>(true)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [metaTitle, setMetaTitle] = useState<string>('')
  const [count, setCount] = useState(0)
  const [metaDescription, setMetaDescription] = useState<string>('')
  const [paragraphs, setParagraphs] = useState<ParagraphDto[]>([])
  const [file, setFile] = useState<any>(null)
  const [url, setUrl] = useState<string>('')
  const [section, setSection] = useState<Section>(Section.SEO)
  const [composition, setComposition] = useState<any>()
  //const [id, setId] = useState(null)
  const [paragraphsWithImg, setParagraphsWithImg] = useState<number[]>([])
  const [buttonValue, setButtonValue] = useState<string>('Опубликовать')
  const { id } = useParams<{ id: string }>()
  const [articleId, setArticleId] = useState<string | undefined>(id)

  const [deleteParagraph] = useDeleteParagraphMutation()

  console.log('idByParams ' + id)
  const navigate = useNavigate()

  const [imagesByParagraph, setImagesByParagraph] = useState<Record<string, Blob>>({})

  const { data: article, isError, isLoading } = useGetArticleByIdQuery(Number(articleId))

  useEffect(() => {
    document.title = 'Редактировать статью - Панель администратора'
  }, [])

  const handleDelete = (paragraph: CreateParagraphinArticleDto) => {
    if (paragraph.order) {
      deleteParagraph({ articleId: article?.id as number, order: paragraph.order })
        .then(() => {
          setParagraphs(prevParagraphs =>
            prevParagraphs.filter(p => p.frontOrder !== paragraph.frontOrder)
          )
        })
        .catch(error => {
          console.error('Error deleting paragraph:', error)
          alert('Ошибка при удалении параграфа!')
        })
    } else {
      setParagraphs(prevParagraphs =>
        prevParagraphs.filter(p => p.frontOrder !== paragraph.frontOrder)
      )
    }
  }

  useEffect(() => {
    const loadParagraphImages = async () => {
      if (article && article.paragraphs) {
        const paragraphImagePromises = article.paragraphs.map(async paragraph => {
          const imageUrl = `${API_URL}/images/article/${article.id}/paragraph/${paragraph.title}`
          const image = await fetch(imageUrl)

          if (image.ok) {
            const blob = await image.blob()

            return { blob, title: paragraph.title }
          }

          return { blob: null, title: paragraph.title }
        })

        const paragraphImages = await Promise.all(paragraphImagePromises)

        const imagesMap = paragraphImages.reduce((acc: Record<string, Blob>, { blob, title }) => {
          if (blob) {
            acc[title] = blob
          }

          return acc
        }, {})

        setImagesByParagraph(imagesMap)
      }
    }

    loadParagraphImages()
  }, [article])

  useEffect(() => {
    if (imagesByParagraph && article?.paragraphs) {
      setImagesByParagraph(imagesByParagraph)
    }
  }, [imagesByParagraph, article?.paragraphs])

  useEffect(() => {
    if (id !== articleId) {
      setArticleId(id)
    }
  }, [id, articleId])
  const { data: articleImage } = useGetImageQuery({
    id: articleId || '',
    type: 'articles',
  })

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
      setUrl(article.keyword)

      const updatedParagraphs = article.paragraphs.map(paragraph => ({
        ...paragraph,
        frontOrder: paragraph.order,
      }))

      setParagraphs(updatedParagraphs)
      console.log(article)
    }
  }, [article])

  useEffect(() => {
    if (articleImage) {
      setFile(URL.createObjectURL(articleImage))
    }
  }, [articleImage])

  console.log(composition)

  const { ADMINARTICLES } = ROUTER_PATHS

  const handleSubmit = async (e: any, draft: any) => {
    e.preventDefault()

    const articleData: UpdateArticleDto = {
      composition,
      description,
      metaDescription,
      metaTitle,
      section,
      title,
      draft,
    }

    if (!draft) {
      const requiredFields = { description, title, metaTitle, metaDescription, url }

      for (const [key, value] of Object.entries(requiredFields)) {
        if (value == '' || !value) {
          return alert(`Заполните поле: ${key}`)
        }
      }
    }

    try {
      await updateArticle({ data: articleData, id: article?.id || 0 })

      if (paragraphs.length > 0) {
        for (const paragraph of paragraphs) {
          const paragraphData: CreateParagraphDto = {
            articleId: article?.id || 0,
            content: paragraph.content,
            order: paragraph.order ? paragraph.order : undefined,
            title: paragraph.title,
          }

          await createParagraph(paragraphData)
        }
      }

      if (count > 100) {
        await uploadArticleImage({ file, id: article?.id as number })
      }

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i]

        if (paragraph.imageFile) {
          await uploadParagraphImage({
            articleId: article?.id as number,
            file: paragraph.imageFile,
            title: paragraph.title,
          })
        }
      }

      setButtonValue('Опубликовано')
      console.log('Статья и параграфы успешно обновлены')
      navigate(ADMINARTICLES)
      window.location.reload()
    } catch (error) {
      console.error('Ошибка при обновлении статьи или создании параграфов', error)
    }
  }

  const handleFileDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile(URL.createObjectURL(event.dataTransfer.files[0] as Blob))
      event.dataTransfer.clearData()
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(URL.createObjectURL(e.target.files[0] as Blob))
      setCount(prev => prev + 1)
    }
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

  const addParagraph = () => {
    if (section === Section.NEWS) {
      return alert('Нельзя добавить абзац в новости')
    }
    setParagraphs([
      ...paragraphs,
      {
        articleId: article?.id as number,
        content: '',
        frontOrder: paragraphs.length + 1,
        title: 'Абзац' + (paragraphs.length + 1),
      },
    ])
  }

  const handleParagraphChange = (index: number, content: string) => {
    setParagraphs(prevParagraphs =>
      prevParagraphs.map((paragraph, i) => (i === index ? { ...paragraph, content } : paragraph))
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error loading article</div>
  }

  return (
    <form className={styles.createArticle}>
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
                  setButtonValue('Опубликовать')
                  handleFileChange(e)
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
                key={paragraph.id}
                onChange={content => {
                  handleParagraphChange(index, content)
                  setButtonValue('Опубликовать')
                }}
                setimg={() => {
                  setParagraphsWithImg([...paragraphsWithImg, index])
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

                        updatedParagraphs[index].imageFile = undefined
                        setParagraphs(updatedParagraphs)

                        setParagraphsWithImg(paragraphsWithImg.filter(i => i !== index))
                        setButtonValue('Опубликовать')
                      }}
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
                    style={{ padding: imagesByParagraph[paragraph.title] ? '20px' : '40px' }}
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
                    {imagesByParagraph[paragraph.title] ? (
                      <img
                        alt={`Image for ${paragraph.title}`}
                        className={styles.paragraphImage}
                        src={URL.createObjectURL(imagesByParagraph[paragraph.title])}
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
          <button
            className={styles.createArticle_top_buttons_left}
            onClick={e => handleSubmit(e, true)}
          >
            <LuFilePen />
            Сохранить черновик
          </button>
          <button
            className={styles.createArticle_top_buttons_right}
            onClick={e => handleSubmit(e, false)}
          >
            {buttonValue}
          </button>
        </div>
        <div className={styles.createArticle_photoLabel}>
          <p className={styles.createArticle_photoLabel_title}>Абзацы</p>
          <div className={styles.createArticle_photoLabel_content}>
            {paragraphs.map((paragraph, index) => (
              <div className={styles.createArticle_photoLabel_paragraphs} key={paragraph.id}>
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

                    updatedParagraphs[index].title = e.target.value
                    setParagraphs(updatedParagraphs)
                    setButtonValue('Опубликовать')
                  }}
                  type={'text'}
                  value={paragraph.title}
                />
                <button
                  onClick={() => {
                    setButtonValue('Опубликовать')
                    handleDelete(paragraph)
                  }}
                  type={'button'}
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
            >
              Очистить всё
            </button>
            <button
              className={styles.createArticle_photoLabel_buttons_right}
              onClick={() => {
                setButtonValue('Опубликовать')
                addParagraph()
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
                setButtonValue('Опубликовать')
                setParagraphs([])
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
                className="url"
                onChange={e => {
                  setUrl(e.target.value)
                  setButtonValue('Опубликовать')
                }}
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
                onChange={e => {
                  setMetaTitle(e.target.value)
                  setButtonValue('Опубликовать')
                }}
                placeholder={'Seo-заголовок'}
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
                setButtonValue('Опубликовать')
              }}
            >
              Очистить всё
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

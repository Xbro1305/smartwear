/* eslint-disable max-lines */
import { useState } from 'react'

import cat from '@/assets/images/Cat.png'
import { useCreateArticleMutation } from '@/entities/article'
import {
  Composition,
  CreateArticleDto,
  CreateParagraphinArticleDto,
  Section,
} from '@/entities/article/article.types'
import {
  useUploadArticleImageMutation,
  useUploadParagraphImageMutation,
} from '@/entities/image/image.api'
import { CiAlignLeft, CiAlignRight } from 'react-icons/ci'
import { FaCheck, FaPen } from 'react-icons/fa'
import { FaChartBar, FaRegNewspaper, FaUser } from 'react-icons/fa'
import { LuFilePen } from 'react-icons/lu'

import styles from './Create.module.scss'

import { Editor } from './editor'

export const CreateArticle = () => {
  const [editingTitle, setEditingTitle] = useState<boolean>(true)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [metaTitle, setMetaTitle] = useState<string>('')
  const [metaDescription, setMetaDescription] = useState<string>('')
  const [paragraphs, setParagraphs] = useState<CreateParagraphinArticleDto[]>([])
  const [file, setFile] = useState<any>(null)
  const [url, setUrl] = useState<string>('')
  const [section, setSection] = useState<any>()
  const [composition, setComposition] = useState<any>()
  const [paragraphsWithImg, setParagraphsWithImg] = useState<number[]>([])

  const [createArticle] = useCreateArticleMutation()
  const [uploadArticleImage] = useUploadArticleImageMutation()
  const [uploadParagraphImage] = useUploadParagraphImageMutation()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const articleData: CreateArticleDto = {
      composition,
      description,

      metaDescription,
      metaTitle,
      paragraphs,
      section,
      title,
      userId: 123,
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

      alert('Статья успешно создана!')
    } catch (err) {
      console.error('Error creating article:', err)
      alert('Ошибка при создании статьи!')
    }
  }

  const addParagraph = () => {
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

  const handleParagraphChange = (index: number, content: string) => {
    const updatedParagraphs = [...paragraphs]

    updatedParagraphs[index].content = content
    setParagraphs(updatedParagraphs)
  }

  const handleParagraphImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const updatedParagraphs = [...paragraphs]

      updatedParagraphs[index].imageFile = file // Сохраняем файл изображения в абзаце
      setParagraphs(updatedParagraphs)
    }
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
          <Editor isimg={true} onChange={setDescription} value={description} />
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
              <p>Описание {paragraph.title}</p>
              <Editor
                isimg={false}
                setimg={() => {
                  setParagraphsWithImg([...paragraphsWithImg, index])
                }}
                key={paragraph.order}
                onChange={content => handleParagraphChange(index, content)}
                value={paragraph.content}
              />
              {paragraphsWithImg.includes(index) && (
                <div className={styles.createArticle_photoLabel}>
                  <p className={styles.createArticle_photoLabel_title}>
                    Картинка для абзаца {index + 1}
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
                  <label className={styles.createArticle_photoLabel_img}>
                    <input
                      accept={'image/*'}
                      className={'inp'}
                      name={'photo'}
                      onChange={e => handleParagraphImageChange(index, e)}
                      size={1}
                      type={'file'}
                    />
                    <img
                      alt={'cat'}
                      src={paragraph.imageFile ? URL.createObjectURL(paragraph.imageFile) : cat}
                    />
                    <p>Загрузить изображение</p>
                    <span>Добавьте фотографию с компьютера</span>
                  </label>
                </div>
              )}{' '}
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
              <div className={styles.createArticle_photoLabel_paragraphs} key={paragraph.order}>
                <input
                  type="text"
                  value={paragraph.title}
                  onChange={e => {
                    const updatedParagraphs = [...paragraphs]

                    updatedParagraphs[index].title = e.target.value
                    setParagraphs(updatedParagraphs)
                  }}
                />
                <button
                  onClick={() => {
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
              <input name={'section'} type={'radio'} value={Section.SEO} />
            </label>
            <label
              onClick={() => setSection(Section.USER)}
              className={styles.createArticle_photoLabel_section}
            >
              <section>
                <FaUser />
                <p>Пользовательские</p>{' '}
              </section>
              <input name={'section'} type={'radio'} value={Section.USER} />
            </label>
            <label
              onClick={() => setSection(Section.NEWS)}
              className={styles.createArticle_photoLabel_section}
            >
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

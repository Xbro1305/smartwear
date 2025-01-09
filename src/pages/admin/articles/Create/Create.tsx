import { useState } from 'react'
import { ArticleDto, Composition, ParagraphDto, Section } from '@/entities/article/article.types'
import { FaCheck, FaPen } from 'react-icons/fa'
import { LuFilePen } from 'react-icons/lu'
import styles from './Create.module.scss'
import { Editor } from './editor'
import cat from '@/assets/images/Cat.png'
import { CiAlignLeft, CiAlignRight } from 'react-icons/ci'
import { FaChartBar, FaUser, FaRegNewspaper } from 'react-icons/fa'

export const CreateArticle = () => {
  const [editingTitle, setEditingTitle] = useState<boolean>(true)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [metaTitle, setMetaTitle] = useState<string>('')
  const [metaDescription, setMetaDescription] = useState<string>('')
  const [paragraphs, setParagraphs] = useState<ParagraphDto[]>([])
  const [file, setFile] = useState<any>(null)
  const [url, setUrl] = useState<string>('')
  //section
  const [section, setSection] = useState<any>()
  const [composition, setComposition] = useState<any>()

  console.log(composition)

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const articleData: ArticleDto = {
      composition,
      description,
      id: Date.now(),
      metaDescription,
      metaTitle,
      paragraphs,
      section,
      title,
      userId: 123,
    }

    console.log('Article Data:', articleData)
  }

  const addParagraph = () => {
    setParagraphs([
      ...paragraphs,
      {
        articleId: 1,
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
                type="file"
                name="photo"
                className="inp"
                accept="image/*"
                size={1}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    const img = URL.createObjectURL(e.target.files[0])
                    setFile(img)
                  }
                }}
              />
              <img src={cat} alt="cat" />
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
              <div key={paragraph.id} className={styles.createArticle_photoLabel_paragraphs}>
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: composition === Composition.RIGHT ? '#cbd5e1' : 'white',
                }}
                onClick={() => setComposition(Composition.RIGHT)}
              >
                <CiAlignRight />
                <input
                  type="radio"
                  name="composition"
                  onChange={() => setComposition(Composition.RIGHT)}
                  value={Composition.RIGHT}
                />
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: composition === Composition.LEFT ? '#cbd5e1' : 'white',
                }}
                onClick={() => setComposition(Composition.LEFT)}
              >
                <CiAlignLeft />
                <input
                  type="radio"
                  name="composition"
                  value={Composition.LEFT}
                  onChange={() => setComposition(Composition.LEFT)}
                />
              </label>
            </div>
            <label className={styles.createArticle_photoLabel_section}>
              <section>
                <FaChartBar />
                <p>Seo</p>{' '}
              </section>
              <input type="radio" name="section" value={Section.SEO} />
            </label>
            <label className={styles.createArticle_photoLabel_section}>
              <section>
                <FaUser />
                <p>Пользовательские</p>{' '}
              </section>
              <input type="radio" name="section" value={Section.USER} />
            </label>
            <label className={styles.createArticle_photoLabel_section}>
              <section>
                <FaRegNewspaper />
                <p>Новости</p>{' '}
              </section>
              <input type="radio" name="section" value={Section.NEWS} />
            </label>
          </div>
        </div>
        <div className={styles.createArticle_photoLabel}>
          <p className={styles.createArticle_photoLabel_title}>URL настройки</p>
          <div className={styles.createArticle_photoLabel_url}>
            <label>
              <p>URL на статью</p>
              <input
                type="text"
                onChange={e => setUrl(e.target.value)}
                value={url}
                name="url"
                placeholder="Ссылка на статью"
                id=""
              />
            </label>
            <label>
              <p>Meta-tag title</p>
              <textarea
                name="metaTitle"
                onChange={e => setMetaTitle(e.target.value)}
                value={metaTitle}
                placeholder="Seo-заголовок"
                id=""
              ></textarea>
            </label>
            <label>
              <p>Meta-tag description</p>
              <textarea
                name="metaDescription"
                onChange={e => setMetaDescription(e.target.value)}
                value={metaDescription}
                placeholder="Seo-описание"
                id=""
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

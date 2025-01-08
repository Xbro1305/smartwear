import { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export const Articles: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const quillInstance = useRef<Quill | null>(null) // Для хранения экземпляра Quill
  const [content, setContent] = useState<string>('')

  const toolbarOptions = [
    [{ size: ['8px', '10px', '12px', '14px', '18px', '24px', '32px', '48px'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['link', 'image'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ]

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarRef.current || toolbarOptions,
        },
        formats: [
          'size',
          'header',
          'bold',
          'italic',
          'underline',
          'strike',
          'align',
          'list',
          'bullet',
          'link',
          'image',
          'clean',
        ],
      })

      // Обновление содержимого при изменении текста
      quillInstance.current.on('text-change', () => {
        setContent(quillInstance.current?.root.innerHTML || '')
      })
    }
  }, [])

  // Получение содержимого при нажатии на кнопку
  const getEditorContent = () => {
    if (quillInstance.current) {
      alert(quillInstance.current.root.innerHTML) // HTML форматированного текста
    }
  }

  return (
    <div className="custom-quill-container">
      {/* Custom toolbar */}
      <div ref={toolbarRef}>
        <select className="ql-size">
          <option value="8px">8px</option>
          <option value="10px">10px</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="18px">18px</option>
          <option value="24px">24px</option>
          <option value="32px">32px</option>
          <option value="48px">48px</option>
        </select>
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-strike"></button>
        <button className="ql-align" value=""></button>
        <button className="ql-align" value="center"></button>
        <button className="ql-align" value="right"></button>
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <button className="ql-link"></button>
        <button className="ql-image"></button>
        <button className="ql-clean"></button>
      </div>

      {/* Quill editor */}
      <div ref={editorRef}></div>

      {/* Кнопка для вывода содержимого */}
      <button onClick={getEditorContent}>Получить содержимое</button>

      {/* Вывод содержимого для проверки */}
      <div>
        <h3>Отображение содержимого:</h3>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  )
}

export default Articles

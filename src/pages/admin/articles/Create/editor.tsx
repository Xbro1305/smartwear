import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import './editor.css'
import { FaRegImage } from 'react-icons/fa'

type EditorProps = {
  value?: string
  onChange?: (content: string) => void
  setimg?: any
  isimg?: boolean
}

export const Editor: React.FC<EditorProps> = ({ value, onChange, setimg, isimg }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const quillInstance = useRef<Quill | null>(null)

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
      })

      if (value) {
        quillInstance.current.root.innerHTML = value
      }

      quillInstance.current.on('text-change', () => {
        if (onChange) {
          onChange(quillInstance.current?.root.innerHTML || '')
        }
      })
    }
  }, [])

  return (
    <div className="custom-quill-container">
      <div ref={toolbarRef}>
        <div className="ql-sect">
          <select className="ql-size">
            <option value="8px">8</option>
            <option value="10px">10</option>
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="18px">18</option>
            <option value="24px">24</option>
            <option value="32px">32</option>
            <option value="48px">48</option>
          </select>
        </div>
        <div className="ql-sect">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
          <button className="ql-link"></button>
        </div>

        <div className="ql-sect">
          <button className="ql-align" value=""></button>
          <button className="ql-align" value="center"></button>
          <button className="ql-align" value="right"></button>
        </div>
        <div className="ql-sect">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
        </div>
        <button
          className="ql-img"
          onClick={setimg}
          disabled={isimg}
          style={{ color: isimg ? '#00000030' : '#202224' }}
        >
          <FaRegImage /> Изображение
        </button>
      </div>
      <div ref={editorRef}></div>
    </div>
  )
}

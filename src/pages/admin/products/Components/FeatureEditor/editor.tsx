import { useEffect, useRef } from 'react'

import Quill from 'quill'

import './editor.css'
import 'quill/dist/quill.snow.css'

type EditorProps = {
  isimg?: boolean
  onChange?: (content: string) => void
  setimg?: any
  value?: string
}

export const FeatureEditor: React.FC<EditorProps> = ({ onChange, value }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const quillInstance = useRef<Quill | null>(null)

  const toolbarOptions = [['link', 'image'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']]

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        modules: {
          toolbar: toolbarRef.current || toolbarOptions,
        },
        theme: 'snow',
      })

      quillInstance.current.on('text-change', () => {
        if (onChange) {
          onChange(quillInstance.current?.root.innerHTML || '')
        }
      })
    }
  }, [])

  useEffect(() => {
    if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
      quillInstance.current.root.innerHTML = value || ''
    }
  }, [value])

  return (
    <div className={'custom-quill-container'} style={{ width: '100%', height: 'fit-content' }}>
      <div ref={toolbarRef}>
        <div className={'ql-sect'}>
          <button className={'ql-bold'}></button>
          <button className={'ql-italic'}></button>
          <button className={'ql-underline'}></button>
          <button className={'ql-strike'}></button>
          <button className={'ql-link'}></button>
        </div>
        <div className={'ql-sect'}>
          <button className={'ql-list'} value={'ordered'}></button>
          <button className={'ql-list'} value={'bullet'}></button>
        </div>
      </div>
      <div ref={editorRef}></div>
    </div>
  )
}

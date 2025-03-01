import styles from '@/pages/profile/Components/Components.module.scss'
import { useState } from 'react'

interface InputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  name: string
  title: string
  onBlur?: () => void
  onFocus?: () => void
  className?: string
  required?: boolean
}

export const InputLabel: React.FC<InputProps> = ({
  value,
  name,
  onChange,
  title,
  onBlur,
  onFocus,
  className,
  required,
}) => {
  const [isActive, setIsactive] = useState(false)
  return (
    <label
      style={{ borderColor: isActive ? 'var(--red)' : 'var(--service)' }}
      className={` ${styles.profile_form_label} ${value.length ? styles.profile_form_label_active : ''} ${className}`}
    >
      <p>{title}</p>
      <input
        required={required}
        onBlur={() => {
          onBlur
          setIsactive(false)
        }}
        onFocus={() => {
          onFocus
          setIsactive(true)
        }}
        value={value}
        onChange={e => onChange(e)}
        name={name}
        type={'text'}
      />
    </label>
  )
}

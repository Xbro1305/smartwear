import styles from '@/pages/profile/Components/Components.module.scss'

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
  return (
    <label
      className={`${styles.profile_form_label} ${value.length ? styles.profile_form_label_active : ''} ${className}`}
    >
      <p>{title}</p>
      <input
        required={required}
        onBlur={onBlur}
        onFocus={onFocus}
        value={value}
        onChange={e => onChange(e)}
        name={name}
        type={'text'}
      />
    </label>
  )
}

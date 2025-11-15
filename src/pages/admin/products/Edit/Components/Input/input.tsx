interface InputProps {
  title: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export const CustomInput: React.FC<InputProps> = ({
  title,
  placeholder,
  value,
  onChange,
  className,
}) => {
  return (
    <label className="flex flex-col gap-sm w-[372px]">
      <p className="font-semibold text-[14px]">{title}</p>
      <input
        type="text"
        className={`admin-input ${className}`}
        placeholder={placeholder}
        required
        onChange={onChange}
        value={value}
      />
    </label>
  )
}

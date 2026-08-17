import { ContactsBlock } from '@/widgets/contactsBlock/ContactsBlock'
import { HOME_CONTACT_STORES } from '@/shared/config/stores'

// Текст блока «Контакты» — с сохранением строк (Правки 3, п.7)
const CONTACT_LINES = [
  'ИП Ефремова Елена Вячеславовна ОРГНИП 305470604700010',
  'info@maxiscomfort.ru',
  'Отправляем интернет-заказы на следующий рабочий день после оформления.',
  'Наш менеджер ответит на ваши вопросы на почте ежедневно с 11:00 до 19:00.',
]

export const ContactPage = () => {
  return (
    <div className="flex flex-col gap-[24px] px-[var(--sides-padding)] py-[var(--top-padding)]">
      <h1 className="h1">Контакты</h1>
      <div className="p1 max-w-[820px]">
        {CONTACT_LINES.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      {/* только 2 магазина — те же, что на главной и «О нас» (Правки 3, п.7) */}
      <ContactsBlock stores={HOME_CONTACT_STORES} title={null} />
    </div>
  )
}

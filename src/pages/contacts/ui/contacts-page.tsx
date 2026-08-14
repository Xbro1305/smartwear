import { ContactsBlock } from '@/widgets/contactsBlock/ContactsBlock'
import { CONTACT_STORES } from '@/shared/config/stores'

export const ContactPage = () => {
  return (
    <div className="flex flex-col gap-[24px] px-[var(--sides-padding)] py-[var(--top-padding)]">
      <h1 className="h1">Контакты</h1>
      <p className="p1 max-w-[820px]">
        ИП Ефремова Елена Вячеславовна ОРГНИП 305470604700010 info@maxiscomfort.ru Отправляем
        интернет-заказы на следующий будний день после оформления. Наш менеджер ответит на ваши
        вопросы в онлайн-чате ежедневно с 11:00 до 19:00.
      </p>
      {/* тот же блок, что и на главной: карточки магазинов + карта (ТЗ 10, п.11) */}
      <ContactsBlock stores={CONTACT_STORES} title={null} />
    </div>
  )
}

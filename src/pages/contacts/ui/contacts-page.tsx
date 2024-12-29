import styles from '../Contacts.module.scss'

export const ContactPage = () => {
  return (
    <div className={styles.contact}>
      <div className={styles.contact_left}>
        <h1 className="h1" style={{ marginTop: '-20px' }}>
          Контакты
        </h1>
        <p className="p1">
          ИП Ефремова Елена Вячеславовна ОРГНИП 305470604700010 info@maxiscomfort.ru Отправляем
          интернет-заказы на следующий будний день после оформления. Наш менеджер ответит на ваши
          вопросы в онлайн-чате ежедневно с 11:00 до 19:00.
        </p>
        <h5 className="h5">«Умная Одежда» у станции метро «Ладожская»</h5>
        <p className="p2">
          Заневский проспект, 67к2
          <br />
          ТРК «Заневский Каскад-1», 2 этаж, помещение 2-94
          <br />
          <br />8 921 908–00–39
        </p>
        <h5 className="h5">AutoJack & LimoLady у станции метро «Ладожская»</h5>
        <p className="p2">
          Заневский проспект, 67к2
          <br />
          ТРК «Заневский Каскад-1», 1-й этаж, помещение 1-89
          <br />
          <br /> 8 901 300–58–54
        </p>
        <h5 className="h5">NorthBloom у станции метро «Проспект Просвещения»</h5>
        <p>
          Проспект Энгельса, 154
          <br />
          ТРК «Гранд Каньон», 2 этаж, помещение 2-19
          <br />
          <br /> 8 931 364–70–37
        </p>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1998.9505168433507!2d30.435165976698904!3d59.93296326255773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x469631fd48c60077%3A0x658b7dc8beb92b9!2z0JfQsNC90LXQstGB0LrQuNC5INC_0YAt0YIuLCA2NyDQutC-0YDQv9GD0YEgMiwg0KHQsNC90LrRgi3Qn9C10YLQtdGA0LHRg9GA0LMsIDE5NTI3Nw!5e0!3m2!1sru!2sru!4v1734367980606!5m2!1sru!2sru"
        width="50%"
        height="700"
        style={{ border: '0' }}
        // allowfullscreen=""
        loading="lazy"
        // referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  )
}

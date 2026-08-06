import styles from './Footer.module.scss'
import i1 from '../../../assets/images/Vector.svg'
import i2 from '../../../assets/images/Vector (1).svg'
import i3 from '../../../assets/images/vk logo.svg'
import i4 from '../../../assets/images/Union.svg'
import { Link } from 'react-router-dom'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { useEffect, useState } from 'react'

export const Footer: React.FC = () => {
  // Кнопка выхода — только для реально авторизованных (не показываем при пустом/мусорном токене)
  const [isAuthed, setIsAuthed] = useState(false)
  useEffect(() => {
    const check = () => {
      const t = localStorage.getItem('token')
      setIsAuthed(!!t && t !== 'null' && t !== 'undefined')
    }
    check()
    window.addEventListener('storage', check)
    return () => window.removeEventListener('storage', check)
  }, [])

  const handleLogout = () => {
    // Чистим данные сессии, сохранённые при входе (sign-in-page)
    ;['token', 'username', 'usersurname', 'usermiddlename', 'useremail', 'userphone'].forEach(key =>
      localStorage.removeItem(key)
    )

    // Хедер читает токен из localStorage не реактивно — как и вход, уходим с перезагрузкой,
    // чтобы состояние авторизации в шапке обновилось
    window.location.href = ROUTER_PATHS.HOME
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_sect}>
        <h4>О компании</h4>
        <Link to={ROUTER_PATHS.ABOUT}>О нас</Link>
        <Link to={ROUTER_PATHS.CONTACTS}>Контакты</Link>
        {/* <Link to={ROUTER_PATHS.STORES}>Адреса магазинов</Link> */}
        <Link to={ROUTER_PATHS.MANUFACTURERS}>Производители</Link>
      </div>

      <div className={styles.footer_sect}>
        <h4>Покупателям</h4>
        {/* <Link to={ROUTER_PATHS.ORDER}>Как оформить заказ</Link> */}
        <Link to={'/terms'}>Правила оплаты и возврата</Link>
        <Link to={ROUTER_PATHS.DELIVERY}>Доставка</Link>
        <Link to={ROUTER_PATHS.RETURNS}>Возврат товара</Link>
        <Link to={'/climate-control-stirka'}>Уход за изделиями</Link>
        {/* <Link to={ROUTER_PATHS.NEWSLETTER}>Рассылка</Link> */}
      </div>

      <div className={styles.footer_sect}>
        <h4>Личный кабинет</h4>
        <Link to={ROUTER_PATHS.SIGN_UP}>Регистрация</Link>
        <Link to={ROUTER_PATHS.ORDER_HISTORY}>История заказов</Link>
        <Link to={ROUTER_PATHS.TRACK_ORDER}>Отследить заказ</Link>
        {/* <Link to={ROUTER_PATHS.BOOKMARKS}>Закладки</Link> */}
      </div>

      <div className={styles.footer_sect}>
        <p>
          <img src={i1} alt="" />
          Работаем с 10 до 22
        </p>
        <p>
          <img src={i2} alt="" />
          Магазины находятся в Санкт-Петербурге. Бесплатная доставка по России
        </p>
        <a href="https://vk.ru/maxiscomfort" target="_blank" rel="noreferrer">
          <img src={i3} alt="ВКонтакте" />
          maxiscomfort
        </a>
        <a href="mailto:info@maxiscomfort.ru">
          <img src={i4} alt="Почта" />
          info@maxiscomfort.ru
        </a>
      </div>
      <div className={styles.footer_sect}>
        <p> © 0000–2023 Интернет-магазин «Умная Одежда» </p>
        <Link to={ROUTER_PATHS.POLITICS}>Политика конфиденциальности</Link>
        <Link to={ROUTER_PATHS.OFERTA}>Оферта</Link>
        {isAuthed && (
          <p
            onClick={handleLogout}
            className="flex items-[center_!important] gap-[5px] cursor-pointer justify-center"
          >
            Выйти из профиля
          </p>
        )}
      </div>
    </footer>
  )
}

export default Footer

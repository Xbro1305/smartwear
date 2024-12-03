import styles from "./Footer.module.scss";
import i1 from "../../images/Vector.svg";
import i2 from "../../images/Vector (1).svg";
import i3 from "../../images/vk logo.svg";
import i4 from "../../images/Union.svg";
import { Link } from "react-router-dom";
import { ROUTER_PATHS } from "@/shared/config/routes";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_sect}>
        <h4>О компании</h4>
        <Link to={ROUTER_PATHS.ABOUT}>О нас</Link>
        <Link to={ROUTER_PATHS.CONTACTS}>Контакты</Link>
        <Link to={ROUTER_PATHS.STORES}>Адреса магазинов</Link>
        <Link to={ROUTER_PATHS.MANUFACTURERS}>Производители</Link>
      </div>

      <div className={styles.footer_sect}>
        <h4>Покупателям</h4>
        <Link to={ROUTER_PATHS.ORDER}>Как оформить заказ</Link>
        <Link to={ROUTER_PATHS.PAYMENT_RULES}>Правила оплаты и возврата</Link>
        <Link to={ROUTER_PATHS.DELIVERY}>Доставка</Link>
        <Link to={ROUTER_PATHS.RETURNS}>Возврат товара</Link>
        <Link to={ROUTER_PATHS.CARE}>Уход за изделиями</Link>
        <Link to={ROUTER_PATHS.NEWSLETTER}>Рассылка</Link>
      </div>

      <div className={styles.footer_sect}>
        <h4>Личный кабинет</h4>
        <Link to={ROUTER_PATHS.SIGN_UP}>Регистрация</Link>
        <Link to={ROUTER_PATHS.ORDER_HISTORY}>История заказов</Link>
        <Link to={ROUTER_PATHS.TRACK_ORDER}>Отследить заказ</Link>
        <Link to={ROUTER_PATHS.BOOKMARKS}>Закладки</Link>
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
        <p>
          <img src={i3} alt="" />
          maxiscomfort
        </p>
        <p>
          <img src={i4} alt="" />
          info@maxiscomfort
        </p>
      </div>
      <div className={styles.footer_sect}>
        <p> © 0000–2023 Интернет-магазин «Умная Одежда» </p>
        <Link to={ROUTER_PATHS.POLITICS}>Политика конфиденциальности</Link>
        <Link to={ROUTER_PATHS.OFERTA}>Оферта</Link>
      </div>
    </footer>
  );
};

export default Footer;

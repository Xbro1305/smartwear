import styles from "./Profile.module.scss"; // Пример с алиасом
import sale from "../../../assets/images/sale.png"; // Пример с алиасом для изображений
import itemImg from "../../../assets/images/image 139.png"; // Тоже с алиасом
import question from "../../../assets/images/svg (3).svg";
import deleteItem from "../../../assets/images/Union (1).svg";
import { Link } from "react-router-dom";
import { PatternFormat } from "react-number-format";

export const ProfilePage = () => {
  const current = 17200;
  const next = 30000;
  const percent = (17200 * 100) / 30000;

  return (
    <div className={styles.profile}>
      <div className={styles.profile_top}>
        <h1 className={styles.profile_top_title}>Иванов Иван Иванович</h1>
        <div className={styles.profile_top_sale}>
          <img src={sale} alt="sale" />
          <div className={styles.profile_top_sale_bottom}>
            <h1>Ваша скидка 5%</h1>
            <p>Купите товаров на сумму {next} ₽ и получите скидку 10%</p>
            <div className={styles.profile_top_sale_bottom_process}>
              <span>Куплено товаров на сумму {current} ₽</span>
              <div className={styles.profile_top_sale_line}>
                <div style={{ width: `${percent}%` }}></div>
              </div>
            </div>
            <Link to="/discount-program">Подробнее о накопительной программе</Link>
          </div>
        </div>
      </div>
      <div className={styles.profile_personality}>
        <h1>Персональная информация</h1>
        <form className={styles.profile_form}>
          <label className={styles.profile_form_label}>
            <p>Фамилия</p>
            <input type="text" defaultValue={data.surname} name="surname" />
          </label>
          <label className={styles.profile_form_label}>
            <p>Имя</p>
            <input type="text" defaultValue={data.name} name="name" />
          </label>
          <label className={styles.profile_form_label}>
            <p>Отчество</p>
            <input defaultValue={data.patronomic} type="text" name="patronomic" />
          </label>
          <label className={styles.profile_form_label}>
            <p>Номер телефона</p>
            <PatternFormat
              defaultValue={data.phone}
              format="+7 (###) ### ##-##"
              allowEmptyFormatting
              mask="_"
              name="phone"
            />
          </label>
          <label className={styles.profile_form_label}>
            <p>E-mail</p>
            <input defaultValue={data.email} type="email" name="email" />
          </label>
        </form>
        <label className={styles.profile_form_confirmLabel}>
          <input type="checkbox" />
          <p style={{ width: "100%" }}>Получать информацию о новинках и распродажах</p>
        </label>
      </div>
      <div className={styles.profile_orders}>
        <h1 className={styles.profile_orders_title}>Активные заказы</h1>
        <div className={styles.profile_orders_wrapper}>
          {active.map((i, index) => (
            <div className={styles.profile_orders_item} key={index}>
              <img src={i.img} alt="order" />
              <div>
                <div className={styles.profile_orders_item_top}>
                  <h1>{i.product_name}</h1>
                  <p>{i.status}</p>
                </div>
                <p className={styles.profile_orders_item_price}>
                  {i.price} {i.currency}
                </p>
                <div className={styles.profile_orders_item_details}>
                  <p>
                    <span>Способ доставки</span>
                    <span>{i.delivery_method}</span>
                  </p>
                  <p>
                    <span>Дата доставки <img src={question} alt="question" /></span>
                    <span>{i.expected_delivery_date}</span>
                  </p>
                  <p>
                    <span>Номер заказа</span>
                    <span>№{i.order_number}</span>
                  </p>
                </div>

                <button className={styles.profile_orders_item_button}>
                  Информация о заказе
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.profile_orders}>
        <h1 className={styles.profile_orders_title}>История заказов</h1>
        <div className={styles.profile_orders_wrapper}>
          {history.map((i, index) => (
            <div className={styles.profile_orders_item} key={index}>
              <img src={i.img} alt="order" />
              <div>
                <div className={styles.profile_orders_item_top}>
                  <h1>{i.product_name}</h1>
                  <p>{i.status}</p>
                </div>
                <p className={styles.profile_orders_item_price}>
                  {i.price} {i.currency}
                </p>
                <div className={styles.profile_orders_item_details}>
                  <p>
                    <span>Способ доставки</span>
                    <span>{i.delivery_method}</span>
                  </p>
                  <p>
                    <span>Дата доставки <img src={question} alt="question" /></span>
                    <span>{i.expected_delivery_date}</span>
                  </p>
                  <p>
                    <span>Номер заказа</span>
                    <span>№{i.order_number}</span>
                  </p>
                </div>

                <button className={styles.profile_orders_item_button}>
                  Информация о заказе
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.profile_adresses}>
        {adresses.map((i) => (
          <p key={i.id}>
            <img src={deleteItem} alt="delete" />
            {i.title}
          </p>
        ))}
      </div>
    </div>
  );
};

const data = {
  surname: "Иванов",
  name: "Иван",
  patronomic: "Иванович",
  phone: "+7 (000) 00-00-00",
  email: "sameemail@mail.com",
};

const active = [
  {
    img: itemImg,
    product_name: "Мужская демисезонная куртка Autojack 2001",
    price: 15000,
    currency: "₽",
    status: "В пути",
    delivery_method: "Курьером",
    expected_delivery_date: "2023-04-02",
    order_number: "103-23-321",
  },
  {
    img: itemImg,
    product_name: "Мужская демисезонная куртка Autojack 2001",
    price: 15000,
    currency: "₽",
    status: "Ожидает получения",
    delivery_method: "Курьером",
    expected_delivery_date: "2023-04-02",
    order_number: "103-23-321",
  },
];

const history = [
  {
    img: itemImg,
    product_name: "Мужская демисезонная куртка Autojack 2001",
    price: 15000,
    currency: "₽",
    status: "Отменён",
    delivery_method: "Курьером",
    expected_delivery_date: "2023-04-02",
    order_number: "103-23-321",
  },
  {
    img: itemImg,
    product_name: "Мужская демисезонная куртка Autojack 2001",
    price: 15000,
    currency: "₽",
    status: "Получен",
    delivery_method: "Курьером",
    expected_delivery_date: "2023-04-02",
    order_number: "103-23-321",
  },
];

const adresses = [
  { id: 1, title: "Санкт-Петербург, Каменноостровский проспект, 4Т, кв. 64" },
  { id: 2, title: "Челябинск, улица Цвиллинга, 28, кв. 36" },
];
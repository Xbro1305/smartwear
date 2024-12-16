import { useNavigate } from 'react-router-dom'
import '@/app/global.css'
import styles from '../home.module.scss'
import intro from '@/assets/images/homeIntro.png'
import brands from '@/assets/images/homeBrands.png'
import catalog from '@/assets/images/homeCatalog.jpeg'
import location from '@/assets/images/homeLocation.png'
import sales from '@/assets/images/homeSales.png'
import heart from '@/assets/images/homeHeart.svg'
import fire from '@/assets/images/homeFire.png'
import info from '@/assets/images/homeInfo.png'
import news from '@/assets/images/homeNews.jpeg'
import homeadv1 from '@/assets/images/homeadv (1).svg'
import homeadv2 from '@/assets/images/homeadv (4).svg'
import homeadv3 from '@/assets/images/homeadv (3).svg'
import homeadv4 from '@/assets/images/homeadv (2).svg'
import { NumericFormat } from 'react-number-format'
import { useState } from 'react'

export const HomePage = () => {
  const navigate = useNavigate()
  const [checkedInfo, setCheckedInfo] = useState(0)

  return (
    <div className={styles.home}>
      <div className={styles.home_intro}>
        <img src={intro} alt="" />
        <h1 className="h1">Мембранная одежда с климат-контролем</h1>
        <button className="button">В каталог</button>
      </div>
      <div className={styles.home_brands}>
        <img src={brands} alt="" />
      </div>
      <div className={styles.home_categories}>
        <h1 className="h1">Категории</h1>
        <div className={styles.home_categories_wrapper}>
          {catalogItems.map(i => (
            <div className={styles.home_categories_item}>
              <img src={i.img} alt="" />
              <div className={styles.home_categories_item_selector}>
                <h2>Категория</h2> <p>{'>'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.home_sales}>
        <div className={styles.home_sales_left}>
          <h2 className="h2">Скидки до 50% на куртки и ветровки</h2>
          <button className="button">Подробнее</button>
        </div>
        <img src={sales} alt="" />
      </div>
      <div className={styles.home_recommendations}>
        <h2 className="h2">Рекомендуем на зиму</h2>
        <div className={styles.home_recommendations_wrapper}>
          {recomendations.map(i => (
            <div className={styles.home_recommendations_item}>
              <img src={i.img} alt="" />
              <div className={styles.home_recommendations_item_info}>
                <div className={styles.home_recommendations_item_top}>
                  <div className={styles.home_recommendations_item_colors}>
                    {i.colors.map(c => (
                      <div
                        style={{ background: `${c}` }}
                        className={styles.home_recommendations_item_color}
                      ></div>
                    ))}
                  </div>
                  <img src={heart} alt="" />
                </div>
                <h5 className="h5">{i.title}</h5>
                <NumericFormat
                  displayType="text"
                  className="h5"
                  value={i.price}
                  decimalSeparator="."
                  thousandSeparator=" "
                  suffix=" ₽"
                />
                <a href="" className="button">
                  Подробнее
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.home_info}>
        <div className={styles.home_info_top}>
          {infoCategories.map((i, index) => (
            <p
              className={index == checkedInfo ? styles.home_info_top_active : ''}
              onClick={() => setCheckedInfo(index)}
            >
              {i}
            </p>
          ))}
        </div>
        <div className={styles.home_info_wrapper}>
          <p className="p1">{infoTexxt[checkedInfo].title}</p>
          <img src={infoTexxt[checkedInfo].img} alt="" />
        </div>
      </div>
      <div className={styles.home_news}>
        <h2 className="h2">Новости</h2>

        <div className={styles.home_news_wrapper}>
          {newsArr.map(i => (
            <div className={styles.home_news_item}>
              <img src={i.img} alt="" />
              <div className={styles.home_news_item_right}>
                <span className="p2">{i.date}</span>
                <h5 className="h5">{i.title}</h5>
                <p className="p2">{i.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.home_adv}>
        {advs.map(i => (
          <div className={styles.home_adv_item}>
            <img src={i.img} alt="" />
            <div className={styles.home_adv_item_right}>
              <h5 className="h5">{i.title}</h5>
              <p className="p2">{i.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.home_contact}>
        <div className={styles.home_contact_left}>
          <h2 className="h2">Контакты</h2>
          <h5 className="h5">Умная Одежда</h5>
          <p className="p2">
            Заневский проспект, 67к2
            <br />
            ТРК «Заневский Каскад-1», 2 этаж, помещение 2-94
            <br />
            <br />8 921 908–00–39
          </p>
          <h5 className="h5">AutoJack & LimoLady</h5>
          <p className="p2">
            Заневский проспект, 67к2
            <br />
            ТРК «Заневский Каскад-1», 1-й этаж, помещение 1-89
            <br />
            <br /> 8 901 300–58–54
          </p>
          <h5 className="h5">NorthBloom</h5>
          <p className="p2">
            Проспект Энгельса, 154
            <br />
            ТРК «Гранд Каньон», 2 этаж, помещение 2-19
            <br />
            <br /> 8 931 364–70–37
          </p>
        </div>
        <img src={location} alt="" />
      </div>
    </div>
  )
}

const catalogItems = [
  {
    img: catalog,
    title: 'Категория',
  },
  {
    img: catalog,
    title: 'Категория',
  },
  {
    img: catalog,
    title: 'Категория',
  },
  {
    img: catalog,
    title: 'Категория',
  },
]

const recomendations = [
  {
    img: catalog,
    colors: ['#849051', '#EFC7BD'],
    title: 'Женская демисезонная куртка limolady 3279',
    price: 24150,
    sale: false,
  },
  {
    img: catalog,
    colors: ['#849051', '#EFC7BD'],
    title: 'Женская демисезонная куртка limolady 3279',
    price: 24150,
    sale: false,
  },
  {
    img: catalog,
    colors: ['#849051', '#EFC7BD'],
    title: 'Женская демисезонная куртка limolady 3279',
    price: 24150,
    sale: true,
  },
  {
    img: catalog,
    colors: ['#849051', '#EFC7BD'],
    title: 'Женская демисезонная куртка limolady 3279',
    price: 24150,
    sale: true,
  },
  {
    img: catalog,
    colors: ['#849051', '#EFC7BD'],
    title: 'Женская демисезонная куртка limolady 3279',
    price: 24150,
    sale: false,
  },
  {
    img: catalog,
    colors: ['#849051', '#EFC7BD'],
    title: 'Женская демисезонная куртка limolady 3279',
    price: 24150,
    sale: true,
  },
]

const infoCategories = ['Климат-контроль', 'Как стирать', 'Материалы', 'Условия доставки']
const infoTexxt = [
  { title: 'Климат-контроль', img: info },
  { title: 'Как стирать', img: info },
  { title: 'Материалы', img: info },
  { title: 'Условия доставки', img: info },
]

const newsArr = [
  {
    title: 'Режим работы в праздничные дни',
    content:
      'Уважаемые покупатели, команда магазина "Умная Одежда" поздравляет вас с Новым годом и Рождеством! Мы желаем вам как можно радостнее и благополучнее провести следующий год! Если вы хотите порадовать себя на праздниках и приобрести себе куртку или пальто с климат-контрлем в нашем магазине, то спешим вас обрадовать - мы работаем все выходные, кроме первого января. В наших розничных магазинах вы сможете купить себе любую понравившуюся вещь, начиная со второго января.',
    date: '28.12.2022',
    img: news,
  },
  {
    title: 'Режим работы в праздничные дни',
    content:
      'Уважаемые покупатели, команда магазина "Умная Одежда" поздравляет вас с Новым годом и Рождеством! Мы желаем вам как можно радостнее и благополучнее провести следующий год! Если вы хотите порадовать себя на праздниках и приобрести себе куртку или пальто с климат-контрлем в нашем магазине, то спешим вас обрадовать - мы работаем все выходные, кроме первого января. В наших розничных магазинах вы сможете купить себе любую понравившуюся вещь, начиная со второго января.',
    date: '28.12.2022',
    img: news,
  },
  {
    title: 'Режим работы в праздничные дни',
    content:
      'Уважаемые покупатели, команда магазина "Умная Одежда" поздравляет вас с Новым годом и Рождеством! Мы желаем вам как можно радостнее и благополучнее провести следующий год! Если вы хотите порадовать себя на праздниках и приобрести себе куртку или пальто с климат-контрлем в нашем магазине, то спешим вас обрадовать - мы работаем все выходные, кроме первого января. В наших розничных магазинах вы сможете купить себе любую понравившуюся вещь, начиная со второго января.',
    date: '28.12.2022',
    img: news,
  },
]

const advs = [
  {
    title: 'Онлайн шопинг или поход в магазин',
    content: 'У нас несколько точек в Санкт-Петербурге',
    img: homeadv1,
  },
  {
    title: 'Бесплатная доставка',
    content: 'Доставим в любую точку России',
    img: homeadv2,
  },
  {
    title: 'Починим куртку даже через 2 года',
    content: 'Гарантия от производителя',
    img: homeadv3,
  },
  {
    title: 'Оплатите при получении, после примерки',
    content: 'Чтобы для вас все было идеально',
    img: homeadv4,
  },
]

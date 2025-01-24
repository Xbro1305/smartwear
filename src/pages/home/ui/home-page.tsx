/* eslint-disable react/jsx-key */
/* eslint-disable max-lines */
import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'

import arrow from '@/assets/images/Vector 46 (Stroke).svg'
import acs from '@/assets/images/homeAcs.png'
import brands from '@/assets/images/homeBrands.png'
import catalog from '@/assets/images/homeCatalog.jpeg'
import fire from '@/assets/images/homeFire.svg'
import heart from '@/assets/images/homeHeart.svg'
import info from '@/assets/images/homeInfo.png'
import intro from '@/assets/images/homeIntro.png'
import man from '@/assets/images/homeMan.jpeg'
import news from '@/assets/images/homeNews.jpeg'
import sales from '@/assets/images/homeSales.png'
import star from '@/assets/images/homeStar.svg'
import woman from '@/assets/images/homeWoman.jpeg'
import homeadv1 from '@/assets/images/homeadv (1).svg'
import homeadv4 from '@/assets/images/homeadv (2).svg'
import homeadv3 from '@/assets/images/homeadv (3).svg'
import homeadv2 from '@/assets/images/homeadv (4).svg'

import styles from '../home.module.scss'

export const HomePage = () => {
  const [checkedInfo, setCheckedInfo] = useState(0)
  const [news, setNews] = useState(newsArr)
  const [mobCheckedInfo, setMobCheckedInfo] = useState(-1)

  return (
    <div className={styles.home}>
      <div className={styles.home_intro}>
        <img alt={''} src={intro} />
        <h1 className={'h1'}>Мембранная одежда с климат-контролем</h1>
        <button className={'button'}>В каталог</button>
      </div>
      <div className={styles.home_brands}>
        <img alt={''} src={brands} />
      </div>
      <div className={styles.home_categories}>
        <h1 className={'h1'}>Категории</h1>
        <div className={styles.home_categories_wrapper}>
          {catalogItems.map(i => (
            <div className={styles.home_categories_item}>
              <img alt={''} src={i.img} />
              <div className={styles.home_categories_item_selector}>
                <h2>Категория</h2> <p>{'>'}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.home_categories_mob}>
          <div className={styles.home_categories_mob_top}>
            <Link to={''}>
              <img alt={''} src={fire} />
              Скидки
            </Link>
            <Link to={''}>
              <img alt={''} src={star} />
              Новые поступления
            </Link>
          </div>
          <div className={styles.home_categories_mob_bottom}>
            <Link className={styles.home_categories_mob_item} to={''}>
              <img alt={''} src={woman} />
              Женские куртки
            </Link>
            <Link className={styles.home_categories_mob_item} to={''}>
              <img alt={''} src={man} />
              Мужские куртки
            </Link>
            <Link className={styles.home_categories_mob_item} to={''}>
              <img alt={''} src={acs} />
              Аксессуары
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.home_sales}>
        <div className={styles.home_sales_left}>
          <h2 className={'h2'}>Скидки до 50% на куртки и ветровки</h2>
          <button className={'button'}>Подробнее</button>
        </div>
        <img alt={''} src={sales} />
      </div>
      <div className={styles.home_recommendations}>
        <h2 className={'h2'}>Рекомендуем на зиму</h2>
        <div className={styles.home_recommendations_wrapper}>
          {recomendations.map(i => (
            <div className={styles.home_recommendations_item}>
              <img alt={''} src={i.img} />
              <div className={styles.home_recommendations_item_info}>
                <div className={styles.home_recommendations_item_top}>
                  <div className={styles.home_recommendations_item_colors}>
                    {i.colors.map(c => (
                      <div
                        className={styles.home_recommendations_item_color}
                        style={{ background: `${c}` }}
                      ></div>
                    ))}
                  </div>
                  <img alt={''} src={heart} />
                </div>
                <h5 className={'h5'}>{i.title}</h5>
                <NumericFormat
                  className={'h5'}
                  decimalSeparator={'.'}
                  displayType={'text'}
                  suffix={' ₽'}
                  thousandSeparator={' '}
                  value={i.price}
                />
                <a className={'button'} href={''}>
                  Подробнее
                </a>
              </div>
            </div>
          ))}
        </div>

        <Slider className={styles.home_recommendations_mob} {...settings}>
          {recomendations.map(i => (
            <div className={styles.home_recommendations_item}>
              <img alt={''} src={i.img} />
              <div className={styles.home_recommendations_item_info}>
                <div className={styles.home_recommendations_item_top}>
                  <div className={styles.home_recommendations_item_colors}>
                    {i.colors.map(c => (
                      <div
                        className={styles.home_recommendations_item_color}
                        style={{ background: `${c}` }}
                      ></div>
                    ))}
                  </div>
                  <img alt={''} src={heart} />
                </div>
                <h5 className={'h5'}>{i.title}</h5>
                <NumericFormat
                  className={'h5'}
                  decimalSeparator={'.'}
                  displayType={'text'}
                  suffix={' ₽'}
                  thousandSeparator={' '}
                  value={i.price}
                />
                <a className={'button'} href={''}>
                  Подробнее
                </a>
              </div>
            </div>
          ))}
        </Slider>
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
          <p className={'p1'}>{infoTexxt[checkedInfo].title}</p>
          <img alt={''} src={infoTexxt[checkedInfo].img} />
        </div>

        <div className={styles.home_info_mob}>
          {infoCategories.map((i, index) => (
            <div
              aria-active={index == mobCheckedInfo ? true : false}
              className={styles.home_info_mob_item}
              onClick={() => {
                index == mobCheckedInfo ? setMobCheckedInfo(-1) : setMobCheckedInfo(index)
              }}
            >
              <h5 className={'h5'}>
                {i}
                <img alt={''} src={arrow} />
              </h5>
              <p className={'p1'}>{infoTexxt[index].title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.home_news}>
        <h2 className={'h2'}>Новости</h2>

        <div className={styles.home_news_wrapper}>
          {news.map(i => (
            <div className={styles.home_news_item}>
              <img alt={''} src={i.img} />
              <div className={styles.home_news_item_right}>
                <span className={'p2'}>{i.date}</span>
                <h5 className={'h5'}>{i.title}</h5>
                <p className={'p2'}>{i.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.home_adv}>
        {advs.map(i => (
          <div className={styles.home_adv_item}>
            <img alt={''} src={i.img} />
            <div className={styles.home_adv_item_right}>
              <h5 className={'h5'}>{i.title}</h5>
              <p className={'p2'}>{i.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.home_contact}>
        <div className={styles.home_contact_left}>
          <h2 className={'h2'}>Контакты</h2>
          <h5 className={'h5'}>Умная Одежда</h5>
          <p className={'p2'}>
            Заневский проспект, 67к2
            <br />
            ТРК «Заневский Каскад-1», 2 этаж, помещение 2-94
            <br />
            <br />8 921 908–00–39
          </p>
          <h5 className={'h5'}>AutoJack & LimoLady</h5>
          <p className={'p2'}>
            Заневский проспект, 67к2
            <br />
            ТРК «Заневский Каскад-1», 1-й этаж, помещение 1-89
            <br />
            <br /> 8 901 300–58–54
          </p>
          <h5 className={'h5'}>NorthBloom</h5>
          <p className={'p2'}>
            Проспект Энгельса, 154
            <br />
            ТРК «Гранд Каньон», 2 этаж, помещение 2-19
            <br />
            <br /> 8 931 364–70–37
          </p>
        </div>
        <iframe
          height={'700'}
          // allowfullscreen=""
          loading={'lazy'}
          src={
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1998.9505168433507!2d30.435165976698904!3d59.93296326255773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x469631fd48c60077%3A0x658b7dc8beb92b9!2z0JfQsNC90LXQstGB0LrQuNC5INC_0YAt0YIuLCA2NyDQutC-0YDQv9GD0YEgMiwg0KHQsNC90LrRgi3Qn9C10YLQtdGA0LHRg9GA0LMsIDE5NTI3Nw!5e0!3m2!1sru!2sru!4v1734367980606!5m2!1sru!2sru'
          }
          style={{ border: '0' }}
          width={'40%'}
          // referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  )
}

function SampleNextArrow(props: any) {
  const { onClick } = props

  return <div className={styles.slick_next} onClick={onClick} />
}

function SamplePrevArrow(props: any) {
  const { onClick } = props

  return <div className={styles.slick_prev} onClick={onClick} />
}

const settings = {
  infinite: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 520,
      settings: {
        initialSlide: 1,
        slidesToScroll: 1,
        slidesToShow: 1,
      },
    },
  ],
  slidesToScroll: 2,
  slidesToShow: 2,
  speed: 500,
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
    colors: ['#849051', '#EFC7BD'],
    img: catalog,
    price: 24150,
    sale: false,
    title: 'Женская демисезонная куртка limolady 3279',
  },
  {
    colors: ['#849051', '#EFC7BD'],
    img: catalog,
    price: 24150,
    sale: false,
    title: 'Женская демисезонная куртка limolady 3279',
  },
  {
    colors: ['#849051', '#EFC7BD'],
    img: catalog,
    price: 24150,
    sale: true,
    title: 'Женская демисезонная куртка limolady 3279',
  },
  {
    colors: ['#849051', '#EFC7BD'],
    img: catalog,
    price: 24150,
    sale: true,
    title: 'Женская демисезонная куртка limolady 3279',
  },
  {
    colors: ['#849051', '#EFC7BD'],
    img: catalog,
    price: 24150,
    sale: false,
    title: 'Женская демисезонная куртка limolady 3279',
  },
  {
    colors: ['#849051', '#EFC7BD'],
    img: catalog,
    price: 24150,
    sale: true,
    title: 'Женская демисезонная куртка limolady 3279',
  },
]

const infoCategories = ['Климат-контроль', 'Как стирать', 'Материалы', 'Условия доставки']

const infoTexxt = [
  { img: info, title: 'Климат-контроль' },
  { img: info, title: 'Как стирать' },
  { img: info, title: 'Материалы' },
  { img: info, title: 'Условия доставки' },
]

const newsArr = [
  {
    content:
      'Уважаемые покупатели, команда магазина "Умная Одежда" поздравляет вас с Новым годом и Рождеством! Мы желаем вам как можно радостнее и благополучнее провести следующий год! Если вы хотите порадовать себя на праздниках и приобрести себе куртку или пальто с климат-контрлем в нашем магазине, то спешим вас обрадовать - мы работаем все выходные, кроме первого января. В наших розничных магазинах вы сможете купить себе любую понравившуюся вещь, начиная со второго января.',
    date: '28.12.2022',
    img: news,
    title: 'Режим работы в праздничные дни',
  },
  {
    content:
      'Уважаемые покупатели, команда магазина "Умная Одежда" поздравляет вас с Новым годом и Рождеством! Мы желаем вам как можно радостнее и благополучнее провести следующий год! Если вы хотите порадовать себя на праздниках и приобрести себе куртку или пальто с климат-контрлем в нашем магазине, то спешим вас обрадовать - мы работаем все выходные, кроме первого января. В наших розничных магазинах вы сможете купить себе любую понравившуюся вещь, начиная со второго января.',
    date: '28.12.2022',
    img: news,
    title: 'Режим работы в праздничные дни',
  },
  {
    content:
      'Уважаемые покупатели, команда магазина "Умная Одежда" поздравляет вас с Новым годом и Рождеством! Мы желаем вам как можно радостнее и благополучнее провести следующий год! Если вы хотите порадовать себя на праздниках и приобрести себе куртку или пальто с климат-контрлем в нашем магазине, то спешим вас обрадовать - мы работаем все выходные, кроме первого января. В наших розничных магазинах вы сможете купить себе любую понравившуюся вещь, начиная со второго января.',
    date: '28.12.2022',
    img: news,
    title: 'Режим работы в праздничные дни',
  },
]

const advs = [
  {
    content: 'У нас несколько точек в Санкт-Петербурге',
    img: homeadv1,
    title: 'Онлайн шопинг или поход в магазин',
  },
  {
    content: 'Доставим в любую точку России',
    img: homeadv2,
    title: 'Бесплатная доставка',
  },
  {
    content: 'Гарантия от производителя',
    img: homeadv3,
    title: 'Починим куртку даже через 2 года',
  },
  {
    content: 'Чтобы для вас все было идеально',
    img: homeadv4,
    title: 'Оплатите при получении, после примерки',
  },
]

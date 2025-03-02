import { useState } from 'react'

import styles from './Profile.module.scss'
import { FaCube, FaHeart, FaTag, FaUser } from 'react-icons/fa'
// import itemImg from '../../../assets/images/image 139.png'
import { Profile_profile } from '../Components/Profile_profile'
import { Orders } from '../Components/Orders'
//import { RegisteredDto } from "@/entities/auth/auth.types";
// import { useNavigate } from 'react-router-dom'

export const ProfilePage = () => {
  const [page, setPage] = useState('profile')

  return (
    <div className={styles.profile_page}>
      <div className={styles.profile_page_navigation}>
        <button
          className={page === 'profile' ? styles.profile_page_navigation_active : ''}
          onClick={() => setPage('profile')}
        >
          <FaUser />
          Профиль
        </button>
        <button
          className={page === 'orders' ? styles.profile_page_navigation_active : ''}
          onClick={() => setPage('orders')}
        >
          <FaCube />
          История заказов
        </button>
        <button
          className={page === 'saved' ? styles.profile_page_navigation_active : ''}
          onClick={() => setPage('saved')}
        >
          <FaHeart />
          Избранные товары
        </button>
        <button
          className={page === 'recommendations' ? styles.profile_page_navigation_active : ''}
          onClick={() => setPage('recommendations')}
        >
          <FaTag />
          Персональные предложения
        </button>
      </div>
      <div className={styles.profile_page_right}>
        {page === 'profile' && <Profile_profile />}
        {page === 'orders' && <Orders />}
      </div>
    </div>
  )
}

// const persData = {
//   active: [
//     {
//       currency: '₽',
//       delivery_method: 'Курьером',
//       expected_delivery_date: '2023-04-02',
//       img: itemImg,
//       order_number: '103-23-321',
//       price: 15000,
//       product_name: 'Мужская демисезонная куртка Autojack 2001',
//       status: 'В пути',
//     },
//     {
//       currency: '₽',
//       delivery_method: 'Курьером',
//       expected_delivery_date: '2023-04-02',
//       img: itemImg,
//       order_number: '103-23-321',
//       price: 15000,
//       product_name: 'Мужская демисезонная куртка Autojack 2001',
//       status: 'Ожидает получения',
//     },
//   ],
//   adresses: [
//     { id: 1, title: 'Санкт-Петербург, Каменноостровский проспект, 4Т, кв. 64' },
//     { id: 2, title: 'Челябинск, улица Цвиллинга, 28, кв. 36' },
//   ],
//   email: 'sameemail@mail.com',
//   history: [
//     {
//       currency: '₽',
//       delivery_method: 'Курьером',
//       expected_delivery_date: '2023-04-02',
//       img: itemImg,
//       order_number: '103-23-321',
//       price: 15000,
//       product_name: 'Мужская демисезонная куртка Autojack 2001',
//       status: 'Отменён',
//     },
//     {
//       currency: '₽',
//       delivery_method: 'Курьером',
//       expected_delivery_date: '2023-04-02',
//       img: itemImg,
//       order_number: '103-23-321',
//       price: 15000,
//       product_name: 'Мужская демисезонная куртка Autojack 2001',
//       status: 'Получен',
//     },
//   ],
//   name: 'Иван',
//   patronomic: 'Иванович',

//   phone: '+7 (000) 00-00-00',
//   surname: 'Иванов',
// }

// <div className={styles.profile}>
//   <div className={styles.profile_top}>
//     <h1 className={styles.profile_top_title}>
//       {surName} {name} {middleName}
//     </h1>
//     <div className={styles.profile_top_sale}>
//       <img alt={'sale'} src={sale} />
//       <div className={styles.profile_top_sale_bottom}>
//         <h1>Ваша скидка 5%</h1>
//         <p>Купите товаров на сумму {next} ₽ и получите скидку 10%</p>
//         <div className={styles.profile_top_sale_bottom_process}>
//           <span>Куплено товаров на сумму {current} ₽</span>
//           <div className={styles.profile_top_sale_line}>
//             <div style={{ width: `${percent}%` }}></div>
//           </div>
//         </div>
//         <Link to={'/discount-program'}>Подробнее о накопительной программе</Link>
//       </div>
//     </div>
//   </div>
//   <div className={styles.profile_personality}>
//     <h1>Персональная информация</h1>
//     <form className={styles.profile_form}>
//       <label className={styles.profile_form_label}>
//         <p>Фамилия</p>
//         <input defaultValue={surName} name={'surname'} type={'text'} />
//       </label>
//       <label className={styles.profile_form_label}>
//         <p>Имя</p>
//         <input defaultValue={name} name={'name'} type={'text'} />
//       </label>
//       <label className={styles.profile_form_label}>
//         <p>Отчество</p>
//         <input defaultValue={middleName} name={'patronomic'} type={'text'} />
//       </label>
//       <label className={styles.profile_form_label}>
//         <p>Номер телефона</p>
//         <PatternFormat
//           allowEmptyFormatting
//           defaultValue={phone}
//           format={'+# (###) ### ##-##'}
//           mask={'_'}
//           name={'phone'}
//         />
//       </label>
//       <label className={styles.profile_form_label}>
//         <p>E-mail</p>
//         <input defaultValue={email} name={'email'} type={'email'} />
//       </label>
//     </form>
//     <label className={styles.profile_form_confirmLabel}>
//       <input type={'checkbox'} />
//       <p style={{ width: '100%' }}>Получать информацию о новинках и распродажах</p>
//     </label>
//   </div>
//   <div className={styles.profile_orders}>
//     <h1 className={styles.profile_orders_title}>Активные заказы</h1>
//     <div className={styles.profile_orders_wrapper}>
//       {persData.active.map((i, index) => (
//         <div className={styles.profile_orders_item} key={index}>
//           <img alt={'order'} src={i.img} />
//           <div>
//             <div className={styles.profile_orders_item_top}>
//               <h1>{i.product_name}</h1>
//               <p>{i.status}</p>
//             </div>
//             <p className={styles.profile_orders_item_price}>
//               <NumericFormat displayType={'text'} thousandSeparator={' '} value={i.price} />{' '}
//               {i.currency}
//             </p>
//             <div className={styles.profile_orders_item_details}>
//               <p>
//                 <span>Способ доставки</span>
//                 <span>{i.delivery_method}</span>
//               </p>
//               <p>
//                 <span>
//                   Дата доставки <img alt={'question'} src={question} />
//                 </span>
//                 <span>{i.expected_delivery_date}</span>
//               </p>
//               <p>
//                 <span>Номер заказа</span>
//                 <span>№{i.order_number}</span>
//               </p>
//             </div>

//             <button className={styles.profile_orders_item_button}>Информация о заказе</button>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
//   <div className={styles.profile_orders}>
//     <h1 className={styles.profile_orders_title}>История заказов</h1>
//     <div className={styles.profile_orders_wrapper}>
//       {persData.history.map((i, index) => (
//         <div className={styles.profile_orders_item} key={index}>
//           <img alt={'order'} src={i.img} />
//           <div>
//             <div className={styles.profile_orders_item_top}>
//               <h1>{i.product_name}</h1>
//               <p>{i.status}</p>
//             </div>
//             <p className={styles.profile_orders_item_price}>
//               <NumericFormat displayType={'text'} thousandSeparator={' '} value={i.price} />{' '}
//               {i.currency}
//             </p>
//             <div className={styles.profile_orders_item_details}>
//               <p>
//                 <span>Способ доставки</span>
//                 <span>{i.delivery_method}</span>
//               </p>
//               <p>
//                 <span>
//                   Дата доставки <img alt={'question'} src={question} />
//                 </span>
//                 <span>{i.expected_delivery_date}</span>
//               </p>
//               <p>
//                 <span>Номер заказа</span>
//                 <span>№{i.order_number}</span>
//               </p>
//             </div>

//             <button className={styles.profile_orders_item_button}>Информация о заказе</button>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
//   <div className={styles.profile_adresses}>
//     <h1 className={styles.profile_adresses_title}>Адреса</h1>
//     {persData.adresses.map(i => (
//       <p key={i.id}>
//         <img alt={'delete'} src={deleteItem} />
//         {i.title}
//       </p>
//     ))}
//   </div>
// </div>

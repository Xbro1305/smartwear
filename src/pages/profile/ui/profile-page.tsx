import styles from './Profile.module.scss'
import { FaCube, FaUser } from 'react-icons/fa'
import { Profile_profile } from '../Components/Profile_profile'
import { Orders } from '../Components/Orders'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTER_PATHS } from '@/shared/config/routes'

const { PROFILE, ORDERPROFILE } = ROUTER_PATHS

export const ProfilePage = () => {
  const { endpointPage } = useParams()
  const navigate = useNavigate()

  const page = endpointPage === 'orders' ? 'orders' : 'profile'

  return (
    <div className={styles.profile_page}>
      <div className={styles.profile_page_navigation}>
        <button
          className={page === 'profile' ? styles.profile_page_navigation_active : ''}
          onClick={() => navigate(PROFILE)}
        >
          <FaUser />
          Профиль
        </button>
        <button
          className={page === 'orders' ? styles.profile_page_navigation_active : ''}
          onClick={() => navigate(ORDERPROFILE)}
        >
          <FaCube />
          История заказов
        </button>
        {/* <button
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
        </button> */}
      </div>
      <div className={styles.profile_page_right}>
        {page === 'profile' && <Profile_profile />}
        {page === 'orders' && <Orders />}
      </div>
    </div>
  )
}

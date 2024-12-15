import { useNavigate } from 'react-router-dom'
import '@/app/global.css'
import styles from '../home.module.scss'
import intro from '@/assets/images/homeIntro.png'
import brands from '@/assets/images/homeBrands.png'

export const HomePage = () => {
  const navigate = useNavigate()

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
    </div>
  )
}

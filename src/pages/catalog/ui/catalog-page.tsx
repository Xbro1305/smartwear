import styles from './catalog.module.scss'
import { Link } from 'react-router-dom'
import man from '@/assets/images/homeMan.jpeg'
import woman from '@/assets/images/homeWoman.jpeg'
import banner from '@/assets/images/catalogBanner.svg'
import acs from '@/assets/images/homeAcs.png'
import star from '@/assets/images/homeStar.svg'
import fire from '@/assets/images/homeFire.svg'
import { ROUTER_PATHS as paths } from '@/shared/config/routes'

export const CatalogPage = () => {
  return (
    <div className={styles.catalog}>
      <div className={styles.catalog_top}>
        <img src={banner} alt="" />
      </div>
      <div className={styles.catalog_wrapper}>
        <div className={styles.catalog_wrapper_top}>
          <Link to={paths.SALES}>
            <img src={fire} alt="" />
            Скидки
          </Link>
          <Link to={paths.NEWS}>
            <img src={star} alt="" />
            Новые поступления
          </Link>
        </div>
        <div className={styles.catalog_bottom}>
          <Link to={paths.WOMEN} className={styles.catalog_item}>
            <img src={woman} alt="" />
            Женские куртки
          </Link>
          <Link to={paths.MEN} className={styles.catalog_item}>
            <img src={man} alt="" />
            Мужские куртки
          </Link>
          <Link to={paths.ACS} className={styles.catalog_item}>
            <img src={acs} alt="" />
            Аксессуары
          </Link>
        </div>
      </div>
    </div>
  )
}

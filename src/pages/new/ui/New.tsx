import styles from '@/pages/article/ui/Articles.module.scss'
import { ROUTER_PATHS } from '@/shared/config/routes'
import img from '@/assets/images/Rectangle 992.png'
import { useParams } from 'react-router-dom'

const { CATALOG } = ROUTER_PATHS

const data = {
  content: `<h4>Объявляем распродажу ветровок и плащей. Скидки также действуют на некоторые демисезонные и зимние модели. Распродажа длится до 28 марта. Обновляйте летний гардероб в <a href=${CATALOG}>разделе «Скидки»</a>!</h4>`,
  id: 1,
  date: '10/10/2022 17:51:04',
  title: 'Скидки на летние куртки!',
  imageUrl: img,
}

export const New = () => {
  const { name } = useParams<{ name: string }>()

  return (
    <div
      style={{ padding: 'var(--top-padding) var(--sides-padding)' }}
      className={styles.articles_item}
    >
      <div className={styles.articles_item_left}>
        <p className="p1" style={{ color: 'var(--service)' }}>
          {data.date}
        </p>
        <h1 style={{ inlineSize: '100%' }}>{data.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>

      <div className={styles.articles_item_right}>
        {data.imageUrl && <img src={data.imageUrl} alt="cat" />}
      </div>
    </div>
  )
}

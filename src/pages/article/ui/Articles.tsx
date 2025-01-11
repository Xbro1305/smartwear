import { useParams } from 'react-router-dom'
import styles from './Articles.module.scss'
import img from '@/assets/images/Cat.png'
import someImg from '@/assets/images/Rectangle 992.png'
import ad from '@/assets/images/img.png'
import { AiFillLike, AiFillDislike } from 'react-icons/ai'
import { ArticleDto, Composition, Section, ParagraphDto } from '@/entities/article/article.types'

const article: ArticleDto = {
  composition: Composition.LEFT,
  description:
    'Большая часть одежды, представленной в нашем магазине, обладает особыми свойствами. Конечно, особые свойства одежды требуют особого ухода. В данной статье мы расскажем, как правильно стирать одежду с климат-контролем фирм AutoJack, LimoLady, NordWind, NorthBloom, WestBloom и Technology of Comfort.',
  id: 1,
  metaDescription: 'metaDescription',
  metaTitle: 'metaTitle',
  section: Section.SEO,
  title: 'Как стирать одежду с климат-контролем',
  userId: 1,
  imageUrl: someImg,
  paragraphs: [
    {
      articleId: 1,
      content:
        "<p className='p1'>Лёгкие загрязнения можно удалить и без использования стиральной машины. После того,как пятно высохнет, его можно удалить салфеткой или мягкой щёткой. При этомпостарайтесь не втирать грязь в поры изделия, а стряхивать или смывать её. Также спятнами способно справиться обычное хозяйственное мыло. Оно не забивает поры вмембранной ткани и легко смывается водой. Постарайтесь ликвидировать загрязнения какможно быстрее, не откладывая этот процесс «на потом». Иначе удаление пятен можетзанять больше усилий. И все‑таки при наличии сильных загрязнений или переддлительным хранением рекомендуется изделие постирать.,</p>",
      id: 1,
      order: 1,
      title: 'Для начала — стирать вовсе не обязательно!',
    },
    {
      articleId: 1,
      content:
        "<p className='p1'>Не стоит волноваться, стирать куртки и пальто из мембранных тканей все‑таки можно, еслисоблюдать необходимые меры предосторожности. </p> <br/> <ol><li className='p1'>  Самое главное правило — стирка при температуре не более 30°C. В противном случае есть  риск разрушения синтетических волокон утеплителя и повреждения мембранной структуры  ткани.</li><li className='p1'>  Перед стиркой необходимо застегнуть все молнии, кнопки, включая те, которые находятся на  карманах и декоративных элементах, снять мех с изделия.</li><li className='p1'>  Новое цветное изделие необходимо стирать отдельно от других вещей, так как вода во время  стирки может окрашиваться.</li><li className='p1'>  Не используйте стиральный порошок, так как он забивает поры мембранной ткани. Вместо  него отдайте предпочтение гелю для стирки. По той же причине не рекомендуется  использовать жидкие средства со смягчающими, антистатическими, отбеливающими и  цветосохраняющими добавками для шерсти, шелка и прочего.</li><li className='p1'>  Во избежание появления разводов на изделии не стоит использовать кондиционеры, так как  они вымывают цвет из изделия.</li><li className='p1'>  Отжимать куртки и пальто после стирки на высоких оборотах не стоит, потому что это  негативно сказывается на структуре утеплителя и на внешнем виде изделия в целом.</li><li className='p1'>После стирки прополощите одежду.</li><li className='p1'>  Сушите изделие в расправленном виде при комнатной температуре. Сушка с использованием  специальных приборов (любых, даже батареи) приводит к разрушению мембранной ткани и  повреждает утеплитель.</li></ol>",
      id: 2,
      imageUrl: img,
      order: 2,
      title: 'Если стирка все-таки неизбежна',
    },
  ] as ParagraphDto[],
}

const Articles = () => {
  const { name } = useParams<{ name: string }>()

  return (
    <div className={styles.articles}>
      <div className={styles.articles_item}>
        <div className={styles.articles_item_left}>
          <h1 className="h1">{article.title}</h1>
          <h4 className="h4">{article.description}</h4>
        </div>
        <div className={styles.articles_item_right}>
          {article.imageUrl && <img src={article.imageUrl} alt="cat" />}
        </div>
      </div>

      {article.paragraphs.map(paragraph => (
        <div
          style={{
            flexDirection: article.composition === Composition.RIGHT ? 'row-reverse' : 'row',
          }}
          className={styles.articles_item}
        >
          <div className={styles.articles_item_left}>
            <h4 className="h4">{paragraph.title}</h4>
            <div dangerouslySetInnerHTML={{ __html: paragraph.content }} />
          </div>
          <div className={styles.articles_item_right}>
            {paragraph.imageUrl && <img src={paragraph.imageUrl} alt="cat" />}
          </div>
        </div>
      ))}
      <div className={styles.articles_like_dislike}>
        <h4 className="h4">Статья была полезна?</h4>
        <div className={styles.articles_like_dislike_icons}>
          <AiFillLike />
          <AiFillDislike />
        </div>
      </div>
      <div className={styles.articles_item}>
        <div className={styles.articles_ad}>
          <div className={styles.articles_ad_left}>
            <h3 className="h3">Распродажа в Чёрную пятницу!</h3>
            <p className="p1">Скидки до 50% на все зимние куртки</p>
            <button className="button">На страницу распродажи</button>
          </div>
          <img src={ad} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Articles

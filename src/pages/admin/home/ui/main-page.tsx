import styles from './home.module.scss'
import { ChartComponent } from './chart'

//labels первого компанента (sellsLabel)
const sellsL = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14']
const sellsPoints = [380, 204, 222, 203, 312, 318, 115, 145, 120, 128, 143, 176, 140, 145]

export const MainPage = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '400px',
        padding: '20px',
        borderRadius: '10px',
      }}
      className={styles.adminHome}
    >
      <ChartComponent points={sellsPoints} labels={sellsL} max={600} />
    </div>
  )
}

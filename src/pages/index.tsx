import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import type { NextPage } from 'next'
import styles from '@/components/index.module.css'
import { usePrefectureCharthooks } from '@/components/peges/hooks'
const Home: NextPage = () => {
  const { prefectures, getAxiosPrefecturesPopulation, options } = usePrefectureCharthooks()
  return (
    <>
      <div className={styles.center}>
        <div className={styles.card}>
          <div>
            <div className={styles.pad}>
              <h1 className={styles.title}>各都道府県における総人口推移</h1>
              <span>都道府県</span>
              <div className={styles.flex}>
                {prefectures.map((prefecture) => (
                  <label>
                    <input
                      type="checkbox"
                      value={prefecture.prefCode}
                      onChange={getAxiosPrefecturesPopulation}
                    />
                    {prefecture.prefName}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

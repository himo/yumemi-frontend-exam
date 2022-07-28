import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { usePrefectureCharthooks } from '@/components/pages/hooks'
import { Center } from '@/components/center'
import { Card } from '@/components/card'
import { Padding } from '@/components/padding'
import { RenderPrefecture } from '@/components/renderprefecture'

const Home = () => {
  const { prefectures, getAxiosPrefecturesPopulation, options, chartRef } =
    usePrefectureCharthooks()

  return (
    <>
      <Center>
        <Card>
          <div>
            <Padding>
              <h1>各都道府県における総人口推移</h1>
              <span>都道府県</span>
              <RenderPrefecture
                prefectures={prefectures}
                changefunc={getAxiosPrefecturesPopulation}
              />
              <Padding>
                <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
              </Padding>
            </Padding>
          </div>
        </Card>
      </Center>
    </>
  )
}

export default Home

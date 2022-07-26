import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import type { NextPage } from 'next'
import { usePrefectureCharthooks } from '@/components/peges/hooks'
import { Center } from '@/components/center'
import { Card } from '@/components/card'
import { Padding } from '@/components/padding'
import { RenderPrefecture } from '@/components/renderprefecture'
const Home: NextPage = () => {
  const { prefectures, getAxiosPrefecturesPopulation, options } = usePrefectureCharthooks()
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
            </Padding>
            <Padding>
              <HighchartsReact highcharts={Highcharts} options={options} />
            </Padding>
          </div>
        </Card>
      </Center>
    </>
  )
}

export default Home

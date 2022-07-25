import axios, { AxiosResponse } from 'axios'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import styles from './components/index.module.css'

const Home: NextPage = () => {
  type RasasDataResponse = {
    statusCode?: string
    message?: string | null
    description?: string
    result?: PrefecturesData[]
  }

  type seriesHighcharts = {
    name: string
    data: number[]
  }

  type PrefecturesData = {
    prefCode: number
    prefName: string
    selected?: boolean
    data?: { year: number; value: number }[]
  }
  const [prefectures, setPrefectures] = useState<PrefecturesData[]>([])
  const [valuesForHighcharts, setValuesForHighcharts] = useState<
    seriesHighcharts[]
  >([])
  const [y_AxisYears, setY_AxisYears] = useState<number[]>([])

  const isPrefecturesData = (data: unknown): data is PrefecturesData[] => {
    return typeof data === 'object'
  }

  useEffect(() => {
    const getAxiosPrefecturesData = async () => {
      if (typeof process.env.NEXT_PUBLIC_API_KEY === 'string') {
        const response: AxiosResponse<RasasDataResponse> = await axios.get(
          'https://opendata.resas-portal.go.jp/api/v1/prefectures',
          {
            headers: { 'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY },
          },
        )
        if (isPrefecturesData(response.data.result)) {
          setPrefectures([...response.data.result])
        }
      }
    }
    void getAxiosPrefecturesData()
  }, [])

  const getAxiosPrefecturesPopulation = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const updatedPrefectures = await Promise.all(
      prefectures.map(async (x) => {
        if (e.currentTarget.value == String(x.prefCode)) {
          if (e.target.checked) {
            x.selected = true
            if (!('data' in x)) {
              const url =
                'https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode='.concat(
                  String(x.prefCode),
                )
              const use = async () => {
                if (typeof process.env.NEXT_PUBLIC_API_KEY === 'string') {
                  const response2 = await axios.get(url, {
                    headers: {
                      'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY,
                    },
                  })
                  x.data = [...response2.data.result.data[0].data]
                }
              }
              await use()
            }
          } else {
            x.selected = false
          }
        }
        return x
      }),
    ).catch()
    renderHighCharts()
    setPrefectures(updatedPrefectures)
  }

  const renderHighCharts = () => {
    const x_AxisYears =
      prefectures.find((x) => x.data)?.data?.map((x) => x.year) ?? []
    setY_AxisYears(x_AxisYears)

    const chartIntoValue = prefectures
      .filter((x) => x.selected)
      .map(
        (x: PrefecturesData): seriesHighcharts => ({
          name: x.prefName,
          data: x.data?.map((x) => x.value) ?? [],
        }),
      )
    setValuesForHighcharts(chartIntoValue)
  }

  const options = {
    chart: {
      polar: true,
      type: 'line',
    },

    title: {
      text: '総人口推移',
    },

    xAxis: {
      categories: y_AxisYears,
      tickmarkPlacement: 'on',
      lineWidth: 0,
      title: {
        text: '年',
      },
    },

    yAxis: {
      title: {
        text: '人口数',
      },
    },

    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
    },

    series: valuesForHighcharts,
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal',
            },
          },
        },
      ],
    },
  }

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

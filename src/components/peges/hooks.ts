import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { RasasDataResponse, SeriesHighcharts, PrefecturesData } from '~/types'

export const usePrefectureCharthooks = () => {
  const [prefectures, setPrefectures] = useState<PrefecturesData[]>([])
  const [valuesForHighcharts, setValuesForHighcharts] = useState<SeriesHighcharts[]>([])
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
    const x_AxisYears = prefectures.find((x) => x.data)?.data?.map((x) => x.year) ?? []
    setY_AxisYears(x_AxisYears)

    const chartIntoValue = prefectures
      .filter((x) => x.selected)
      .map(
        (x: PrefecturesData): SeriesHighcharts => ({
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
  return {
    prefectures,
    getAxiosPrefecturesPopulation,
    options,
  }
}

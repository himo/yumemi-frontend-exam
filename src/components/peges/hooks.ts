import axios, { AxiosResponse } from 'axios'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useRef, useState } from 'react'
import {
  SeriesHighcharts,
  PrefecturesData,
  PrefectureAPIResponse,
  PrefPopulation,
  PrefName,
} from '~/types'

export const usePrefectureCharthooks = () => {
  const [prefectures, setPrefectures] = useState<PrefecturesData[]>([])
  const [valuesForHighcharts, setValuesForHighcharts] = useState<SeriesHighcharts[]>([])
  const [x_AxisYears, setX_AxisYears] = useState<number[]>([])
  const chartRef = useRef<HighchartsReact.RefObject>(null)

  useEffect(() => {
    const getAxiosPrefecturesData = async () => {
      const response: AxiosResponse<PrefectureAPIResponse<PrefName[]>> = await axios.get(
        '/api/prefectures',
      )
      if (response.data.message === 'success' && response.data.result) {
        setPrefectures([...response.data.result]) // [{prefCode: 1, prefName: '北海道'}...]
      } else {
        alert(response.data.message)
      }
    }
    void getAxiosPrefecturesData()
  }, [])

  const getAxiosPrefecturesPopulation = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const updatedPrefectures = await Promise.all(
      prefectures.map(async (x) => {
        if (e.currentTarget.value === String(x.prefCode)) {
          x.data = x.data ?? (await getAxiosPopulation(x.prefCode))
          x.data?.length ? (x.selected = e.target.checked) : (e.target.checked = !e.target.checked) //エラーが発生し、dataが入っていない場合チェックを外す
        }
        return x
      }),
    )
    renderHighCharts()
    setPrefectures(updatedPrefectures) //都道府県にチェックを入れたときその都道府県にselectedとdata要素を追加
    //[{ prefCode: 1, prefName: '北海道', selected: true, data[{ year: 1960, value: 1426606 }] }...]
    //                                                                 [年]            [人]
  }

  const getAxiosPopulation = async (prefCode: number) => {
    chartRef.current?.chart.showLoading() //Vercelと開発環境には、データの取得速度に差があるため、ローディング画面を表示したほうが良い
    const response: AxiosResponse<PrefectureAPIResponse<PrefPopulation>> = await axios.get(
      '/api/populationPerYear/'.concat(String(prefCode)),
    )
    if (response.data.message === 'success' && response.data.result) {
      return [...(response.data.result.data[0].data ?? [])] // [{ year: 1960, value: 1426606 },...]
      //                                            [年]           [人]
    } else {
      alert(response.data.message)
      return undefined
    }
  }

  const renderHighCharts = () => {
    //Highchartsに渡すx軸を取得したいため、データの入ってるところからyearのみの配列を返す
    const x_findAxisYears = prefectures.find((x) => x.data)?.data?.map((x) => x.year) ?? []
    setX_AxisYears(x_findAxisYears) // [1960,...]

    const chartIntoValue = prefectures.map(
      (x: PrefecturesData): SeriesHighcharts => ({
        name: x.prefName,
        data: x.data?.map((x) => x.value) ?? [],
        visible: x.selected ? true : false, //       Highchat側で、表示するseriesの表示非表示を行ったほうが良い
        showInLegend: x.selected ? true : false, //  filterで処理を行うとHighchatはseriesの上から順に処理を行うため、色、線が変わり、多くのグラフのアニメーションが表示される
      }),
    )
    setValuesForHighcharts(chartIntoValue) // {name: '北海道', data: [5039206,...], visible: true, showInLegend: true}
    chartRef.current?.chart.hideLoading()
  }

  const options = {
    accessibility: {
      enabled: false,
    },

    chart: {
      type: 'line',
    },

    title: {
      text: '総人口推移',
    },

    xAxis: {
      categories: x_AxisYears,
      title: {
        text: '年度',
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
    chartRef,
  }
}

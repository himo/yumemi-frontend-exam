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
      const response: AxiosResponse<PrefectureAPIResponse<PrefName>> = await axios.get(
        '/api/prefectures',
      )
      if (response.data.message === 'success' && response.data.result) {
        setPrefectures([...response.data.result])
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
          x.data = x.data ?? (await getPopulationFromApi(x.prefCode))
          x.data?.length ? (x.selected = e.target.checked) : (e.target.checked = !e.target.checked)
        }
        return x
      }),
    ).catch()
    renderHighCharts()
    setPrefectures(updatedPrefectures)
  }

  const getPopulationFromApi = async (prefCode: number) => {
    chartRef.current?.chart.showLoading()
    const response: AxiosResponse<PrefectureAPIResponse<PrefPopulation>> = await axios.get(
      '/api/populationPerYear/'.concat(String(prefCode)),
    )
    if (response.data.message === 'success' && response.data.result?.data[0].data) {
      return [...response.data.result?.data[0].data]
    } else {
      alert(response.data.message)
      return undefined
    }
  }

  const renderHighCharts = () => {
    const x_AxisYears = prefectures.find((x) => x.data)?.data?.map((x) => x.year) ?? []
    setX_AxisYears(x_AxisYears)

    const chartIntoValue = prefectures.map(
      (x: PrefecturesData): SeriesHighcharts => ({
        name: x.prefName,
        data: x.data?.map((x) => x.value) ?? [],
        visible: x.selected ? true : false,
        showInLegend: x.selected ? true : false,
      }),
    )
    setValuesForHighcharts(chartIntoValue)
    chartRef.current?.chart.hideLoading()
  }

  const options = {
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

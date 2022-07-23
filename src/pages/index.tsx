import axios, { AxiosResponse } from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  type RasasDataResponse = {
    statusCode?: string
    message?: string | null
    description?: string
    result?: PrefecturesData[]
  }

  type PrefecturesData = {
    prefCode: number
    prefName: string
    selected?: boolean
    data?: { year: number; value: number }[]
  }
  const [prefectures, setPrefectures] = useState<PrefecturesData[]>([])

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

  return (
    <>
      <div>
        {prefectures.map((prefecture) => (
          <>
            <input type="checkbox" value={prefecture.prefCode} />
            <label htmlFor={prefecture.prefName}>{prefecture.prefName}</label>
            <br />
          </>
        ))}
      </div>
    </>
  )
}

export default Home

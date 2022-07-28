export type RasasDataResponse<T> = {
  statusCode?: string
  message?: string | null
  description?: string
  result?: T
}

export type SeriesHighcharts = {
  name: string
  data: number[]
  visible: boolean
  showInLegend: boolean
}

export type PrefecturesData = {
  prefCode: number
  prefName: string
  selected?: boolean
  data?: { year: number; value: number }[]
}

export type PrefectureAPIResponse<T> = {
  message: string
  result: T | undefined
}

export type PrefPopulation = {
  data: {
    data: {
      year: number
      value: number
    }[]
  }[]
}

export type PrefName = {
  prefCode: number
  prefName: string
}[]

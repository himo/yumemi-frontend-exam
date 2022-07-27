export type RasasDataResponse = {
  statusCode?: string
  message?: string | null
  description?: string
  result?: PrefecturesData[]
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

export type prefectureAPIResponse = {
  message: string
  result: any
}
